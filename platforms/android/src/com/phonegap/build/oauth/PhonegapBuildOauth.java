package com.phonegap.build.oauth;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;

import org.apache.cordova.*;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.json.*;

import android.util.Base64;
import android.util.Log;

public class PhonegapBuildOauth extends CordovaPlugin {
	
	private String CLIENT_ID = "";
	private String CLIENT_SECRET = "";
	private final String HOSTNAME = "https://build.phonegap.com";
	
	CallbackContext cb;

	@Override
	public boolean execute(String action, JSONArray args,
			CallbackContext callbackContext) {

		this.cb = callbackContext;

		if (action.equals("login")) {
			String username, password;
			try {
				username = (String) args.get(0);
				password = (String) args.get(1);
				login(username, password);
			} catch (JSONException e1) {
				fail(e1.getMessage());
				return true;
			}
		}

		PluginResult r = new PluginResult(PluginResult.Status.NO_RESULT);
		r.setKeepCallback(true);
		cb.sendPluginResult(r);
		return true;
	}
	
	private void login(String username, String password) {
		String base64EncodedCredentials = "Basic "
				+ Base64.encodeToString(
						(username + ":" + password).getBytes(),
						Base64.NO_WRAP);
		
		String json = postData(HOSTNAME + "/token", base64EncodedCredentials, null);

		if (json != null) {
			JSONObject obj;
			try {
				obj = new JSONObject(json);
				String token = obj.getString("token");
				Log.d("PhonegapBuildOauth", token);
				authorize(token);
			} catch (JSONException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	private void fail(String message) {
		PluginResult r = new PluginResult(PluginResult.Status.ERROR, message);
		r.setKeepCallback(false);
		cb.sendPluginResult(r);
	}
	
	private void authorize(String token) {
		List<NameValuePair> data = new ArrayList<NameValuePair>(3);
		data.add(new BasicNameValuePair("client_id", CLIENT_ID));
		data.add(new BasicNameValuePair("client_secret", CLIENT_SECRET));
		data.add(new BasicNameValuePair("auth_token", token));
		try {
			UrlEncodedFormEntity formData = new UrlEncodedFormEntity(data);
			String json = postData(HOSTNAME + "/authorize", null, formData);
			Log.d("PhonegapBuildOauth", json);
			JSONObject obj = new JSONObject(json);
			PluginResult r = new PluginResult(PluginResult.Status.OK, obj);
			r.setKeepCallback(false);
			cb.sendPluginResult(r);
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail(e.getMessage());
		} catch (JSONException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			fail(e.getMessage());
		}
	}

	private String postData(String url, String creds, UrlEncodedFormEntity data) {
		// Create a new HttpClient and Post Header
		HttpClient httpclient = new DefaultHttpClient();
		HttpPost httppost = new HttpPost(url);
		HttpResponse response = null;
		StringBuilder total = new StringBuilder();

		try {
			if (creds != null) {
				httppost.setHeader("Authorization", creds);
			}

			if (data != null) {
				httppost.setEntity(data);
			}
			// Execute HTTP Post Request
			response = httpclient.execute(httppost);

		} catch (ClientProtocolException e) {
			Log.e("PhonegapBuildOauth", "Uncaught exception from plugin", e);
			e.printStackTrace();
			fail(e.getMessage());
		} catch (IOException e) {
			Log.e("PhonegapBuildOauth", "Uncaught exception from plugin", e);
			e.printStackTrace();
			fail(e.getMessage());
		}

		HttpEntity entity = response.getEntity();

		if (entity != null) {
			try {
				InputStream instream = entity.getContent();

				String line = "";

				// Wrap a BufferedReader around the InputStream
				BufferedReader rd = new BufferedReader(new InputStreamReader(
						instream));

				// Read response until the end
				while ((line = rd.readLine()) != null) {
					total.append(line);
				}
				Log.d("PhonegapBuildOauth", total.toString());
				
				return total.toString();

			} catch (IllegalStateException e) {
				e.printStackTrace();
				fail(e.getMessage());
			} catch (IOException e) {
				e.printStackTrace();
				fail(e.getMessage());
			}
		}
		
		return null;
	}

}
