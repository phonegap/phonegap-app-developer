//
//  AppLoader.m
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc.
//

#import "AppLoader.h"

#import <Cordova/CDVCommandDelegate.h>
#import <Cordova/CDVDebug.h>
#import <Cordova/CDVViewController.h>

#import "BinaryDownloader.h"
#import "FileDownloadURLConnection.h"
#import "ZipUtil.h"
#import "UIWebViewPGAdditions.h"
#import "AppDelegate.h"

#define APPLOADER_DOWNLOADS_FOLDER  @"AppLoaderDownloads"
#define APPLOADER_APPS_FOLDER       @"AppLoaderApps"
#define BINARY_DOWNLOAD_PLUGIN      @"com.nitobi.BinaryDownloader"
#define ZIP_UTIL_PLUGIN             @"com.nitobi.ZipUtil"
#define THIS_PLUGIN                 @"com.nitobi.AppLoader"

@interface NSObject (AppLoader_PrivateMethods)

- (NSString*) __makeLibrarySubfolder:(NSString*)foldername;
- (BOOL) __clearLibrarySubfolder:(NSString*)foldername;
- (NSError*) __removeFolder:(NSString*)appId;

- (void) removeStatusBarOverlay;
- (void) showStatusBarOverlay;

- (BOOL) removeNavigationBar;
- (BOOL) addNavigationBar;

- (void) onStatusBarFrameChange:(NSNotification*)notification;

@end

@implementation AppLoader

@synthesize downloadsFolder, appsFolder, navigationBar, overlayView;

- (void) pluginInitialize
{
    if (self) {
        [self __clearLibrarySubfolder:APPLOADER_DOWNLOADS_FOLDER];
        self.downloadsFolder = [self __makeLibrarySubfolder:APPLOADER_DOWNLOADS_FOLDER];
        self.appsFolder = [self __makeLibrarySubfolder:APPLOADER_APPS_FOLDER];
        
        [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(onStatusBarFrameChange:) name:UIApplicationDidChangeStatusBarFrameNotification object:nil];
    }
}

- (NSString*) appFilePath:(NSString*)appId
{
    return [NSString stringWithFormat:@"%@/%@", self.appsFolder, appId];
}

- (NSString*) unzipTempFilePath:(NSString*)appId
{
    return [NSString stringWithFormat:@"%@/%@", self.downloadsFolder, [NSString stringWithFormat:@"%@-temp", appId]];
}

- (NSString*) downloadFilePath:(NSString*)appId
{
    return [NSString stringWithFormat:@"%@/%@", self.downloadsFolder, appId];
}

- (NSString*) appUrl:(NSString*)appId
{
    return [NSString stringWithFormat:@"%@/index.html", [self appFilePath:appId]];
}

- (NSURL*) homeUrl
{
    NSString* homeFilePath = [((CDVViewController *)self.viewController) startPage];
    return [NSURL fileURLWithPath:homeFilePath];
}

float nextUpdatePercent;
const float updateIncrement = 2.0f;

// this is triggered by the navigation bar back button
- (void) goBack
{
    [self removeStatusBarOverlay];
    
    NSURLRequest* homeRequest = [NSURLRequest requestWithURL:[self homeUrl] cachePolicy:NSURLRequestUseProtocolCachePolicy timeoutInterval:5.0];
    [self.webView loadRequest:homeRequest];
    [[[[UIApplication sharedApplication] delegate] window] makeKeyAndVisible];
}

- (NSError*) __removeApp:(NSString*)appId
{
    NSString* appFilePath = [self appFilePath:appId];
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSError* error = nil;
    
    if ([fileManager fileExistsAtPath:appFilePath]) 
    {
        [fileManager removeItemAtPath:appFilePath error:&error];
    } 
    else 
    {
        NSString* description = [NSString stringWithFormat:NSLocalizedString(@"AppLoader app not found: %@", @"AppLoader app not found: %@"), appFilePath];
        NSDictionary* userInfo = [NSDictionary dictionaryWithObjectsAndKeys:
                              description, NSLocalizedDescriptionKey,
                              description, NSLocalizedFailureReasonErrorKey,
                              nil];
        error = [NSError errorWithDomain:THIS_PLUGIN code:AppLoaderErrorAppNotFound userInfo:userInfo];
    }
    
    return error;
}

