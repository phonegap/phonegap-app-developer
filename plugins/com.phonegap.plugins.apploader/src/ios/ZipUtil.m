//
//  ZipPlugin.m
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc.
//

#import "ZipUtil.h"


@implementation ZipUtil

@synthesize operationQueue;

-(CDVPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (ZipUtil*)[super initWithWebView:(UIWebView*)theWebView];
    if (self) {
        self.operationQueue = [[[NSOperationQueue alloc] init] autorelease];
    }
	return self;
}

#pragma mark -
#pragma mark ZipOperationDelegate

- (void) zipResult:(ZipResult*)result
{
	NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:[result toDictionary], nil] 
													   forKeys:[NSArray arrayWithObjects:@"zipResult", nil]];
	CDVPluginResult* pluginResult = nil;
	
	if (result.ok) {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:jsDict];
		[super writeJavascript:[pluginResult toSuccessCallbackString:result.context]];
	} else {
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:jsDict];
		[super writeJavascript:[pluginResult toErrorCallbackString:result.context]];
	}
}

- (void) zipProgress:(ZipProgress*)progress
{
	NSDictionary* jsDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:[progress toDictionary], nil] 
													   forKeys:[NSArray arrayWithObjects:@"zipProgress", nil]];
	
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:jsDict];
	[super writeJavascript:[pluginResult toSuccessCallbackString:progress.context]];
}


#pragma mark -
#pragma mark PhoneGap commands

- (void) unzip:(ZipOperation*)zipOperation
{
	[self.operationQueue addOperation:zipOperation];
}

- (void) unzip:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSString* callbackId = [arguments pop];
	
	NSString* sourcePath = [arguments objectAtIndex:0];
	NSString* targetFolder = [arguments objectAtIndex:1];
	
	if ([[NSFileManager defaultManager] fileExistsAtPath:sourcePath]) 
	{
		ZipOperation* zipOp = [[ZipOperation alloc] initAsDeflate:NO withSource:sourcePath target:targetFolder andContext:callbackId];
		zipOp.delegate = self;
		[self unzip:zipOp];
		[zipOp release];
	}
	else 
	{
		NSString* errorString = [NSString stringWithFormat:@"Source path '%@' does not exist.", sourcePath];
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
		[super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
	}
}

- (void) zip:(ZipOperation*)zipOperation
{
    // FUTURE: TODO:
}


- (void) zip:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    // FUTURE: TODO:
}

@end
