/*
    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
*/

package com.adobe.phonegap.contentsync;

import java.io.BufferedInputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.HttpURLConnection;
import java.net.URLConnection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.zip.GZIPInputStream;
import java.util.zip.Inflater;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.SSLSocketFactory;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaResourceApi;
import org.apache.cordova.CordovaResourceApi.OpenForReadResult;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.res.AssetManager;
import android.net.Uri;
import android.os.Environment;
import android.os.StatFs;
import android.util.Log;
import android.util.Patterns;
import android.webkit.CookieManager;

public class Sync extends CordovaPlugin {
    private static final int STATUS_STOPPED = 0;
    private static final int STATUS_DOWNLOADING = 1;
    private static final int STATUS_EXTRACTING = 2;
    private static final int STATUS_COMPLETE = 3;

    public static final int INVALID_URL_ERROR = 1;
    public static final int CONNECTION_ERROR = 2;
    public static final int UNZIP_ERROR = 3;

    private static final String PROP_LOCAL_PATH = "localPath";
    private static final String PROP_STATUS = "status";
    private static final String PROP_PROGRESS = "progress";
    private static final String PROP_LOADED = "loaded";
    private static final String PROP_TOTAL = "total";
    private static final String PROP_CACHED = "cached";
    // Type
    private static final String TYPE_REPLACE = "replace";
    private static final String TYPE_MERGE = "merge";
    private static final String TYPE_LOCAL = "local";

    private static final String LOG_TAG = "ContentSync";