- (void) onStatusBarFrameChange:(NSNotification*)notification
{
    NSValue* value = [[notification userInfo] objectForKey:UIApplicationStatusBarFrameUserInfoKey];
    if (value) {
        CGRect oldFrame = [value CGRectValue];
        CGRect newFrame = [[UIApplication sharedApplication] statusBarFrame];
        
        BOOL isIncreasedHeightStatusBar = (newFrame.size.height > oldFrame.size.height);
        if (isIncreasedHeightStatusBar) {
            NSLog(@"Removing status bar overlay.");
            [self removeStatusBarOverlay];
        } else {
            NSLog(@"Adding status bar overlay.");
            [self showStatusBarOverlay];
        }
    }
}

#pragma mark -
#pragma mark StatusBarOverlay

- (void) showStatusBarOverlay
{
    if (self.overlayView) {
        return;
    }
    
    UIWindow* statusWindow = [[UIWindow alloc] initWithFrame:[[UIApplication sharedApplication] statusBarFrame]];
    statusWindow.windowLevel = UIWindowLevelStatusBar+1.0f;
    statusWindow.hidden = NO;
    statusWindow.backgroundColor = [UIColor clearColor];
    [statusWindow makeKeyAndVisible];
    
    self.overlayView = [[[StatusBarOverlayView alloc] init] autorelease];  
    self.overlayView.frame = [[UIApplication sharedApplication] statusBarFrame];  
    self.overlayView.backgroundColor = [UIColor clearColor];  
    self.overlayView.delegate = self;
    [statusWindow addSubview:self.overlayView]; 
    
    // make the main window key, if not the keyboard won't show
    AppDelegate* myApp = [[AppDelegate alloc] init];
    [((AppDelegate *)myApp).window makeKeyAndVisible];
}

- (void) removeStatusBarOverlay
{
    if (!self.overlayView) {
        return;
    }
    
    [self removeNavigationBar];
    
    [self.overlayView removeFromSuperview];
    self.overlayView = nil;
}

#pragma mark -
#pragma mark NavigationBar

- (BOOL) removeNavigationBar
{
    if (!self.navigationBar) {
        return NO;
    }
    
    [self.webView pg_removeSiblingView:self.navigationBar withAnimation:YES];
    [self.webView pg_relayout:NO];
    
    self.navigationBar = nil;
    
    return YES;
}

- (BOOL) addNavigationBar
{
    if (self.navigationBar) {
        return NO;
    }
    
    CGFloat height   = 45.0f;
    UIBarStyle style = UIBarStyleDefault;
    
    CGRect toolBarBounds = self.webView.bounds;
    toolBarBounds.size.height = height;
    
    self.navigationBar = [[[UINavigationBar alloc] init] autorelease];
    [self.navigationBar sizeToFit];
    [self.navigationBar pushNavigationItem:[[[UINavigationItem alloc] initWithTitle:@""] autorelease] animated:NO];
    self.navigationBar.autoresizesSubviews    = YES;
    self.navigationBar.userInteractionEnabled = YES;
    self.navigationBar.barStyle               = style;
    
    [self.webView pg_addSiblingView:self.navigationBar withPosition:CDVLayoutPositionTop withAnimation:YES];
    
    UIBarButtonItem* item = [[UIBarButtonItem alloc] initWithTitle:NSLocalizedString(@"Back", @"Back") style:UIBarButtonItemStyleBordered 
                                                            target:self action:@selector(goBack)];
    self.navigationBar.topItem.leftBarButtonItem = item;
    
    [item release];
    
    return YES;
}

#pragma mark -
#pragma mark PhoneGap commands

