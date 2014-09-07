//
//  BinaryDownloader.h
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc.
//

#import <Foundation/Foundation.h>
#import "FileDownloadURLConnection.h"

#import <Cordova/CDVPlugin.h>

@interface DownloadQueueItem : NSObject {
}

@property (nonatomic, copy) NSString* uri;
@property (nonatomic, copy) NSString* filepath;
@property (nonatomic, retain) id context;

@property (nonatomic, retain) NSURLCredential* credential;

+ (id) newItem:(NSString*)aUri withFilepath:(NSString*)aFilepath context:(id)aContext andCredential:(NSURLCredential*)aCredential;
- (NSString*) JSONValue;
- (BOOL) isEqual:(id)other;


@end

@interface BinaryDownloader : CDVPlugin < FileDownloadURLConnectionDelegate > {
}

@property (nonatomic, retain)	NSMutableArray* downloadQueue;
@property (nonatomic, retain)	NSMutableDictionary* activeDownloads;

/* Helpers */

- (BOOL) cancel:(NSString*)uri;
- (void) download:(DownloadQueueItem*)queueItem delegate:(id<FileDownloadURLConnectionDelegate>)delegate;
- (void) next:(NSString*)currentUrlDownload delegate:(id<FileDownloadURLConnectionDelegate>)delegate;

/* PhoneGap API signatures below */

- (void) cancel:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;
- (void) download:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options;

@end
