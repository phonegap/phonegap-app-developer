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

#import "NSString+Color.h"

@implementation NSString (Color)

// returns a UIColor given rgb in ###### format
- (UIColor *)color {
	unsigned value = 0;
	
	NSScanner *scanner = [NSScanner scannerWithString: self];
	
	if([self hasPrefix: @"#"]) {
		[scanner setScanLocation: 1];
	}

	if(![scanner scanHexInt: &value]) {
		return [UIColor whiteColor];
	}

	float red = ((float)((value & 0xFF0000) >> 16))/255.0f;
	float green = ((float)((value & 0xFF00) >> 8))/255.0f;
	float blue = ((float)(value & 0xFF))/255.0f;
	
	return [UIColor colorWithRed: red green: green blue: blue alpha: 1.0f];
}

@end