- (void) initialize:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    NSString* appId = @"0";
    
    NSString* appURL = [self appUrl:appId];
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:appURL]) {
        
        // TODO: this fails
        NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:@"false", nil] 
                                                           forKeys:[NSArray arrayWithObjects:@"firstRun", nil]];
        
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsDict];
        [pluginResult setKeepCallbackAsBool:FALSE];
        [super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
    }
    else {
    
        NSString* downloadFilePath = [[NSBundle mainBundle]  pathForResource:@"startup.zip" ofType:nil];
        
        NSDictionary* context = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:appId, callbackId, downloadFilePath, nil] 
                                    forKeys:[NSArray arrayWithObjects:@"appId", @"callbackId", @"filePath", nil]];
        
        [self __installApp:downloadFilePath :context];
    }
}

- (void) load:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    
    NSString* appId = @"0";
    
    // ///////////////////////////////////////////  
    
    CDVPluginResult* pluginResult = nil;
    NSString* appURL = [self appUrl:appId];
    
    if ([[NSFileManager defaultManager] fileExistsAtPath:appURL]) 
    {
        [self showStatusBarOverlay];
        NSURL* url = [NSURL fileURLWithPath:appURL];
        [self.webView loadRequest:([NSURLRequest requestWithURL:url])];
        [[[[UIApplication sharedApplication] delegate] window] makeKeyAndVisible];
    } 
    else 
    {
        NSString* errorString = [NSString stringWithFormat:@"AppLoader app not found: %@", appURL];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }   
}

- (void) fetch:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    
    NSString* appId = @"0";
    NSString* uri = [command argumentAtIndex:0];
    nextUpdatePercent = updateIncrement;
    
    int argc = [[command arguments] count];
    NSString* username = argc > 2? [command argumentAtIndex:2] : nil;
    NSString* password = argc > 3? [command argumentAtIndex:3] : nil;
    
    // ///////////////////////////////////////////  
    
    NSURLCredential* credential = nil;
    NSString* downloadFilePath = [self downloadFilePath:appId];
    
    if (username !=nil && password != nil) {
        credential = [NSURLCredential credentialWithUser:username password:password persistence:NSURLCredentialPersistenceForSession];
    }
    
    BinaryDownloader* bdPlugin = [[BinaryDownloader alloc] initWithWebView:self.webView];
    if (bdPlugin != nil)
    {
        // remove any previous existing download
        NSError* error = nil;
        [[NSFileManager defaultManager] removeItemAtPath:downloadFilePath error:&error]; 
        
        NSDictionary* context = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:appId, uri, callbackId, downloadFilePath, nil] 
                                                            forKeys:[NSArray arrayWithObjects:@"appId", @"uri", @"callbackId", @"filePath", nil]];
        DownloadQueueItem* queueItem = [[DownloadQueueItem newItem:uri withFilepath:downloadFilePath context:context andCredential:credential] autorelease];
        [bdPlugin download:queueItem delegate:self];
    }
    else 
    {
        NSString* errorString = [NSString stringWithFormat:@"Plugin '%@' not found.", BINARY_DOWNLOAD_PLUGIN];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }
}

- (void) remove:(CDVInvokedUrlCommand*)command
{
    NSString* callbackId = [command callbackId];
    
    NSString* appId = [command argumentAtIndex:0];
    CDVPluginResult* pluginResult = nil;
    
    // ///////////////////////////////////////////
    
    NSError* error = [self __removeApp:appId];
    if (error == nil)
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
        [super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
    }
    else
    {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }
}


#pragma mark -
#pragma mark FileDownloadURLConnectionDelegate methods

