//
//  ZipArchive.h
//  From http://code.google.com/p/ziparchive/
//  MIT Licensed
//
//  Created by aish on 08-9-11.
//  acsolu@gmail.com
//  Copyright 2008  Inc. All rights reserved.
//
// History: 
//    09-11-2008 version 1.0    release
//    10-18-2009 version 1.1    support password protected zip files
//    10-21-2009 version 1.2    fix date bug
//
//  With additions from Shazron Abdullah, Nitobi Software Inc.

#import <Foundation/Foundation.h>

#include "zip.h"
#include "unzip.h"


@protocol ZipArchiveDelegate <NSObject>
@optional
-(void) ErrorMessage:(NSString*) msg;
-(BOOL) OverWriteOperation:(NSString*) file;
- (void) fileUnzippedFromZipfile:(NSString*)zipFile filename:(NSString*)filename entryTotal:(uLong)entryTotal entryNumber:(uLong)entryNumber 
					  compressed:(uLong)compressedBytes uncompressed:(uLong)uncompressedBytes;

@end


@interface ZipArchive : NSObject {
@private
	zipFile		_zipFile;
	unzFile		_unzFile;
	
	NSString* unzipFilename;
	NSString* zipFilename;
	
	NSString*   _password;
	id<ZipArchiveDelegate>			_delegate;
}

@property (nonatomic, copy) NSString* unzipFilename;
@property (nonatomic, copy) NSString* zipFilename;
@property (nonatomic, retain) id<ZipArchiveDelegate> delegate;

-(BOOL) CreateZipFile2:(NSString*) zipFile;
-(BOOL) CreateZipFile2:(NSString*) zipFile Password:(NSString*) password;
-(BOOL) addFileToZip:(NSString*) file newname:(NSString*) newname;
-(BOOL) CloseZipFile2;

-(BOOL) UnzipOpenFile:(NSString*) zipFile;
-(uLong) UnzipGetNumberOfEntries;
-(BOOL) UnzipOpenFile:(NSString*) zipFile Password:(NSString*) password;
-(BOOL) UnzipFileTo:(NSString*) path overWrite:(BOOL) overwrite;
-(BOOL) UnzipCloseFile;
@end
