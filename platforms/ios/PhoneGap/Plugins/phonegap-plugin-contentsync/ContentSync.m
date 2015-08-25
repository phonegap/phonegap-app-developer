#import "ContentSync.h"

@implementation ContentSyncTask

- (ContentSyncTask *)init {
    self = (ContentSyncTask*)[super init];
    if(self) {
        self.downloadTask = nil;
        self.command = nil;
        self.archivePath = nil;
        self.progress = 0;
        self.extractArchive = YES;
    }

    return self;
}
@end

@implementation ContentSync

- (CDVPlugin*)initWithWebView:(UIWebView*)theWebView {
    [NSURLProtocol registerClass:[NSURLProtocolNoCache class]];
    return self;
}

- (CDVPluginResult*) preparePluginResult:(NSInteger)progress status:(NSInteger)status {
    CDVPluginResult *pluginResult = nil;

    NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:2];
    [message setObject:[NSNumber numberWithInteger:progress] forKey:@"progress"];
    [message setObject:[NSNumber numberWithInteger:status] forKey:@"status"];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];

    return pluginResult;
}

- (void)sync:(CDVInvokedUrlCommand*)command {

    NSString* type = [command argumentAtIndex:2];
    BOOL local = [type isEqualToString:@"local"];

    if(local == YES) {
        NSString* appId = [command argumentAtIndex:1];
        NSLog(@"Requesting local copy of %@", appId);
        NSFileManager *fileManager = [NSFileManager defaultManager];
        NSArray *URLs = [fileManager URLsForDirectory:NSLibraryDirectory inDomains:NSUserDomainMask];
        NSURL *libraryDirectoryUrl = [URLs objectAtIndex:0];

        NSURL *appPath = [libraryDirectoryUrl URLByAppendingPathComponent:appId];

        if([fileManager fileExistsAtPath:[appPath path]]) {
            NSLog(@"Found local copy %@", [appPath path]);
            CDVPluginResult *pluginResult = nil;

            NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:2];
            [message setObject:[appPath path] forKey:@"localPath"];
            [message setObject:@"true" forKey:@"cached"];
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];

            [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
            return;
        }
        BOOL copyCordovaAssets = [[command argumentAtIndex:4 withDefault:@(NO)] boolValue];
        BOOL copyRootApp = [[command argumentAtIndex:5 withDefault:@(NO)] boolValue];

        if(copyRootApp == YES || copyCordovaAssets == YES) {
            CDVPluginResult *pluginResult = nil;
            NSError* error = nil;

            NSLog(@"Creating app directory %@", [appPath path]);
            [fileManager createDirectoryAtPath:[appPath path] withIntermediateDirectories:YES attributes:nil error:&error];

            NSError* errorSetting = nil;
            BOOL success = [appPath setResourceValue: [NSNumber numberWithBool: YES]
                                             forKey: NSURLIsExcludedFromBackupKey error: &errorSetting];

            if(success == NO) {
                NSLog(@"WARNING: %@ might be backed up to iCloud!", [appPath path]);
            }

            if(error != nil) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:LOCAL_ERR];
                NSLog(@"%@", [error localizedDescription]);
            } else {
                if(copyRootApp) {
                    NSLog(@"Copying Root App");
                    [self copyCordovaAssets:[appPath path] copyRootApp:YES];
                } else {
                    NSLog(@"Copying Cordova Assets");
                    [self copyCordovaAssets:[appPath path] copyRootApp:NO];
                }
            }
        }
    }

    __weak ContentSync* weakSelf = self;

    [self.commandDelegate runInBackground:^{
        [weakSelf startDownload:command extractArchive:YES];
    }];
}

- (void) download:(CDVInvokedUrlCommand*)command {
    __weak ContentSync* weakSelf = self;

    [self.commandDelegate runInBackground:^{
        [weakSelf startDownload:command extractArchive:NO];
    }];
}