- (void) connectionDidFail:(FileDownloadURLConnection*)theConnection withError:(NSError*)error
{   
    NSString* callbackId = [theConnection.context objectForKey:@"callbackId"];
    NSString* urlKey = [theConnection.url description];
    
    BinaryDownloader* bdPlugin = [[BinaryDownloader alloc] initWithWebView:self.webView];
    if (bdPlugin != nil) {
        [bdPlugin next:urlKey delegate:self];
    } else {
        NSString* errorString = [NSString stringWithFormat:@"Plugin '%@' not found.", BINARY_DOWNLOAD_PLUGIN];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }       
    
    DLog(@"Failed to download '%@', error: %@", urlKey, [error localizedDescription]);
    
    NSString* errorString = [NSString stringWithFormat:@"Failed to download (error: %@)", [error localizedDescription]];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
    [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
}

- (void) connectionDidFinish:(FileDownloadURLConnection*)theConnection
{   
    NSString* urlKey = [theConnection.url description];
    NSString* callbackId = [theConnection.context objectForKey:@"callbackId"];
    
    BinaryDownloader* bdPlugin = [[BinaryDownloader alloc] initWithWebView:self.webView];
    if (bdPlugin != nil) {
        [bdPlugin next:urlKey delegate:self];
    } else {
        NSString* errorString = [NSString stringWithFormat:@"Plugin '%@' not found.", BINARY_DOWNLOAD_PLUGIN];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }       
    
    [self __installApp:theConnection.filePath : theConnection.context];
}

- (void) connectionDownloadProgress:(FileDownloadURLConnection*)theConnection 
                         totalBytes:(u_int64_t)totalBytes 
                           newBytes:(u_int64_t)newBytes
{
    
    NSNumber* percent = [NSNumber numberWithDouble:((totalBytes*100.0)/[theConnection.contentLength integerValue])];
    
    if ([percent floatValue] >= nextUpdatePercent) {
        nextUpdatePercent += updateIncrement;
        DLog(@"Download Progress: %llu of %@ (%.1f%%)", totalBytes, theConnection.contentLength, [percent doubleValue]);
    
        NSString* callbackId = [theConnection.context objectForKey:@"callbackId"];
     
        NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:@"downloading", percent, nil] forKeys:[NSArray arrayWithObjects:@"state", @"status", nil]];
    
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsDict];
        [pluginResult setKeepCallbackAsBool:TRUE];
        [super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
    }

}

#pragma mark -
#pragma mark ZipOperationDelegate

- (void) zipResult:(ZipResult*)result
{
    NSString* callbackId = [result.context objectForKey:@"callbackId"];
    NSString* appId = [result.context objectForKey:@"appId"];
    NSString* appPath = [self appFilePath:appId];
    NSError* error = nil;
    
    CDVPluginResult* pluginResult = nil;
    if (result.ok && !result.zip) { // only interested in unzip
        
        // remove any previous existing app, since the unzip was successful
        [self __removeApp:appId];

        // move result.target to appPath
        [[NSFileManager defaultManager] moveItemAtPath:result.target toPath:appPath error:&error];
        
        // copy cordova.js into downloaded app if its not there
        NSString* srcPath = [[[NSBundle mainBundle] resourcePath] stringByAppendingPathComponent:@"www/cordova.js"];
        NSString* destPath = [NSString stringWithFormat:@"%@/cordova.js", appPath];
        if (![[NSFileManager defaultManager] fileExistsAtPath:destPath]) 
        {
            [[NSFileManager defaultManager] copyItemAtPath:srcPath toPath:destPath error:&error];   
        }
        destPath = [NSString stringWithFormat:@"%@/phonegap.js", appPath];
        if (![[NSFileManager defaultManager] fileExistsAtPath:destPath]) 
        {
            [[NSFileManager defaultManager] copyItemAtPath:srcPath toPath:destPath error:&error];   
        }
        
        if (error == nil) {
            NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:@"complete", nil] 
                                                               forKeys:[NSArray arrayWithObjects:@"state", nil]];

            CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsDict];
            [pluginResult setKeepCallbackAsBool:FALSE];
            [super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
        } else {
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:[error localizedDescription]];
            DLog(@"%@", [error localizedDescription]);
            [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
        }
        
    } else {
        NSString* errorString = [NSString stringWithFormat:@"Error when un-zipping downloaded file: %@", result.source];
        DLog(@"%@", errorString);
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
    }
}

