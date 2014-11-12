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

#import "MasterViewController.h"
#import <QuartzCore/QuartzCore.h>
#import "ADBMobile.h"

@implementation MasterViewController

- (void) viewDidLoad {
    [super viewDidLoad];
	
	// make our black background rounded
	_blackBackground.layer.cornerRadius = 5;
	_blackBackground.layer.masksToBounds = YES;
	
	self.title = @"Menu";
}

- (void) viewDidAppear:(BOOL)animated {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackState:data: for view states report
	 * trackState:data: increments the page view
	 */
	[ADBMobile trackState:@"Menu View" data:nil];
}

@end
