//
//  FileDownloadURLConnection.h
//
//  Created by Shazron Abdullah, Jesse MacFadyen
//  Copyright 2011 Nitobi Software Inc.
//

#import <UIKit/UIKit.h>

@protocol FileDownloadURLConnectionDelegate;

@interface FileDownloadURLConnection : NSObject {
}

@property (nonatomic, assign) BOOL allowSelfSignedCert;
@property (nonatomic, assign) id<FileDownloadURLConnectionDelegate> delegate;
@property (nonatomic, retain) NSMutableData* receivedData;
@property (nonatomic, retain) NSDate* lastModified;
@property (nonatomic, copy) NSString* contentLength;

@property (nonatomic, retain) NSURLConnection* connection;
@property (nonatomic, retain) NSURL* url;
@property (nonatomic, copy)   NSString* filePath;
@property (nonatomic, retain) NSFileHandle* fileHandle;
@property (nonatomic, copy) id context;
@property (nonatomic, retain) NSURLCredential* credential;

- (id) initWithURL:(NSURL *)aURL delegate:(id<FileDownloadURLConnectionDelegate>)aDelegate filePath:(NSString*)aFilePath 
	 andCredential:(NSURLCredential*)aCredential;
- (void) cancel;
- (void) start;

- (NSString*) JSONValue;

@end


@protocol FileDownloadURLConnectionDelegate<NSObject>

- (void) connectionDidFail:(FileDownloadURLConnection*)theConnection withError:(NSError*)error;
- (void) connectionDidFinish:(FileDownloadURLConnection*)theConnection;
- (void) connectionDownloadProgress:(FileDownloadURLConnection*)theConnection totalBytes:(u_int64_t)totalBytes newBytes:(u_int64_t)newBytes;

@end