- (void) zipProgress:(ZipProgress*)progress
{
    // COMMENTED OUT - since 'fetch' doesn't care about any of this
    
//  NSString* callbackId = [progress.context objectForKey:@"callbackId"];
//  
//  NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:[progress toDictionary], nil] 
//                                                     forKeys:[NSArray arrayWithObjects:@"zipProgress", nil]];
//  
//  CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsDict];
//  [super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
    
    DLog(@"%@ Progress: %llu of %llu", (progress.zip? @"Zip":@"Unzip"), progress.entryNumber, progress.entryTotal);
}

#pragma mark -
#pragma mark PrivateMethods

- (void) __installApp:(NSString*)filePath : (NSDictionary*)context
{
    NSString* appId = @"0";
    NSString* unzipFolder = [self unzipTempFilePath:appId];
    
    ZipUtil* zuPlugin = [[ZipUtil alloc] initWithWebView:self.webView];
    if (zuPlugin != nil)
    {
        ZipOperation* zipOp = [[ZipOperation alloc] initAsDeflate:NO withSource:filePath target:unzipFolder andContext:context];
        zipOp.delegate = self;
        [zuPlugin unzip:zipOp];
        [zipOp release];
    }
    else 
    {
        NSString* errorString = [NSString stringWithFormat:@"Plugin '%@' not found.", ZIP_UTIL_PLUGIN];
        CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
        [super writeJavascript:[pluginResult toErrorCallbackString:[context objectForKey:@"callbackId"]]];
    }
}

- (NSString*) __makeLibrarySubfolder:(NSString*)foldername
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
    NSString* subfolderPath = [[paths objectAtIndex:0] stringByAppendingPathComponent:foldername];
    NSFileManager* fileManager = [NSFileManager defaultManager];
    NSError* error = nil;
    
    if (![fileManager fileExistsAtPath:subfolderPath])
    {
        [fileManager createDirectoryAtPath:subfolderPath withIntermediateDirectories:NO 
                                attributes:nil error:&error]; 
    }
    
    if (error != nil) {
        NSLog(@"%s:%s:%d error - %@", __FILE__, __PRETTY_FUNCTION__, __LINE__, error);
        return nil;
    }
    
    return subfolderPath;
}

- (BOOL) __clearLibrarySubfolder:(NSString*)foldername
{
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES);
    NSString* subfolderPath = [[paths objectAtIndex:0] stringByAppendingPathComponent:foldername];
    NSFileManager* fileManager = [NSFileManager defaultManager];
    
    NSError* error = nil;
    BOOL retVal = NO;
    
    if (![fileManager fileExistsAtPath:subfolderPath]) {
        return NO;
    }
    
    if ([fileManager removeItemAtPath:subfolderPath error:&error]) 
    {
        retVal = [fileManager createDirectoryAtPath:subfolderPath withIntermediateDirectories:NO 
                                         attributes:nil error:&error];
    } 
    
    if (error != nil) {
        NSLog(@"%s:%s:%d error - %@", __FILE__, __PRETTY_FUNCTION__, __LINE__, error);
    }
    
    return retVal;
}   

#pragma mark -
#pragma StatusBarOverlayDelegate

- (void) statusBarTapped:(NSUInteger)numberOfTaps
{
    if (numberOfTaps != 2) {
        return;
    }
    
    if (self.navigationBar) {
        [self removeNavigationBar];
    } else {
        [self addNavigationBar];
    }
}

@end

@implementation StatusBarOverlayView

@synthesize delegate;

- (void) dealloc
{
    self.delegate = nil;
    [super dealloc];
}

- (void) touchesEnded:(NSSet*)touches withEvent:(UIEvent*)event 
{
    for (UITouch *touch in touches) 
    {
        if (self.delegate) {
            [self.delegate statusBarTapped:touch.tapCount];
        }
    }
}


@end
