//
//  BinaryDownloader.m
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc.
//

#import "BinaryDownloader.h"
#import "FileDownloadURLConnection.h"

#import <Cordova/NSMutableArray+QueueAdditions.h>

@implementation DownloadQueueItem

@synthesize uri, filepath, context, credential;

+ (id) newItem:(NSString*)aUri withFilepath:(NSString*)aFilepath context:(id)aContext andCredential:(NSURLCredential*)aCredential
{
	DownloadQueueItem* item = [DownloadQueueItem alloc];
    if (!item) return nil;
	
	item.uri = aUri;
	item.filepath = aFilepath;
	item.context = aContext;
	item.credential = aCredential;
	
    return item;
}

- (void) dealloc 
{
	self.uri = nil;
	self.filepath = nil;
	self.context = nil;
	self.credential = nil;
	
    [super dealloc];
}

- (NSString*) JSONValue
{
	return [NSString stringWithFormat:@"{ uri: '%@', filepath: '%@', context: '%@' }",
			self.uri, self.filepath, self.context
			];
}

- (BOOL) isEqual:(id)other 
{
    if (other == self)
        return YES;
    
	if (!other || ![other isKindOfClass:[self class]])
        return NO;
	
	DownloadQueueItem* item = (DownloadQueueItem*)other;
    return [self.uri isEqual:item.uri] && [self.filepath isEqual:item.filepath] && [self.context isEqual:item.context] && [self.credential isEqual:item.credential];
}

@end


@implementation BinaryDownloader

@synthesize downloadQueue, activeDownloads;

-(CDVPlugin*) initWithWebView:(UIWebView*)theWebView
{
    self = (BinaryDownloader*)[super initWithWebView:(UIWebView*)theWebView];
    if (self) {
		self.downloadQueue = [[[NSMutableArray alloc] init] autorelease];
        self.activeDownloads = [NSMutableDictionary dictionaryWithCapacity:2];
    }
	return self;
}

- (void) next:(NSString*)currentUrlDownload delegate:(id<FileDownloadURLConnectionDelegate>)delegate
{
	FileDownloadURLConnection* conn = [self.activeDownloads valueForKey:currentUrlDownload];
	if (conn != nil) 
	{
		[self.activeDownloads removeObjectForKey:currentUrlDownload];
	}
	
	@synchronized(self) 
	{
		if ([self.downloadQueue count] > 0) 
		{
			[self.downloadQueue dequeue]; // dequeue current
			DownloadQueueItem* queueItem = [self.downloadQueue queueHead]; // get next
			if (queueItem != nil) {
				[self download:queueItem delegate:delegate];
			}
		}
	}
}

- (BOOL) cancel:(NSString*)uri
{
	FileDownloadURLConnection* conn = [self.activeDownloads objectForKey:uri];
	BOOL found = (conn != nil);
	
	if (found) 
	{
		[conn cancel];
		[self.activeDownloads removeObjectForKey:uri];
	}
	
	return found;
}

- (void) cancel:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	if (argc < 2) {
		return;
	}
	
	NSString* callbackId = [arguments objectAtIndex:0];
	NSString* uri = [arguments objectAtIndex:1];

	BOOL cancelled = [self cancel:uri];
	if (cancelled) 
	{
		NSString* successString = [NSString stringWithFormat:@"Download '%@' successfully cancelled.", uri];
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:successString];
		[super writeJavascript:[pluginResult toSuccessCallbackString:callbackId]];
	}
	else
	{
		NSString* errorString = [NSString stringWithFormat:@"Download '%@' not found as an active download.", uri];
		CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:errorString];
		[super writeJavascript:[pluginResult toErrorCallbackString:callbackId]];
	}
}

