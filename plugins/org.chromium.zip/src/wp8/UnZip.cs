using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.IsolatedStorage;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Resources;

namespace WPCordovaClassLib.Cordova.Commands
{
    public class UnZip : BaseCommand
    {

        /// <summary>
        /// Represents a singular progress event to be passed back to javascript
        /// </summary>
        [DataContract]
        public class FileUnzipProgress
        {
            /// <summary>
            /// amount loaded
            /// </summary>
            [DataMember(Name = "loaded", IsRequired = true)]
            public long Loaded { get; set; }
            /// <summary>
            /// Total
            /// </summary>
            [DataMember(Name = "total", IsRequired = false)]
            public long Total { get; set; }

            public FileUnzipProgress(long total = 0, long loaded = 0)
            {
                Loaded = loaded;
                Total = total;
            }
        }

        public void unzip(string options)
        {
            string[] optionStrings;
            string srcFilePath;
            string destPath = "";
            string callbackId = CurrentCommandCallbackId;

            try
            {
                optionStrings = JSON.JsonHelper.Deserialize<string[]>(options);
                srcFilePath = optionStrings[0];
                destPath = optionStrings[1];
                callbackId = optionStrings[2];
            }
            catch (Exception)
            {
                DispatchCommandResult(new PluginResult(PluginResult.Status.JSON_EXCEPTION), callbackId);
                return;
            }

            using (IsolatedStorageFile appStorage = IsolatedStorageFile.GetUserStoreForApplication())
            {
                // DEBUG here to copy file from dll to isostore ...
                // this is only really needed if you want to test with a file in your package/project
                StreamResourceInfo fileResourceStreamInfo = Application.GetResourceStream(new Uri(srcFilePath, UriKind.Relative));
                if (fileResourceStreamInfo != null)
                {
                    using (BinaryReader br = new BinaryReader(fileResourceStreamInfo.Stream))
                    {
                        byte[] data = br.ReadBytes((int)fileResourceStreamInfo.Stream.Length);
                        // This will truncate/overwrite an existing file, or 
                        using (IsolatedStorageFileStream outFile = appStorage.OpenFile(srcFilePath, FileMode.Create))
                        {
                            using (var writer = new BinaryWriter(outFile))
                            {
                                writer.Write(data);
                            }
                        }
                    }
                }

                IsolatedStorageFileStream zipStream = null;
                ZipArchive zipArch = null;

                try
                {
                    zipStream = new IsolatedStorageFileStream(srcFilePath, FileMode.Open, FileAccess.Read, appStorage);
                }
                catch (Exception)
                {
                    Debug.WriteLine("File not found :: " + srcFilePath);
                    DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR), callbackId);
                    return;
                }

                if (zipStream != null)
                {
                    zipArch = new ZipArchive(zipStream);
                }