- (void)startDownload:(CDVInvokedUrlCommand*)command extractArchive:(BOOL)extractArchive {

    CDVPluginResult* pluginResult = nil;
    NSString* src = [command argumentAtIndex:0 withDefault:nil];
    NSNumber* timeout = [command argumentAtIndex:6 withDefault:[NSNumber numberWithDouble:15]];

    self.session = [self backgroundSession:timeout];

    // checking if URL is valid
    NSURL *srcURL = [NSURL URLWithString:src];

    if(srcURL && srcURL.scheme && srcURL.host) {
        
        BOOL trustHost = [command argumentAtIndex:7 withDefault:@(NO)];
        
        if(!self.trustedHosts) {
            self.trustedHosts = [NSMutableArray arrayWithCapacity:1];
        }
        
        if(trustHost == YES) {
            NSLog(@"WARNING: Trusting host %@", [srcURL host]);
            [self.trustedHosts addObject:[srcURL host]];
        }
        
        NSLog(@"startDownload from %@", src);
        NSURL *downloadURL = [NSURL URLWithString:src];

        // downloadURL is nil if malformed URL
        if(downloadURL == nil) {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:INVALID_URL_ERR];
        } else {
            NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:downloadURL];
            request.timeoutInterval = 15.0;
            // Setting headers
            NSDictionary *headers = [command argumentAtIndex:3 withDefault:nil andClass:[NSDictionary class]];
            if(headers != nil) {
                for (NSString* header in [headers allKeys]) {
                    NSLog(@"Setting header %@ %@", header, [headers objectForKey:header]);
                    [request addValue:[headers objectForKey:header] forHTTPHeaderField:header];
                }
            }

            if(!self.syncTasks) {
                self.syncTasks = [NSMutableArray arrayWithCapacity:1];
            }
            NSURLSessionDownloadTask *downloadTask = [self.session downloadTaskWithRequest:request];

            ContentSyncTask* sData = [[ContentSyncTask alloc] init];

            sData.downloadTask = downloadTask;
            sData.command = command;
            sData.progress = 0;
            sData.extractArchive = extractArchive;

            [self.syncTasks addObject:sData];

            [downloadTask resume];

            pluginResult = [self preparePluginResult:sData.progress status:Downloading];
        }

    } else {
        NSLog(@"Invalid src URL %@", src);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:INVALID_URL_ERR];
    }

    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];

}

- (void)cancel:(CDVInvokedUrlCommand *)command {
    ContentSyncTask* sTask = [self findSyncDataByCallbackID:command.callbackId];
    if(sTask) {
        CDVPluginResult* pluginResult = nil;
        [[sTask downloadTask] cancel];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
    }
}

- (ContentSyncTask *)findSyncDataByDownloadTask:(NSURLSessionDownloadTask*)downloadTask {
    for(ContentSyncTask* sTask in self.syncTasks) {
        if(sTask.downloadTask == downloadTask) {
            return sTask;
        }
    }
    return nil;
}

- (ContentSyncTask *)findSyncDataByPath {
    for(ContentSyncTask* sTask in self.syncTasks) {
        if([sTask.archivePath isEqualToString:[self currentPath]]) {
            return sTask;
        }
    }
    return nil;
}

- (ContentSyncTask *)findSyncDataByCallbackID:(NSString*)callbackId {
    for(ContentSyncTask* sTask in self.syncTasks) {
        if([sTask.command.callbackId isEqualToString:callbackId]) {
            return sTask;
        }
    }
    return nil;
}

- (void)URLSession:(NSURLSession *)session didReceiveChallenge:(NSURLAuthenticationChallenge *)challenge completionHandler:(void (^)(NSURLSessionAuthChallengeDisposition, NSURLCredential *))completionHandler{
    if([challenge.protectionSpace.authenticationMethod isEqualToString:NSURLAuthenticationMethodServerTrust]) {
        NSLog(@"Received challenge for host %@", challenge.protectionSpace.host);
        if([self.trustedHosts containsObject:challenge.protectionSpace.host]) {
            NSURLCredential *credential = [NSURLCredential credentialForTrust:challenge.protectionSpace.serverTrust];
            completionHandler(NSURLSessionAuthChallengeUseCredential,credential);
        } else {
            completionHandler(NSURLSessionAuthChallengeUseCredential,nil);
//            completionHandler(NSURLSessionAuthChallengeCancelAuthenticationChallenge, nil);
        }
    }
}

- (void)URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask *)downloadTask didWriteData:(int64_t)bytesWritten totalBytesWritten:(int64_t)totalBytesWritten totalBytesExpectedToWrite:(int64_t)totalBytesExpectedToWrite {

    CDVPluginResult* pluginResult = nil;

    ContentSyncTask* sTask = [self findSyncDataByDownloadTask:(NSURLSessionDownloadTask*)downloadTask];

    if(sTask) {
        double progress = (double)totalBytesWritten / (double)totalBytesExpectedToWrite;
        //NSLog(@"DownloadTask: %@ progress: %lf callbackId: %@", downloadTask, progress, sTask.command.callbackId);
        progress = (sTask.extractArchive == YES ? ((progress / 2) * 100) : progress * 100);
        sTask.progress = progress;
        pluginResult = [self preparePluginResult:sTask.progress status:Downloading];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
    } else {
        NSLog(@"Could not find download task");
    }
}