- (void) download:(DownloadQueueItem*)queueItem delegate:(id<FileDownloadURLConnectionDelegate>)delegate
{
	@synchronized(self) 
	{
		// check whether queueItem already exists in queue
		NSUInteger index = [self.downloadQueue indexOfObject:queueItem];
		if (index == NSNotFound) {
			[self.downloadQueue enqueue:queueItem];
		}
		//[queueItem release];
		
		if ([self.downloadQueue count] == 1) 
		{
			DownloadQueueItem* item = [self.downloadQueue queueHead]; // don't dequeue - we do it only after error or download finished
			NSURL* url = [NSURL URLWithString:queueItem.uri];

			if (url != nil)
			{
				FileDownloadURLConnection* conn = [[FileDownloadURLConnection alloc] initWithURL:url delegate:delegate filePath:item.filepath andCredential:item.credential];
				conn.context = item.context;
				[self.activeDownloads setObject:conn forKey:item.uri];
				[conn start];
				[conn release];
			}
		}
	}
}

- (void) download:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
	NSUInteger argc = [arguments count];
	if (argc < 3) {
		return;
	}
	
	NSString* callbackId = [arguments objectAtIndex:0];
	NSString* uri = [arguments objectAtIndex:1];
	NSString* filepath = [arguments objectAtIndex:2];
	
	NSString* username = argc > 3? [arguments objectAtIndex:3] : nil;
	NSString* password = argc > 4?[arguments objectAtIndex:4]  : nil;
	NSURLCredential* credential = nil;
	
	if (username !=nil && password != nil) {
		credential = [NSURLCredential credentialWithUser:username password:password persistence:NSURLCredentialPersistenceForSession];
	}

	DownloadQueueItem* queueItem = [DownloadQueueItem newItem:uri withFilepath:filepath context:callbackId andCredential:credential];
	[self download:queueItem delegate:self];
    [queueItem release];
}

#pragma mark -
#pragma mark FileDownloadURLConnectionDelegate methods

- (void) connectionDidFail:(FileDownloadURLConnection*)theConnection withError:(NSError*)error
{	
	NSString* urlKey = [theConnection.url description];
	NSDictionary* errorDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:urlKey, [error localizedDescription], nil] 
									   forKeys:[NSArray arrayWithObjects:@"url", @"error", nil]];

	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:errorDict];
	[super writeJavascript:[pluginResult toErrorCallbackString:theConnection.context]];
	
	[self next:urlKey delegate:self];
}

- (void) connectionDidFinish:(FileDownloadURLConnection*)theConnection
{	
	NSString* urlKey = [theConnection.url description];
	NSDictionary* successDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:urlKey, theConnection.filePath, @"finished", nil] 
														  forKeys:[NSArray arrayWithObjects:@"url", @"filePath", @"status", nil]];
	
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:successDict];
	[super writeJavascript:[pluginResult toSuccessCallbackString:theConnection.context]];
	
	FileDownloadURLConnection* conn = [self.activeDownloads valueForKey:urlKey];
	if (conn != nil) 
	{
		[self.activeDownloads removeObjectForKey:urlKey];
	}
	
	@synchronized(self) 
	{
		if ([self.downloadQueue count] > 0) 
		{
			[self.downloadQueue dequeue]; // dequeue current
			DownloadQueueItem* queueItem = [self.downloadQueue queueHead]; // get next
			if (queueItem != nil) {
				[self download:queueItem delegate:self];
			}
		}
	}
}

- (void) connectionDownloadProgress:(FileDownloadURLConnection*)theConnection 
						 totalBytes:(u_int64_t)totalBytes 
						   newBytes:(u_int64_t)newBytes
{
	
	NSString* urlKey = [theConnection.url description];
	NSDictionary* successDict = [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:urlKey, theConnection.filePath, @"downloading", theConnection.contentLength, [NSNumber numberWithLongLong:totalBytes], nil] 
															forKeys:[NSArray arrayWithObjects:@"url", @"filePath", @"status", @"contentLength", @"bytesDownloaded", nil]];
	
	CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:successDict];
	[super writeJavascript:[pluginResult toSuccessCallbackString:theConnection.context]];
}

@end
