//
//  AppLoader.h
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc.
//

#import <Foundation/Foundation.h>
#import "FileDownloadURLConnection.h"
#import "ZipOperation.h"

#import <Cordova/CDVPlugin.h>

@class StatusBarOverlayView;

@protocol StatusBarOverlayDelegate  
    
- (void) statusBarTapped:(NSUInteger)numberOfTaps;

@end


@interface AppLoader : CDVPlugin < FileDownloadURLConnectionDelegate, ZipOperationDelegate, StatusBarOverlayDelegate > {
}

@property (nonatomic, copy)	NSString* downloadsFolder;
@property (nonatomic, copy)	NSString* appsFolder;
@property (nonatomic, retain)	UINavigationBar* navigationBar;
@property (nonatomic, retain)	StatusBarOverlayView* overlayView;

- (void) load:(CDVInvokedUrlCommand*)command;
- (void) fetch:(CDVInvokedUrlCommand*)command;
- (void) remove:(CDVInvokedUrlCommand*)command;

@end


@interface StatusBarOverlayView : UIView {
    
}

@property (nonatomic, assign) id<StatusBarOverlayDelegate> delegate;

@end

/* Errors */

typedef enum 
{
    AppLoaderErrorAppNotFound = 1

} AppLoaderError;