//
//  ZipOperation.h
//
//  Created by Shazron Abdullah
//  Copyright 2011 Nitobi Software Inc. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "ZipArchive.h"

@interface ZipResult : NSObject {
}

@property(copy) NSString* source;
@property(copy) NSString* target;
@property(copy) id context;
@property(assign) BOOL zip;
@property(assign) BOOL ok;

+ (id) newResult:(BOOL)aZip ok:(BOOL)aOk source:(NSString*)aSource target:(NSString*)aTarget context:(NSString*)context;

- (NSDictionary*) toDictionary;

@end

@interface ZipProgress : NSObject {
}

@property(copy) NSString* source;
@property(copy) NSString* filename;
@property(copy) id context;
@property(assign) BOOL zip;
@property(assign) uint64_t entryNumber;
@property(assign) uint64_t entryTotal;


+ (id) newProgress:(BOOL)aEncrypt source:(NSString*)aSource filename:(NSString*)aFilename context:(id)aContext
		 entryNumber:(uint64_t)entryNumber entryTotal:(uint64_t)entryTotal;

- (NSDictionary*) toDictionary;

@end


@protocol ZipOperationDelegate<NSObject>

- (void) zipResult:(ZipResult*)result;
- (void) zipProgress:(ZipProgress*)progress;

@end

@interface ZipOperation : NSOperation <ZipArchiveDelegate> {
}

@property(copy) NSString* source;
@property(copy) NSString* target;
@property(copy) id context;
@property(assign) BOOL zip;
@property(assign) NSObject<ZipOperationDelegate>* delegate;

- (id)initAsDeflate:(BOOL)zip withSource:(NSString*)source target:(NSString*)target andContext:(id)context;

@end
