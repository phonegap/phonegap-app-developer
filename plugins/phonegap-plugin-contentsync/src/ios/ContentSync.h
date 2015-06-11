#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import "SSZipArchive.h"

enum ProgressState {
    Stopped = 0,
    Downloading,
    Extracting,
    Complete
};
typedef NSUInteger ProgressState;

enum ErrorCodes {
    INVALID_URL_ERR = 1,
    CONNECTION_ERR,
    UNZIP_ERR,
};
typedef NSUInteger ErrorCodes;

@interface ContentSyncTask: NSObject

@property (nonatomic) CDVInvokedUrlCommand* command;
@property (nonatomic) NSURLSessionDownloadTask* downloadTask;
@property (nonatomic) NSString* archivePath;
@property (nonatomic) NSInteger progress;
@property (nonatomic) BOOL extractArchive;

@end

@interface ContentSync : CDVPlugin <NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDownloadDelegate, SSZipArchiveDelegate>

@property (nonatomic) NSString* currentPath;
@property (nonatomic) NSMutableArray *syncTasks;
@property (nonatomic) NSURLSession* session;

- (void) sync:(CDVInvokedUrlCommand*)command;
- (void) cancel:(CDVInvokedUrlCommand*)command;
- (void) download:(CDVInvokedUrlCommand*)command;
- (void) unzip:(CDVInvokedUrlCommand*)command;

@end

/**
 * NSURLProtocolNoCache
 *
 * Custom URL Protocol handler to prevent caching of local assets.
 */

@interface NSURLProtocolNoCache : NSURLProtocol
@end
