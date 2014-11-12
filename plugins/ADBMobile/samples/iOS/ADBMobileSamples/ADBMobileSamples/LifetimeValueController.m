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

#import "LifetimeValueController.h"
#import "ADBMobile.h"
#import <QuartzCore/QuartzCore.h>

@implementation LifetimeValueController

- (void) viewDidLoad {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackState:data: for view states report
	 * trackState:data: increments the page view
	 */
	[ADBMobile trackState:@"Lifetime Value" data:nil];
	
	// make our black background rounded
	_backgroundView.layer.cornerRadius = 5;
	_backgroundView.layer.masksToBounds = YES;
}

- (IBAction) linkClicked {
	NSDictionary *cData = @{@"Success Event":@"Link Clicked"};
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	 * we are attributing clicking a link to a value of 3.5
	 */
	[ADBMobile trackLifetimeValueIncrease:[NSDecimalNumber decimalNumberWithString:@"3.5"] data:cData];
	
	[self updateLifetimeValue];
}

- (IBAction) purchaseMade {
	NSDictionary *cData = @{@"Success Event":@"Purchase"};
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	 * we are attributing a purchase to a value of 10.0
	 */
	[ADBMobile trackLifetimeValueIncrease:[NSDecimalNumber decimalNumberWithString:@"10.0"] data:cData];
	
	[self updateLifetimeValue];
}

- (IBAction) mediaUploaded {
	NSDictionary *cData = @{@"Success Event":@"Media Uploaded"};
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	 * we are attributing uploading media to a value of 5.0
	 */
	[ADBMobile trackLifetimeValueIncrease:[NSDecimalNumber decimalNumberWithString:@"5.0"] data:cData];
	
	[self updateLifetimeValue];
}

- (IBAction) mediaViewed {
	NSDictionary *cData = @{@"Success Event":@"Media Viewed"};
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	 * we are attributing viewing media to a value of 7.0
	 */
	[ADBMobile trackLifetimeValueIncrease:[NSDecimalNumber decimalNumberWithString:@"7.0"] data:cData];
	
	[self updateLifetimeValue];
}

- (IBAction) socialEngagement {
	NSDictionary *cData = @{@"Success Event":@"Social Engagement"};
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackLifetimeValueIncrease:data: to increase user's lifetime value
	 * we are attributing a social engagement to a value of 9.0
	 */
	[ADBMobile trackLifetimeValueIncrease:[NSDecimalNumber decimalNumberWithString:@"9.0"] data:cData];
	
	[self updateLifetimeValue];
}

- (void) updateLifetimeValue {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to lifetimeValue returns users current lifetime value
	 */
	_lblLifetimeValue.text = [NSString stringWithFormat:@"%@", [ADBMobile lifetimeValue]];
}

@end
