#import <Foundation/Foundation.h>
#import <Cordova/CDVPlugin.h>
#import "SSZipArchive.h"

@interface Zip : CDVPlugin <SSZipArchiveDelegate> {
    @private
    CDVInvokedUrlCommand* _command;
}


- (void)unzip:(CDVInvokedUrlCommand*)command;
- (void)zipArchiveProgressEvent:(NSInteger)loaded total:(NSInteger)total;

@end