                if (zipArch != null)
                {
                    int totalFiles = zipArch.FileNames.Count();
                    int current = 0;
                    try
                    {
                        foreach (string filename in zipArch.FileNames)
                        {
                            
                            string destFilePath = destPath + "/" + filename;
                            string directoryName = getDirectoryName(destFilePath);

                            //Debug.WriteLine("upacking file : " + filename + " to : " + destFilePath);

                            if (!appStorage.DirectoryExists(directoryName))
                            {
                                appStorage.CreateDirectory(directoryName);
                            }

                           

                            using (Stream readStream = zipArch.GetFileStream(filename))
                            {
                                if (readStream != null)
                                {
                                    using (FileStream outStream = new IsolatedStorageFileStream(destFilePath, FileMode.OpenOrCreate, FileAccess.Write, appStorage))
                                    {
                                        WriteStreamToPath(readStream, outStream);
                                        FileUnzipProgress progEvt = new FileUnzipProgress(totalFiles, current++);
                                        PluginResult plugRes = new PluginResult(PluginResult.Status.OK, progEvt);
                                        plugRes.KeepCallback = true;
                                        plugRes.CallbackId = callbackId;
                                        DispatchCommandResult(plugRes, callbackId);
                                    }
                                }
                            }
                        }
                        zipStream.Close();
                        DispatchCommandResult(new PluginResult(PluginResult.Status.OK), callbackId);
                    }
                    catch (Exception)
                    {
                        Debug.WriteLine("File not found :: " + srcFilePath);
                        DispatchCommandResult(new PluginResult(PluginResult.Status.ERROR), callbackId);
                    }
                }
            }
        }

        private void WriteStreamToPath(Stream readStream, Stream outStream)
        {

            long totalBytes = readStream.Length;
            int bytesRead = 0;

            using (BinaryReader reader = new BinaryReader(readStream))
            {
                using (BinaryWriter writer = new BinaryWriter(outStream))
                {
                    int BUFFER_SIZE = 1024;
                    byte[] buffer;

                    while (true)
                    {
                        buffer = reader.ReadBytes(BUFFER_SIZE);
                        bytesRead += buffer.Length;
                        if (buffer.Length > 0)
                        {
                            writer.Write(buffer);
                        }
                        else
                        {
                            writer.Close();
                            reader.Close();
                            outStream.Close();
                            break;
                        }
                    }
                }
            }

        }

        // Gets the full path without the filename
        private string getDirectoryName(String filePath)
        {
            string directoryName;
            try
            {
                directoryName = filePath.Substring(0, filePath.LastIndexOf('/'));
            }
            catch
            {
                directoryName = "";
            }
            return directoryName;
        }


        /// <summary>
        /// Class used for storing file entry information when
        /// parsing the central file directory.
        /// </summary>
        private class ZipArchiveEntry
        {
            public string Filename;
            public int FileStart;
            public int CompressedLength;
            public int Length;
            public int CRC32;
        }

        private class ZipArchive : IDisposable
        {
            private const int CENTRAL_FILE_HDR_SIG = 0x02014b50;
            private const int END_CENTRAL_DIR_SIG = 0x06054b50;

            private Stream ZipStream;
            private List<ZipArchiveEntry> _fileEntries;

            public ZipArchive(Stream zipFileStream)
            {
                if (!zipFileStream.CanSeek)
                {
                    throw new NotSupportedException("zipFileStream must support seeking");
                }
                else
                {
                    ZipStream = zipFileStream;
                }
            }

            public List<ZipArchiveEntry> FileEntries
            {
                get
                {
                    if (_fileEntries == null)
                    {
                        InflateDirectory();
                    }
                    return _fileEntries;
                }
            }


            /// <summary>
            /// Gets the file stream for the specified file. Returns null if the file could not be found.
            /// </summary>
            /// <param name="filename">The filename.</param>
            /// <returns>Stream to file inside zip stream</returns>
            public Stream GetFileStream(string filename)
            {
                long position = ZipStream.Position;
                ZipStream.Seek(0, SeekOrigin.Begin);
                Uri fileUri = new Uri(filename, UriKind.Relative);
                StreamResourceInfo info = new StreamResourceInfo(ZipStream, null);
                StreamResourceInfo stream = System.Windows.Application.GetResourceStream(info, fileUri);
                ZipStream.Position = position;
                if (stream != null)
                {
                    return stream.Stream;
                }
                return null;
            }

            /// <summary>
            /// Gets a list of file names embedded in the zip file.
            /// </summary>
            /// <param name="stream">The stream for a zip file.</param>
            /// <returns>List of file names</returns>
            public IEnumerable<string> FileNames
            {
                get
                {
                    return (from entry in FileEntries
                            where (!entry.Filename.EndsWith("/") &&
                                   !entry.Filename.StartsWith("__MACOSX/"))
                            select entry.Filename);
                }
            }

            /// <summary>
            /// Gets a list of directories embedded in the zip file
            /// </summary>
            public IEnumerable<string> DirectoriesName
            {
                get
                {
                    return (from entry in FileEntries
                            where (entry.Filename.EndsWith("/")
                                   && !entry.Filename.StartsWith("__MACOSX/"))
                            select entry.Filename);
                }
            }

            /***************************************************
                4.3.16  End of central directory record:

                end of central dir signature    4 bytes  (0x06054b50)
                number of this disk             2 bytes
                number of the disk with the
                start of the central directory  2 bytes
                total number of entries in the
                central directory on this disk  2 bytes
                total number of entries in
                the central directory           2 bytes
                size of the central directory   4 bytes
                offset of start of central
                directory with respect to
                the starting disk number        4 bytes
                .ZIP file comment length        2 bytes
                .ZIP file comment       (variable size)
            */

            /***************************************************
            File header:

                central file header signature   4 bytes  (0x02014b50)
                version made by                 2 bytes
                version needed to extract       2 bytes
                general purpose bit flag        2 bytes
                compression method              2 bytes
                last mod file time              2 bytes
                last mod file date              2 bytes
                crc-32                          4 bytes
                compressed size                 4 bytes
                uncompressed size               4 bytes
                file name length                2 bytes
                extra field length              2 bytes
                file comment length             2 bytes
                disk number start               2 bytes
                internal file attributes        2 bytes
                external file attributes        4 bytes
                relative offset of local header 4 bytes

                file name (variable size)
                extra field (variable size)
                file comment (variable size)
            */


            private List<ZipArchiveEntry> InflateDirectory()
            {
                _fileEntries = new List<ZipArchiveEntry>();

                BinaryReader reader = new BinaryReader(ZipStream);

                reader.BaseStream.Seek(-4, SeekOrigin.End);
                // skip back
                while (reader.ReadInt32() != END_CENTRAL_DIR_SIG)
                {
                    reader.BaseStream.Seek(-5, SeekOrigin.Current);
                }
                // skip over number of this disk, number of the disk with dir start, total number of entries on this disk 
                reader.BaseStream.Seek(6, SeekOrigin.Current);
                short entryCount = reader.ReadInt16();
                int directorySize = reader.ReadInt32();
                int directoryStart = reader.ReadInt32();
                reader.BaseStream.Seek(directoryStart, SeekOrigin.Begin);
                bool doRebuild = false;

                for (int i = 0; i < entryCount; i++)
                {
                    if (reader.ReadInt32() == CENTRAL_FILE_HDR_SIG)
                    {
                        ZipArchiveEntry zipEntry = new ZipArchiveEntry();

                        reader.BaseStream.Seek(4, SeekOrigin.Current);
                        short flags = reader.ReadInt16();   // read general purpose bit flag

                        if ((flags & 8) > 0) //Silverlight doesn't like this format. We'll "fix it" further below
                        {
                            doRebuild = true;
                        }
                        // skip: compression method, last mod file time, last mod file date 
                        reader.BaseStream.Seek(6, SeekOrigin.Current);

                        zipEntry.CRC32 = reader.ReadInt32();
                        zipEntry.CompressedLength = reader.ReadInt32();
                        zipEntry.Length = reader.ReadInt32();

                        short fileNameLength = reader.ReadInt16();
                        short extraFieldLength = reader.ReadInt16();
                        short fileCommentLength = reader.ReadInt16();

                        // skip disk number start, internal file attr, ext file attr
                        reader.BaseStream.Seek(8, SeekOrigin.Current);

                        zipEntry.FileStart = reader.ReadInt32();
                        zipEntry.Filename = new string(reader.ReadChars(fileNameLength));
                        _fileEntries.Add(zipEntry);

                        reader.BaseStream.Seek(extraFieldLength + fileCommentLength, SeekOrigin.Current);
                    }
                }
                if (doRebuild)
                {
                    // if file size is reported after the compressed data the filestream is unsupported by silverlight
                    MemoryStream newZipStream = new MemoryStream();
                    BinaryWriter writer = new BinaryWriter(newZipStream);

                    RebuildEntries(ref reader, ref writer);

                    // rewind
                    reader.BaseStream.Seek(directoryStart, SeekOrigin.Begin);
                    //Rebuild directory
                    RebuildDirectory(ref reader, ref writer);

                    writer.Write(reader.ReadBytes((int)(reader.BaseStream.Length - reader.BaseStream.Position)));
                    ZipStream = newZipStream; //Swap to use our newly cleaned stream
                }
                return _fileEntries;
            }

            private void RebuildDirectory(ref BinaryReader reader, ref BinaryWriter writer)
            {
                for (int i = 0; i < _fileEntries.Count; i++)
                {
                    writer.Write(reader.ReadBytes(8));
                    byte flag = reader.ReadByte();
                    writer.Write((byte)(0xF7 & flag)); //set 3rd hobbit to 0 for new format
                    writer.Write(reader.ReadBytes(19));
                    short filenamelength = reader.ReadInt16();
                    writer.Write(filenamelength);
                    short extrafieldlength = reader.ReadInt16();
                    writer.Write(extrafieldlength);
                    short filecommentlength = reader.ReadInt16();
                    writer.Write(filecommentlength);
                    writer.Write(reader.ReadBytes(8));
                    writer.Write(_fileEntries[i].FileStart);
                    reader.BaseStream.Seek(4, SeekOrigin.Current);
                    writer.Write(reader.ReadBytes(filenamelength + extrafieldlength + filecommentlength));
                }
            }

            private void RebuildEntries(ref BinaryReader reader, ref BinaryWriter writer)
            {
                //Rebuild file entries
                foreach (ZipArchiveEntry entry in _fileEntries)
                {
                    ZipArchiveEntry e = entry;
                    reader.BaseStream.Seek(entry.FileStart, SeekOrigin.Begin);
                    e.FileStart = (int)writer.BaseStream.Position;
                    writer.Write(reader.ReadBytes(6));

                    short flag = reader.ReadInt16();
                    writer.Write((short)(0xF7 & flag)); //set 3rd hobbit to 0 for new format
                    writer.Write(reader.ReadBytes(6));
                    writer.Write(entry.CRC32);
                    writer.Write(entry.CompressedLength);
                    writer.Write(entry.Length);
                    writer.Write((short)entry.Filename.Length);
                    reader.BaseStream.Seek(14, SeekOrigin.Current);
                    short fieldLength = reader.ReadInt16();
                    writer.Write(fieldLength);
                    writer.Write(reader.ReadBytes(entry.Filename.Length + fieldLength + entry.CompressedLength));
                }
            }

            #region IDisposable Members

            public void Dispose()
            {
                if (ZipStream != null)
                {
                    ZipStream.Dispose();
                }
            }

            #endregion
        }
    }
}