- (void) URLSession:(NSURLSession*)session downloadTask:(NSURLSessionDownloadTask*)downloadTask didFinishDownloadingToURL:(NSURL *)downloadURL {


    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *URLs = [fileManager URLsForDirectory:NSLibraryDirectory inDomains:NSUserDomainMask];
    NSURL *libraryDirectory = [URLs objectAtIndex:0];

    NSURL *originalURL = [[downloadTask originalRequest] URL];
    NSURL *sourceURL = [libraryDirectory URLByAppendingPathComponent:[originalURL lastPathComponent]];
    NSError *errorCopy;

    [fileManager removeItemAtURL:sourceURL error:NULL];
    BOOL success = [fileManager copyItemAtURL:downloadURL toURL:sourceURL error:&errorCopy];

    if(success) {
        ContentSyncTask* sTask = [self findSyncDataByDownloadTask:downloadTask];

        if(sTask) {
            if(sTask.extractArchive == YES) {
                sTask.archivePath = [sourceURL path];
                // FIXME there is probably a better way to do this
                NSString* appId = [sTask.command.arguments objectAtIndex:1];
                NSURL *extractURL = [libraryDirectory URLByAppendingPathComponent:appId];
                NSString* type = [sTask.command argumentAtIndex:2 withDefault:@"replace"];

                // copy root app right before we extract
                if([[[sTask command] argumentAtIndex:5 withDefault:@(NO)] boolValue] == YES) {
                    NSLog(@"Copying Cordova Root App to %@ as requested", [extractURL path]);
                    if(![self copyCordovaAssets:[extractURL path] copyRootApp:YES]) {
                        NSLog(@"Error copying Cordova Root App");
                    };
                }

                CDVInvokedUrlCommand* command = [CDVInvokedUrlCommand commandFromJson:[NSArray arrayWithObjects:sTask.command.callbackId, @"Zip", @"unzip", [NSMutableArray arrayWithObjects:[sourceURL absoluteString], [extractURL absoluteString], type, nil], nil]];
                [self unzip:command];
            } else {
                sTask.archivePath = [sourceURL absoluteString];
            }
        }
    } else {
        NSLog(@"Sync Failed - Copy Failed - %@", [errorCopy localizedDescription]);
    }
}

- (void) URLSession:(NSURLSession*)session task:(NSURLSessionTask*)task didCompleteWithError:(NSError *)error {

    ContentSyncTask* sTask = [self findSyncDataByDownloadTask:(NSURLSessionDownloadTask*)task];

    if(sTask) {
        CDVPluginResult* pluginResult = nil;

        if(error == nil) {
            double progress = (double)task.countOfBytesReceived / (double)task.countOfBytesExpectedToReceive;
            NSLog(@"Task: %@ completed successfully", task);
            if(sTask.extractArchive) {
                progress = ((progress / 2) * 100);
                pluginResult = [self preparePluginResult:progress status:Downloading];
                [pluginResult setKeepCallbackAsBool:YES];
            }
            else {
                progress = progress * 100;
                NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:3];
                [message setObject:[NSNumber numberWithInteger:progress] forKey:@"progress"];
                [message setObject:[NSNumber numberWithInteger:Complete] forKey:@"status"];
                [message setObject:[sTask archivePath] forKey:@"archiveURL"];
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
                [[self syncTasks] removeObject:sTask];
            }
        } else {
            NSLog(@"Task: %@ completed with error: %@", task, [error localizedDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:CONNECTION_ERR];
        }
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
    }
}

- (void)URLSessionDidFinishEventsForBackgroundURLSession:(NSURLSession *)session {
    NSLog(@"All tasks are finished");
}

