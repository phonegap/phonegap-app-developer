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

- (void)pluginInitialize {
    self.session = [self backgroundSession];
}

- (CDVPluginResult*) preparePluginResult:(NSInteger)progress status:(NSInteger)status {
    CDVPluginResult *pluginResult = nil;
    
    NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:2];
    [message setObject:[NSNumber numberWithInteger:progress] forKey:@"progress"];
    [message setObject:[NSNumber numberWithInteger:status] forKey:@"status"];
    pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    
    return pluginResult;
}

- (void)sync:(CDVInvokedUrlCommand*)command
{
    [self startDownload:command extractArchive:YES];
}

- (void) download:(CDVInvokedUrlCommand*)command {
    [self startDownload:command extractArchive:NO];
}

- (void)startDownload:(CDVInvokedUrlCommand*)command extractArchive:(BOOL)extractArchive {
    CDVPluginResult* pluginResult = nil;
    NSString* src = [command.arguments objectAtIndex:0];
    
    if(src != nil) {
        NSLog(@"startDownload from %@", src);
        NSURL *downloadURL = [NSURL URLWithString:src];
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:downloadURL];
        
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
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Arg was null"];
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
                NSString* type = [sTask.command.arguments objectAtIndex:2];
                bool overwrite = ([type compare:@"replace"] ? YES : NO);
                
                CDVInvokedUrlCommand* command = [CDVInvokedUrlCommand commandFromJson:[NSArray arrayWithObjects:sTask.command.callbackId, @"Zip", @"unzip", [NSMutableArray arrayWithObjects:[sourceURL absoluteString], [extractURL absoluteString], overwrite, nil], nil]];
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
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
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
        BOOL overwrite = [command argumentAtIndex:2 withDefault:@(YES)];
        
        @try {
            NSError *error;
            if(![SSZipArchive unzipFileAtPath:[sourceURL path] toDestination:[destinationURL path] overwrite:overwrite password:nil error:&error delegate:weakSelf]) {
                NSLog(@"%@ - %@", @"Error occurred during unzipping", [error localizedDescription]);
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
            } else {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            }
        }
        @catch (NSException *exception) {
            NSLog(@"%@ - %@", @"Error occurred during unzipping", [exception debugDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
        }
        [pluginResult setKeepCallbackAsBool:YES];
        
        [weakSelf.commandDelegate sendPluginResult:pluginResult callbackId:callbackId];
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
        // FIXME: GET RID OF THIS SHIT / Copying cordova assets
        if([[[sTask command] argumentAtIndex:4 withDefault:@(NO)] boolValue] == YES) {
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

        NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:1];
        [message setObject:unzippedPath forKey:@"localPath"];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
        [pluginResult setKeepCallbackAsBool:NO];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:sTask.command.callbackId];
        [[self syncTasks] removeObject:sTask];
    }
}

// TODO GET RID OF THIS
- (BOOL) copyCordovaAssets:(NSString*)unzippedPath {
    
    NSFileManager *fileManager = [NSFileManager defaultManager];
    NSError *errorCopy;
    NSArray* cordovaAssets = [NSArray arrayWithObjects:@"cordova.js",@"cordova_plugins.js",@"plugins", nil];
    NSURL* destinationURL = [NSURL fileURLWithPath:unzippedPath];
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

- (NSURLSession*) backgroundSession {
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
        session = [NSURLSession sessionWithConfiguration:configuration delegate:self delegateQueue:nil];
    });
    return session;
}

@end
