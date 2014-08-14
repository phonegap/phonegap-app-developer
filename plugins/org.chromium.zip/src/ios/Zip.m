#import "Zip.h"
#import "CDVFile.h"

@implementation Zip

- (NSString *)pathForURL:(NSString *)urlString
{
    // Attempt to use the File plugin to resolve the destination argument to a
    // file path.
    NSString *path = nil;
    id filePlugin = [self.commandDelegate getCommandInstance:@"File"];
    if (filePlugin != nil) {
        CDVFilesystemURL* url = [CDVFilesystemURL fileSystemURLWithString:urlString];
        path = [filePlugin filesystemPathForURL:url];
    }
    // If that didn't work for any reason, assume file: URL.
    if (path == nil) {
        if ([urlString hasPrefix:@"file:"]) {
            path = [[NSURL URLWithString:urlString] path];
        }
    }
    return path;
}

- (void)unzip:(CDVInvokedUrlCommand*)command
{
    self->_command = command;
    [self.commandDelegate runInBackground:^{
        CDVPluginResult* pluginResult = nil;
        
        @try {
            NSString *zipURL = [command.arguments objectAtIndex:0];
            NSString *destinationURL = [command.arguments objectAtIndex:1];
            NSError *error;

            NSString *zipPath = [self pathForURL:zipURL];
            NSString *destinationPath = [self pathForURL:destinationURL];

            if([SSZipArchive unzipFileAtPath:zipPath toDestination:destinationPath overwrite:YES password:nil error:&error delegate:self]) {
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
            } else {
                NSLog(@"%@ - %@", @"Error occurred during unzipping", [error localizedDescription]);
                pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
            }
        } @catch(NSException* exception) {
            NSLog(@"%@ - %@", @"Error occurred during unzipping", [exception debugDescription]);
            pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Error occurred during unzipping"];
        }
        
        [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    }];
}

- (void)zipArchiveProgressEvent:(NSInteger)loaded total:(NSInteger)total
{
    NSMutableDictionary* message = [NSMutableDictionary dictionaryWithCapacity:2];
    [message setObject:[NSNumber numberWithLongLong:loaded] forKey:@"loaded"];
    [message setObject:[NSNumber numberWithLongLong:total] forKey:@"total"];

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:message];
    [pluginResult setKeepCallbackAsBool:YES];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:self->_command.callbackId];
}
@end