- (void)unzip:(CDVInvokedUrlCommand*)command {
    __weak ContentSync* weakSelf = self;
    __block NSString* callbackId = command.callbackId;

    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;

        NSURL* sourceURL = [NSURL URLWithString:[command argumentAtIndex:0]];
        NSURL* destinationURL = [NSURL URLWithString:[command argumentAtIndex:1]];
        NSString* type = [command argumentAtIndex:2 withDefault:@"replace"];
        BOOL replace = [type isEqualToString:@"replace"];

        NSFileManager *fileManager = [NSFileManager defaultManager];
        if([fileManager fileExistsAtPath:[destinationURL path]] && replace == YES) {
            NSLog(@"%@ already exists. Deleting it since type is set to `replace`", [destinationURL path]);
            [fileManager removeItemAtURL:destinationURL error:NULL];
        }

        @try {
            NSError *error;
            if(![SSZipArchive unzipFileAtPath:[sourceURL path] toDestination:[destinationURL path] overwrite:YES password:nil error:&error delegate:weakSelf]) {
                NSLog(@"%@ - %@", @"Error occurred during unzipping", [error localizedDescription]);
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:UNZIP_ERR];
            } else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                // clean up zip archive
                NSFileManager *fileManager = [NSFileManager defaultManager];
                [fileManager removeItemAtURL:sourceURL error:NULL];

            }
        }
        @catch (NSException *exception) {
            NSLog(@"%@ - %@", @"Error occurred during unzipping", [exception debugDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsInt:UNZIP_ERR];
        }
        [pluginResult setKeepCallbackAsBool:YES];

        dispatch_async(dispatch_get_main_queue(), ^{
            [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
        });
    }];
}


- (void)zipArchiveWillUnzipArchiveAtPath:(NSString *)path zipInfo:(unz_global_info)zipInfo {
    self.currentPath = path;
}

- (void) zipArchiveProgressEvent:(NSInteger)loaded total:(NSInteger)total {
    ContentSyncTask* sTask = [self findSyncDataByPath];
    if(sTask) {
        //NSLog(@"Extracting %ld / %ld", (long)loaded, (long)total);
        double progress = ((double)loaded / (double)total);
        progress = (sTask.extractArchive == YES ? ((0.5 + progress / 2) * 100) : progress * 100);
        CDVPluginResult* pluginResult = [self preparePluginResult:progress status:Extracting];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
    }
}

- (void) zipArchiveDidUnzipArchiveAtPath:(NSString *)path zipInfo:(unz_global_info)zipInfo unzippedPath:(NSString *)unzippedPath {
    NSLog(@"unzipped path %@", unzippedPath);
    ContentSyncTask* sTask = [self findSyncDataByPath];
    if(sTask) {
        // FIXME: Copying cordova assets only if copyRootApp is false because why do it twice
        if([[[sTask command] argumentAtIndex:5 withDefault:@(NO)] boolValue] == NO &&
           [[[sTask command] argumentAtIndex:4 withDefault:@(NO)] boolValue] == YES) {
            NSLog(@"Copying Cordova Assets to %@ as requested", unzippedPath);
            if(![self copyCordovaAssets:unzippedPath]) {
                NSLog(@"Error copying Cordova Assets");
            };
        }
        // XXX this is to match the Android implementation
        CDVPluginResult* pluginResult = [self preparePluginResult:100 status:Complete];
        [pluginResult setKeepCallbackAsBool:YES];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
        // END

        // Do not BACK UP folder to iCloud
        NSURL* appURL = [NSURL fileURLWithPath: path];
        NSError* error = nil;
        BOOL success = [appURL setResourceValue: [NSNumber numberWithBool: YES]
                                          forKey: NSURLIsExcludedFromBackupKey error: &error];
        if(!success) {
            NSLog(@"Error excluding %@ from backup %@", [appURL lastPathComponent], error);
        }

        NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:2];
        [message setObject:unzippedPath forKey:@"localPath"];
        [message setObject:@"false" forKey:@"cached"];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
        [pluginResult setKeepCallbackAsBool:NO];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
        [[self syncTasks] removeObject:sTask];
    }
}

- (BOOL) copyCordovaAssets:(NSString*)unzippedPath {
    return [self copyCordovaAssets:unzippedPath copyRootApp:false];
}