    private static HashMap<String, ProgressEvent> activeRequests = new HashMap<String, ProgressEvent>();
    private static final int MAX_BUFFER_SIZE = 16 * 1024;

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
        if (action.equals("sync")) {
            sync(args, callbackContext);
            return true;
        } else if (action.equals("download")) {
            final String source = args.getString(0);
            // Production
            String outputDirectory = cordova.getActivity().getCacheDir().getAbsolutePath();
            // Testing
            //String outputDirectory = cordova.getActivity().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
            String filename = source.substring(source.lastIndexOf("/")+1, source.length());
            final File target = new File(outputDirectory, filename);
            // @TODO we need these
            final JSONObject headers = new JSONObject();
            final CallbackContext finalContext = callbackContext;
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    if (download(source, target, headers, createProgressEvent("download"), finalContext)) {
                        JSONObject retval = new JSONObject();
                        try {
                            retval.put("archiveURL", target.getAbsolutePath());
                        } catch (JSONException e) {
                            // never happens
                        }
                        finalContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, retval));
                    }
                }
            });
            return true;
        } else if (action.equals("unzip")) {
            String tempPath = args.getString(0);
            if (tempPath.startsWith("file://")) {
                tempPath = tempPath.substring(7);
            }
            final File source = new File(tempPath);
            final String target = args.getString(1);
            final CallbackContext finalContext = callbackContext;
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    unzipSync(source, target, createProgressEvent("unzip"), finalContext);
                    finalContext.sendPluginResult(new PluginResult(PluginResult.Status.OK));
                }
            });
            return true;
        } else if (action.equals("cancel")) {
            ProgressEvent progress = activeRequests.get(args.getString(0));
            if (progress != null) {
                progress.setAborted(true);
            }
        }
        return false;
    }

    /**
     * Adds an interface method to an InputStream to return the number of bytes
     * read from the raw stream. This is used to track total progress against
     * the HTTP Content-Length header value from the server.
     */
    private static abstract class TrackingInputStream extends FilterInputStream {
        public TrackingInputStream(final InputStream in) {
            super(in);
        }
        public abstract long getTotalRawBytesRead();
    }

    private static class ExposedGZIPInputStream extends GZIPInputStream {
        public ExposedGZIPInputStream(final InputStream in) throws IOException {
            super(in);
        }
        public Inflater getInflater() {
            return inf;
        }
    }

    /**
     * Provides raw bytes-read tracking for a GZIP input stream. Reports the
     * total number of compressed bytes read from the input, rather than the
     * number of uncompressed bytes.
     */
    private static class TrackingGZIPInputStream extends TrackingInputStream {
        private ExposedGZIPInputStream gzin;
        public TrackingGZIPInputStream(final ExposedGZIPInputStream gzin) throws IOException {
            super(gzin);
            this.gzin = gzin;
        }
        public long getTotalRawBytesRead() {
            return gzin.getInflater().getBytesRead();
        }
    }

    /**
     * Provides simple total-bytes-read tracking for an existing InputStream
     */
    private static class SimpleTrackingInputStream extends TrackingInputStream {
        private long bytesRead = 0;
        public SimpleTrackingInputStream(InputStream stream) {
            super(stream);
        }

        private int updateBytesRead(int newBytesRead) {
          if (newBytesRead != -1) {
            bytesRead += newBytesRead;
          }
          return newBytesRead;
        }

        @Override
        public int read() throws IOException {
            return updateBytesRead(super.read());
        }

        // Note: FilterInputStream delegates read(byte[] bytes) to the below method,
        // so we don't override it or else double count (CB-5631).
        @Override
        public int read(byte[] bytes, int offset, int count) throws IOException {
            return updateBytesRead(super.read(bytes, offset, count));
        }

        public long getTotalRawBytesRead() {
          return bytesRead;
        }
    }

    private boolean  download(final String source, final File file, final JSONObject headers, final ProgressEvent progress, final CallbackContext callbackContext) {
        Log.d(LOG_TAG, "download " + source);

        if (!Patterns.WEB_URL.matcher(source).matches()) {
            sendErrorMessage("Invalid URL", INVALID_URL_ERROR, callbackContext);
            return false;
        }

        final CordovaResourceApi resourceApi = webView.getResourceApi();
        final Uri sourceUri = resourceApi.remapUri(Uri.parse(source));

        final boolean trustEveryone = false;
        int uriType = CordovaResourceApi.getUriType(sourceUri);
        final boolean useHttps = uriType == CordovaResourceApi.URI_TYPE_HTTPS;
        final boolean isLocalTransfer = !useHttps && uriType != CordovaResourceApi.URI_TYPE_HTTP;

        synchronized (progress) {
            if (progress.isAborted()) {
                return false;
            }
        }
        HttpURLConnection connection = null;
        HostnameVerifier oldHostnameVerifier = null;
        SSLSocketFactory oldSocketFactory = null;
        PluginResult result = null;
        TrackingInputStream inputStream = null;
        boolean cached = false;

        OutputStream outputStream = null;
        try {
            OpenForReadResult readResult = null;
            final Uri targetUri = resourceApi.remapUri(Uri.fromFile(file));

            progress.setTargetFile(file);
            progress.setStatus(STATUS_DOWNLOADING);

            Log.d(LOG_TAG, "Download file: " + sourceUri);
            Log.d(LOG_TAG, "Target file: " + file);
            Log.d(LOG_TAG, "size = " + file.length());


            if (isLocalTransfer) {
                readResult = resourceApi.openForRead(sourceUri);
                if (readResult.length != -1) {
                    progress.setTotal(readResult.length);
                }
                inputStream = new SimpleTrackingInputStream(readResult.inputStream);
            } else {
                // connect to server
                // Open a HTTP connection to the URL based on protocol
                connection = resourceApi.createHttpConnection(sourceUri);
                if (useHttps && trustEveryone) {
                    // Setup the HTTPS connection class to trust everyone
                    HttpsURLConnection https = (HttpsURLConnection)connection;
                    oldSocketFactory = trustAllHosts(https);
                    // Save the current hostnameVerifier
                    oldHostnameVerifier = https.getHostnameVerifier();
                    // Setup the connection not to verify hostnames
                    https.setHostnameVerifier(DO_NOT_VERIFY);
                }

                connection.setRequestMethod("GET");

                // TODO: Make OkHttp use this CookieManager by default.
                String cookie = getCookies(sourceUri.toString());

                if(cookie != null)
                {
                    connection.setRequestProperty("cookie", cookie);
                }

                // This must be explicitly set for gzip progress tracking to work.
                connection.setRequestProperty("Accept-Encoding", "gzip");

                // Handle the other headers
                if (headers != null) {
                    addHeadersToRequest(connection, headers);
                }

                connection.connect();
                if (connection.getResponseCode() == HttpURLConnection.HTTP_NOT_MODIFIED) {
                    cached = true;
                    connection.disconnect();
                    sendErrorMessage("Resource not modified: " + source, CONNECTION_ERROR, callbackContext);
                    return false;
                } else {
                    if (connection.getContentEncoding() == null || connection.getContentEncoding().equalsIgnoreCase("gzip")) {
                        // Only trust content-length header if we understand
                        // the encoding -- identity or gzip
                        int connectionLength = connection.getContentLength();
                        if (connectionLength != -1) {
                            if (connectionLength > getFreeSpace()) {
                                cached = true;
                                connection.disconnect();
                                sendErrorMessage("Not enough free space to download", CONNECTION_ERROR, callbackContext);
                                return false;
                            } else {
                                progress.setTotal(connectionLength);
                            }
                        }
                    }
                    inputStream = getInputStream(connection);
                }
            }

            if (!cached) {
                try {
                    synchronized (progress) {
                        if (progress.isAborted()) {
                            return false;
                        }
                        //progress.connection = connection;
                    }

                    // write bytes to file
                    byte[] buffer = new byte[MAX_BUFFER_SIZE];
                    int bytesRead = 0;
                    outputStream = resourceApi.openOutputStream(targetUri);
                    while ((bytesRead = inputStream.read(buffer)) > 0) {
                        synchronized (progress) {
                            if (progress.isAborted()) {
                                return false;
                            }
                        }
                        Log.d(LOG_TAG, "bytes read = " + bytesRead);
                        outputStream.write(buffer, 0, bytesRead);
                        // Send a progress event.
                        progress.setLoaded(inputStream.getTotalRawBytesRead());

                        updateProgress(callbackContext, progress);
                    }
                } finally {
                    synchronized (progress) {
                        //progress.connection = null;
                    }
                    safeClose(inputStream);
                    safeClose(outputStream);
                }
            }

        } catch (Throwable e) {
            sendErrorMessage(e.getLocalizedMessage(), CONNECTION_ERROR, callbackContext);
        } finally {
            if (connection != null) {
                // Revert back to the proper verifier and socket factories
                if (trustEveryone && useHttps) {
                    HttpsURLConnection https = (HttpsURLConnection) connection;
                    https.setHostnameVerifier(oldHostnameVerifier);
                    https.setSSLSocketFactory(oldSocketFactory);
                }
            }
        }

        return true;
    }

    private void sendErrorMessage(String message, int type, CallbackContext callbackContext) {
        Log.e(LOG_TAG, message);
        callbackContext.error(type);
    }

    private long getFreeSpace() {
        File path = Environment.getDataDirectory();
        StatFs stat = new StatFs(path.getPath());
        long blockSize = stat.getBlockSize();
        long availableBlocks = stat.getAvailableBlocks();
        return availableBlocks * blockSize;
    }

    private ProgressEvent createProgressEvent(String id) {
        ProgressEvent progress = new ProgressEvent();
        synchronized (activeRequests) {
            activeRequests.put(id, progress);
        }
        return progress;
    }

    private void sync(final JSONArray args, final CallbackContext callbackContext) throws JSONException {
        // get args
        final String src = args.getString(0);
        final String id = args.getString(1);
        final JSONObject headers;
        if (args.optJSONObject(3) != null) {
            headers = args.optJSONObject(3);
        } else {
            headers = new JSONObject();
        }
        final boolean copyCordovaAssets = args.getBoolean(4);
        Log.d(LOG_TAG, "sync called with id = " + id + " and src = " + src + "!");

        final ProgressEvent progress = createProgressEvent(id);

        /**
         * need to clear cache or Android won't pick up on the replaced
         * content
         */
        cordova.getActivity().runOnUiThread(new Runnable() {
            public void run() {
                webView.clearCache(true);
            }
        });

        cordova.getThreadPool().execute(new Runnable() {
            public void run() {
                synchronized (progress) {
                    if (progress.isAborted()) {
                        return;
                    }
                }

                String outputDirectory = getOutputDirectory(id);

                // Check to see if we should just return the cached version
                String type = args.optString(2, TYPE_REPLACE);
                Log.d(LOG_TAG, "type = " + type);
                File dir = new File(outputDirectory);
                if (type.equals(TYPE_LOCAL) && !dir.exists()) {
                    type = TYPE_REPLACE;
                }

                if (!type.equals(TYPE_LOCAL)) {
                    // download file
                    if (download(src, createDownloadFileLocation(id), headers, progress, callbackContext)) {
                        // update progress with zip file
                        File targetFile = progress.getTargetFile();
                        Log.d(LOG_TAG, "downloaded = " + targetFile.getAbsolutePath());

                        // Backup existing directory
                        File backup = backupExistingDirectory(outputDirectory, type, dir);

                        // unzip
                        boolean win = unzipSync(targetFile, outputDirectory, progress, callbackContext);

                        // delete temp file
                        targetFile.delete();

                        if (copyCordovaAssets) {
                            copyAssets(outputDirectory);
                        }

                        if (win) {
                            // success, remove backup
                            removeFolder(backup);
                        } else {
                            // failure, revert backup
                            removeFolder(dir);
                            backup.renameTo(dir);
                        }
                    } else {
                        return;
                    }
                }

                // complete
                synchronized (activeRequests) {
                    activeRequests.remove(id);
                }

                // Send last progress event
                progress.setStatus(STATUS_COMPLETE);
                updateProgress(callbackContext, progress);

                // Send completion message
                try {
                    JSONObject result = new JSONObject();
                    result.put(PROP_LOCAL_PATH, outputDirectory);
                    result.put(PROP_CACHED, type.equals(TYPE_LOCAL));
                    callbackContext.sendPluginResult(new PluginResult(PluginResult.Status.OK, result));
                } catch (JSONException e) {
                    // never happens
                }
            }
        });
    }

    private String getOutputDirectory(final String id) {
        // Production
        String outputDirectory = cordova.getActivity().getFilesDir().getAbsolutePath();
        // Testing
        //String outputDirectory = cordova.getActivity().getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS).getAbsolutePath();
        outputDirectory += outputDirectory.endsWith(File.separator) ? "" : File.separator;
        outputDirectory += "files";
        outputDirectory += outputDirectory.endsWith(File.separator) ? "" : File.separator;
        outputDirectory += id;
        Log.d(LOG_TAG, "output dir = " + outputDirectory);
        return outputDirectory;
    }


    private File createDownloadFileLocation(final String id) {
        File file = null;
        try {
            String tempId = (id.lastIndexOf("/") > -1) ? id.substring(id.lastIndexOf("/")+1, id.length()) : id;
            file = File.createTempFile(("cdv_" + tempId), ".tmp", cordova.getActivity().getCacheDir());
        } catch (IOException e1) {
            Log.e(LOG_TAG, e1.getLocalizedMessage(), e1);
        }
        return file;
    }

    private File backupExistingDirectory(String outputDirectory, String type, File dir) {
        File backup = new File(outputDirectory + ".bak");
        if (dir.exists()) {
            if (type.equals(TYPE_MERGE)) {
                try {
                    copyFolder(dir, backup);
                } catch (IOException e) {
                    Log.e(LOG_TAG, e.getLocalizedMessage(), e);
                }
            } else {
                dir.renameTo(backup);
            }
        }
        return backup;
    }

    private void copyAssets(String outputDirectory) {
        try {
            // cordova.js
            this.copyAssetFile(outputDirectory, "www/cordova.js");

            // cordova_plugins.js
            this.copyAssetFile(outputDirectory, "www/cordova_plugins.js");

            // plugins folder
            this.copyAssetFileOrDir(outputDirectory, "www/plugins");
        } catch(IOException e) {
            Log.e(LOG_TAG, "Failed to copy asset file", e);
        }
    }

    private void copyAssetFileOrDir(String outputDirectory, String path) throws IOException {
        AssetManager assetManager = cordova.getActivity().getAssets();
        String assets[] = null;
        assets = assetManager.list(path);
        if (assets.length == 0) {
            this.copyAssetFile(outputDirectory, path);
        } else {
            for (String file : assets) {
                copyAssetFileOrDir(outputDirectory, path + File.separator + file);
            }
        }
    }

    private static TrackingInputStream getInputStream(URLConnection conn) throws IOException {
        String encoding = conn.getContentEncoding();
        if (encoding != null && encoding.equalsIgnoreCase("gzip")) {
          return new TrackingGZIPInputStream(new ExposedGZIPInputStream(conn.getInputStream()));
        }
        return new SimpleTrackingInputStream(conn.getInputStream());
    }

    private static void safeClose(Closeable stream) {
        if (stream != null) {
            try {
                stream.close();
            } catch (IOException e) {
            }
        }
    }

    private String getCookies(final String target) {
        boolean gotCookie = false;
        String cookie = null;
        Class webViewClass = webView.getClass();
        try {
            Method gcmMethod = webViewClass.getMethod("getCookieManager");
            Class iccmClass  = gcmMethod.getReturnType();
            Method gcMethod  = iccmClass.getMethod("getCookie");

            cookie = (String)gcMethod.invoke(
                        iccmClass.cast(
                            gcmMethod.invoke(webView)
                        ), target);

            gotCookie = true;
        } catch (NoSuchMethodException e) {
        } catch (IllegalAccessException e) {
        } catch (InvocationTargetException e) {
        } catch (ClassCastException e) {
        }

        if (!gotCookie) {
            cookie = CookieManager.getInstance().getCookie(target);
        }

        return cookie;
    }

    private static void addHeadersToRequest(URLConnection connection, JSONObject headers) {
        try {
            for (Iterator<?> iter = headers.keys(); iter.hasNext(); ) {
                String headerKey = iter.next().toString();
                JSONArray headerValues = headers.optJSONArray(headerKey);
                if (headerValues == null) {
                    headerValues = new JSONArray();
                    headerValues.put(headers.getString(headerKey));
                }
                connection.setRequestProperty(headerKey, headerValues.getString(0));
                for (int i = 1; i < headerValues.length(); ++i) {
                    connection.addRequestProperty(headerKey, headerValues.getString(i));
                }
            }
        } catch (JSONException e1) {
          // No headers to be manipulated!
        }
    }

    /**
     * This function will install a trust manager that will blindly trust all SSL
     * certificates.  The reason this code is being added is to enable developers
     * to do development using self signed SSL certificates on their web server.
     *
     * The standard HttpsURLConnection class will throw an exception on self
     * signed certificates if this code is not run.
     */
    private static SSLSocketFactory trustAllHosts(HttpsURLConnection connection) {
        // Install the all-trusting trust manager
        SSLSocketFactory oldFactory = connection.getSSLSocketFactory();
        try {
            // Install our all trusting manager
            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            SSLSocketFactory newFactory = sc.getSocketFactory();
            connection.setSSLSocketFactory(newFactory);
        } catch (Exception e) {
            Log.e(LOG_TAG, e.getMessage(), e);
        }
        return oldFactory;
    }

    // Create a trust manager that does not validate certificate chains
    private static final TrustManager[] trustAllCerts = new TrustManager[] { new X509TrustManager() {
        public java.security.cert.X509Certificate[] getAcceptedIssuers() {
            return new java.security.cert.X509Certificate[] {};
        }

        public void checkClientTrusted(X509Certificate[] chain,
                String authType) throws CertificateException {
        }

        public void checkServerTrusted(X509Certificate[] chain,
                String authType) throws CertificateException {
        }
    } };


    // always verify the host - don't check for certificate
    private static final HostnameVerifier DO_NOT_VERIFY = new HostnameVerifier() {
        public boolean verify(String hostname, SSLSession session) {
            return true;
        }
    };

    /* Unzip code */

    // Can't use DataInputStream because it has the wrong endian-ness.
    private static int readInt(InputStream is) throws IOException {
        int a = is.read();
        int b = is.read();
        int c = is.read();
        int d = is.read();
        return a | b << 8 | c << 16 | d << 24;
    }

    private boolean unzipSync(File targetFile, String outputDirectory, ProgressEvent progress, CallbackContext callbackContext) {
        Log.d(LOG_TAG, "unzipSync called");
        Log.d(LOG_TAG, "zip = " + targetFile.getAbsolutePath());
        InputStream inputStream = null;
        ZipFile zip = null;
        boolean anyEntries = false;
        try {
            synchronized (progress) {
                if (progress.isAborted()) {
                    return false;
                }
            }

            zip = new ZipFile(targetFile);

            // Since Cordova 3.3.0 and release of File plugins, files are accessed via cdvfile://
            // Accept a path or a URI for the source zip.
            Uri zipUri = getUriForArg(targetFile.getAbsolutePath());
            Uri outputUri = getUriForArg(outputDirectory);

            CordovaResourceApi resourceApi = webView.getResourceApi();

            File tempFile = resourceApi.mapUriToFile(zipUri);
            if (tempFile == null || !tempFile.exists()) {
                sendErrorMessage("Zip file does not exist", UNZIP_ERROR, callbackContext);
            }

            File outputDir = resourceApi.mapUriToFile(outputUri);
            outputDirectory = outputDir.getAbsolutePath();
            outputDirectory += outputDirectory.endsWith(File.separator) ? "" : File.separator;
            if (outputDir == null || (!outputDir.exists() && !outputDir.mkdirs())){
                sendErrorMessage("Could not create output directory", UNZIP_ERROR, callbackContext);
            }

            OpenForReadResult zipFile = resourceApi.openForRead(zipUri);
            progress.setStatus(STATUS_EXTRACTING);
            progress.setLoaded(0);
            progress.setTotal(zip.size());
            Log.d(LOG_TAG, "zip file len = " + zip.size());

            inputStream = new BufferedInputStream(zipFile.inputStream);
            inputStream.mark(10);
            int magic = readInt(inputStream);

            if (magic != 875721283) { // CRX identifier
                inputStream.reset();
            } else {
                // CRX files contain a header. This header consists of:
                //  * 4 bytes of magic number
                //  * 4 bytes of CRX format version,
                //  * 4 bytes of public key length
                //  * 4 bytes of signature length
                //  * the public key
                //  * the signature
                // and then the ordinary zip data follows. We skip over the header before creating the ZipInputStream.
                readInt(inputStream); // version == 2.
                int pubkeyLength = readInt(inputStream);
                int signatureLength = readInt(inputStream);

                inputStream.skip(pubkeyLength + signatureLength);
            }

            // The inputstream is now pointing at the start of the actual zip file content.
            ZipInputStream zis = new ZipInputStream(inputStream);
            inputStream = zis;

            ZipEntry ze;
            byte[] buffer = new byte[32 * 1024];

            while ((ze = zis.getNextEntry()) != null) {
                synchronized (progress) {
                    if (progress.isAborted()) {
                        return false;
                    }
                }

                anyEntries = true;
                String compressedName = ze.getName();

                if (ze.getSize() > getFreeSpace()) {
                    return false;
                }

                if (ze.isDirectory()) {
                   File dir = new File(outputDirectory + compressedName);
                   dir.mkdirs();
                } else {
                    File file = new File(outputDirectory + compressedName);
                    file.getParentFile().mkdirs();
                    if(file.exists() || file.createNewFile()){
                        Log.w(LOG_TAG, "extracting: " + file.getPath());
                        FileOutputStream fout = new FileOutputStream(file);
                        int count;
                        while ((count = zis.read(buffer)) != -1)
                        {
                            fout.write(buffer, 0, count);
                        }
                        fout.close();
                    }

                }
                progress.addLoaded(1);
                updateProgress(callbackContext, progress);
                zis.closeEntry();
            }
        } catch (Exception e) {
            String errorMessage = "An error occurred while unzipping.";
            sendErrorMessage(errorMessage, UNZIP_ERROR, callbackContext);
            Log.e(LOG_TAG, errorMessage, e);
        } finally {
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException e) {
                }
            }
            if (zip != null) {
                try {
                    zip.close();
                } catch (IOException e) {
                }
            }
        }

        if (anyEntries)
            return true;
        else
            return false;
    }

    private void updateProgress(CallbackContext callbackContext, ProgressEvent progress) {
        try {
            if (progress.getLoaded() != progress.getTotal() || progress.getStatus() == STATUS_COMPLETE) {
                PluginResult pluginResult = new PluginResult(PluginResult.Status.OK, progress.toJSONObject());
                pluginResult.setKeepCallback(true);
                callbackContext.sendPluginResult(pluginResult);
            }
        } catch (JSONException e) {
            // never happens
        }
    }

    private Uri getUriForArg(String arg) {
        Uri tmpTarget = Uri.parse(arg);
        return webView.getResourceApi().remapUri(
                tmpTarget.getScheme() != null ? tmpTarget : Uri.fromFile(new File(arg)));
    }

    private static class ProgressEvent {
        private long loaded;
        private long total;
        private double percentage;
        private int status;
        private boolean aborted;
        private File targetFile;
        public ProgressEvent() {
            this.status = STATUS_STOPPED;
        }
        public long getLoaded() {
            return loaded;
        }
        public void setLoaded(long loaded) {
            this.loaded = loaded;
            updatePercentage();
        }
        public void addLoaded(long add) {
            this.loaded += add;
            updatePercentage();
        }
        public long getTotal() {
            return total;
        }
        public void setTotal(long total) {
            this.total = total;
            updatePercentage();
        }
        public int getStatus() {
            return status;
        }
        public void setStatus(int status) {
            this.status = status;
        }
        public boolean isAborted() {
            return aborted;
        }
        public void setAborted(boolean aborted) {
            this.aborted = aborted;
        }
        public File getTargetFile() {
            return targetFile;
        }
        public void setTargetFile(File targetFile) {
            this.targetFile = targetFile;
        }
        public JSONObject toJSONObject() throws JSONException {
            JSONObject jsonProgress = new JSONObject();
            jsonProgress.put(PROP_PROGRESS, this.percentage);
            jsonProgress.put(PROP_STATUS, this.getStatus());
            jsonProgress.put(PROP_LOADED, this.getLoaded());
            jsonProgress.put(PROP_TOTAL, this.getTotal());
            return jsonProgress;

        }
        private void updatePercentage() {
            double loaded = this.getLoaded();
            double total = this.getTotal();
            this.percentage = Math.floor((loaded / total * 100) / 2);
            if (this.getStatus() == STATUS_EXTRACTING) {
                this.percentage += 50;
            }
        }
    }

    private void copyFolder(File src, File dest) throws IOException{
        if(src.isDirectory()) {
            if(!dest.exists()){
               dest.mkdir();
            }

            //list all the directory contents
            String files[] = src.list();

            for (String file : files) {
               //recursive copy
               copyFolder(new File(src, file), new File(dest, file));
            }

        } else {
            //if file, then copy it
            copyFile(new FileInputStream(src), new FileOutputStream(dest));
        }
    }

    private void copyAssetFile(String outputDirectory, String filename) throws IOException {
        File targetDir =  new File(outputDirectory + "/" + filename.substring(0, filename.lastIndexOf("/")));
        if (!targetDir.exists()) {
            targetDir.mkdirs();
        }

        copyFile(cordova.getActivity().getAssets().open(filename), new FileOutputStream(new File(outputDirectory, filename)));
    }

    private void copyFile(InputStream in, OutputStream out) throws IOException {
        byte[] buffer = new byte[4096];

        int length;
        //copy the file content in bytes
        while ((length = in.read(buffer)) > 0){
               out.write(buffer, 0, length);
        }

        in.close();
        out.close();
    }

    private void removeFolder(File directory) {
        if (directory.exists() && directory.isDirectory()) {
            for (File file : directory.listFiles()) {
                removeFolder(file);
            }
        }
        directory.delete();
    }
}
