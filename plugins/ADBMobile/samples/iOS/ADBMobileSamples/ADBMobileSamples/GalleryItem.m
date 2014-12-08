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

#import "GalleryItem.h"

@implementation GalleryItem

- (id)initWithTitle:(NSString *)title description:(NSString *)description asset:(NSString *)asset params:(NSString *)params{
	self = [super init];
	if (self){
		self.title = title;
		self.theDescription = description;
		self.assetName = asset;
        self.s7params = params;
		
		self.liked = [[NSUserDefaults standardUserDefaults] boolForKey:self.title];
	}
	return self;
}

- (void)setLiked:(BOOL)liked{
	_liked = liked;
	[[NSUserDefaults standardUserDefaults] setBool:liked forKey:self.title];
}

@end
