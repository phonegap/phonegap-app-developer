/*************************************************************************
 *
 * ADOBE CONFIDENTIAL
 * ___________________
 *
 *  Copyright 2013 Adobe Systems Incorporated
 *  All Rights Reserved.
 *
 * NOTICE:  All information contained herein is, and remains
 * the property of Adobe Systems Incorporated and its suppliers,
 * if any.  The intellectual and technical concepts contained
 * herein are proprietary to Adobe Systems Incorporated and its
 * suppliers and are protected by trade secret or copyright law.
 * Dissemination of this information or reproduction of this material
 * is strictly forbidden unless prior written permission is obtained
 * from Adobe Systems Incorporated.
 *
 **************************************************************************/

#import <Foundation/Foundation.h>
#import "ADBMobile.h"

@interface GalleryItem : NSObject

@property (strong) NSString *title;
@property (strong) NSString *description;
@property (strong) NSString *assetName;
@property (strong) NSString *s7params;
@property (nonatomic, assign) BOOL liked;

- (id)initWithTitle:(NSString *)title description:(NSString *)description asset:(NSString *)asset params:(NSString *)params;

@end