// TODO GET RID OF THIS
- (BOOL) copyCordovaAssets:(NSString*)unzippedPath copyRootApp:(BOOL)copyRootApp {
    NSError *errorCopy;
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSURL* destinationURL = [NSURL fileURLWithPath:unzippedPath];

    if(copyRootApp == YES) {
        // we use cordova.js as a way to find the root www/
        NSString* root = [[[self commandDelegate] pathForResource:@"cordova.js"] stringByDeletingLastPathComponent];

        NSURL* sourceURL = [NSURL fileURLWithPath:root];
        [fileManager removeItemAtURL:destinationURL error:NULL];
        BOOL success = [fileManager copyItemAtURL:sourceURL toURL:destinationURL error:&errorCopy];

        if(!success) {
            return NO;
        }

        return YES;
    }

    NSArray* cordovaAssets = [NSArray arrayWithObjects:@"cordova.js",@"cordova_plugins.js",@"plugins", nil];
    NSString* suffix = @"/www";

    if([fileManager fileExistsAtPath:[unzippedPath stringByAppendingString:suffix]]) {
        destinationURL = [destinationURL URLByAppendingPathComponent:suffix];
        NSLog(@"Found %@ folder. Will copy Cordova assets to it.", suffix);
    }

    for(NSString* asset in cordovaAssets) {
        NSURL* assetSourceURL = [NSURL fileURLWithPath:[[self commandDelegate] pathForResource:asset]];
        NSURL* assetDestinationURL = [destinationURL URLByAppendingPathComponent:[assetSourceURL lastPathComponent]];
        [fileManager removeItemAtURL:assetDestinationURL error:NULL];
        BOOL success = [fileManager copyItemAtURL:assetSourceURL toURL:assetDestinationURL error:&errorCopy];

        if(!success) {
            return NO;
        }
    }

    return YES;
}

- (NSURLSession*) backgroundSession:(NSNumber*)timeout {
    static NSURLSession *session = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        NSURLSessionConfiguration *configuration;
        if ([[[UIDevice currentDevice] systemVersion] floatValue] >=8.0f)
        {
            configuration = [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:@"com.example.apple-samplecode.SimpleBackgroundTransfer.BackgroundSession"];
        }
        else
        {
            configuration = [NSURLSessionConfiguration backgroundSessionConfiguration:@"com.example.apple-samplecode.SimpleBackgroundTransfer.BackgroundSession"];
        }
        configuration.timeoutIntervalForRequest = [timeout doubleValue];
        session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
    });
    return session;
}

@end

/**
 * NSURLProtocolNoCache
 *
 * URL Protocol handler to prevent caching of local assets.
 */

@implementation NSURLProtocolNoCache


/**
 * Should this request be handled by this protocol handler?
 *
 * We disable caching on requests using the file:// protocol and prefixed with the app's Library directory
 * In the future, we may want to limit this or enable it based on configuration or not.
 *
 * @param theRequest is the inbound NSURLRequest.
 * @return YES to handle this request with the this NSURLProtocol handler.
 */

+ (BOOL)canInitWithRequest:(NSURLRequest*)theRequest {
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSArray *URLs = [fileManager URLsForDirectory:NSLibraryDirectory inDomains:NSUserDomainMask];
    NSURL *libraryDirectoryUrl = [URLs objectAtIndex:0];
    return [theRequest.URL.scheme isEqualToString:@"file"] && [theRequest.URL.path hasPrefix:[libraryDirectoryUrl path]];
}

/**
 * Canonical request definition.
 *
 * We keep it simple and map each request directly to itself.
 *
 * @param theRequest is the inbound NSURLRequest.
 * @return the same inbound NSURLRequest object.
 */

+ (NSURLRequest*)canonicalRequestForRequest:(NSURLRequest*)theRequest {
    return theRequest;
}

/**
 * Start loading the request.
 *
 * When loading a request, the HEADERs are altered to prevent browser caching.
 */

- (void)startLoading {
    NSData *data = [NSData dataWithContentsOfFile:self.request.URL.path];

    // add the no-cache HEADERs to the request while preserving the existing HEADER values.
    NSDictionary *headers = [NSDictionary dictionaryWithObjectsAndKeys:
                             [self.request.allHTTPHeaderFields objectForKey:@"Accept"], @"Accept",
                             @"no-cache", @"Cache-Control",
                             @"no-cache", @"Pragma",
                             [NSString stringWithFormat:@"%d", (int)[data length]], @"Content-Length",
                             nil];

    // create a response using the request and our new HEADERs
    NSHTTPURLResponse *response = [[NSHTTPURLResponse alloc] initWithURL:self.request.URL
                                                              statusCode:200
                                                             HTTPVersion:@"1.1"
                                                            headerFields:headers];

    // deliver the response and enable in-memory caching (we may want to completely disable this if issues arise)
    [self.client URLProtocol:self didReceiveResponse:response cacheStoragePolicy:NSURLCacheStorageAllowedInMemoryOnly];
    [self.client URLProtocol:self didLoadData:data];
    [self.client URLProtocolDidFinishLoading:self];
}

/**
 * Stop loading the request.
 *
 * When the request is cancelled, we have an opportunity to clean up and/or recover. However, for our purpose
 * the ContentSync class will notify the user that the connection failed.
 */

- (void)stopLoading {
    NSLog(@"NSURLProtocolNoCache request was cancelled.");
}

@end
