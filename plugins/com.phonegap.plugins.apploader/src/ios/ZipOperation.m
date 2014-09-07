//
//  ZipOperation.m
//  
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc. All rights reserved.
//

#import "ZipOperation.h"
#import <CommonCrypto/CommonCryptor.h>

@interface ZipOperation (PrivateMethods)

- (BOOL) __zip;
- (BOOL) __unzip;

@end

@implementation ZipResult

@synthesize source, target, ok, zip, context;

+ (id) newResult:(BOOL)aZip ok:(BOOL)aOk source:(NSString*)aSource target:(NSString*)aTarget context:(id)aContext
{
	ZipResult* result = [ZipResult alloc];
    if (!result) return nil;
	
	result.zip = aZip;
	result.source	= aSource;
	result.target = aTarget;
	result.context = aContext;
	result.ok = aOk;
	
    return result;
}

- (void)dealloc 
{
	self.source = nil;
	self.target = nil;
	self.context = nil;
	
    [super dealloc];
}

- (NSDictionary*) toDictionary
{
	return [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:[NSNumber numberWithBool:self.zip], self.source, self.target, nil] 
														   forKeys:[NSArray arrayWithObjects:@"zip", @"source", @"target", nil]];
}
	
@end

@implementation ZipProgress

@synthesize source, filename, zip, entryNumber, entryTotal, context;

+ (id) newProgress:(BOOL)aZip source:(NSString*)aSource filename:(NSString*)aFilename context:(id)aContext
	entryNumber:(uint64_t)aEntryNumber entryTotal:(uint64_t)aEntryTotal
{
	ZipProgress* progress = [ZipProgress alloc];
    if (!progress) return nil;
	
	progress.zip = aZip;
	progress.source	= aSource;
	progress.context	= aContext;
	progress.filename = aFilename;
	progress.entryNumber = aEntryNumber;
	progress.entryTotal = aEntryTotal;
	
    return progress;
}

- (void)dealloc 
{
	self.source = nil;
	self.filename = nil;
	
    [super dealloc];
}

- (NSDictionary*) toDictionary
{
	return [NSDictionary dictionaryWithObjects:[NSArray arrayWithObjects:[NSNumber numberWithBool:self.zip], self.source, self.filename, [NSNumber numberWithLongLong:self.entryNumber], [NSNumber numberWithLongLong:self.entryTotal], nil] 
															 forKeys:[NSArray arrayWithObjects:@"zip", @"source", @"filename", @"entryNumber", @"entryTotal", nil]];
}

@end


@implementation ZipOperation

@synthesize zip, source, target, delegate, context;

- (id)initAsDeflate:(BOOL)aZip withSource:(NSString*)aSource target:(NSString*)aTarget andContext:(id)aContext
{
    if (![super init]) return nil;
	
	self.zip = aZip;
	self.source = aSource;
	self.target = aTarget;
	self.context = aContext;
	self.delegate = nil;
	
    return self;
}

- (void)dealloc {
	self.source = nil;
	self.target = nil;
	
    [super dealloc];
}

- (void) main 
{
	NSAutoreleasePool* pool = [[NSAutoreleasePool alloc] init];
	
	BOOL ok = NO;
	
	if (self.zip) {
		ok = [self __zip];
	} else {
		ok = [self __unzip];
	}
	
	if (self.delegate != nil)
	{
		ZipResult* result = [[ZipResult newResult:self.zip ok:ok source:self.source target:self.target context:self.context] autorelease];
		
		[self.delegate performSelectorOnMainThread:@selector(zipResult:) withObject:result waitUntilDone:YES];
	}
	
	[pool drain];
}

- (BOOL) __zip
{
	// TODO: not interested in zipping yet...
	return NO;
}

- (BOOL) __unzip
{
	ZipArchive* arc = [[ZipArchive alloc] init];
	arc.delegate = self;
	
	BOOL ok = [arc UnzipOpenFile:self.source];
	if (ok)
	{
		[arc UnzipFileTo:self.target overWrite:YES];
		[arc UnzipCloseFile];
	}
	
	arc.delegate = nil;
	[arc release];
	
	return ok;
}

#pragma mark -
#pragma mark ZipArchiveDelegate

- (void) fileUnzippedFromZipfile:(NSString*)zipFile filename:(NSString*)filename 
					  entryTotal:(uLong)entryTotal entryNumber:(uLong)entryNumber 
					  compressed:(uLong)compressedBytes uncompressed:(uLong)uncompressedBytes;
{
	if (self.delegate != nil)
	{
		ZipProgress* progress = [[ZipProgress newProgress:self.zip source:zipFile filename:filename context:self.context 
											  entryNumber:entryNumber entryTotal:entryTotal] autorelease];
		
		[self.delegate performSelectorOnMainThread:@selector(zipProgress:) withObject:progress waitUntilDone:YES];
	}
}

@end
