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

#import "SimpleTrackingController.h"
#import "ADBMobile.h"
#import <QuartzCore/QuartzCore.h>

@implementation SimpleTrackingController

- (void) viewDidLoad {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackState:data: for view states report
	 * trackState:data: increments the page view
	 */
	[ADBMobile trackState:@"Simple Tracking Example" data:nil];
	
	// make our black background rounded
	_blackBackground.layer.cornerRadius = 5;
	_blackBackground.layer.masksToBounds = YES;
}

- (IBAction) trackState {
	NSMutableDictionary *contextData = [NSMutableDictionary dictionary];
	[contextData setObject:@"Example State" forKey:@"page.name"];
	if (_txtUserName.text.length) {
		[contextData setObject:_txtUserName.text forKey:@"user.name"];
	}
				
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackState:data: for view states report
	 * trackState:data: increments the page view
	 */
	[ADBMobile trackState:@"Example State" data:contextData];
}

- (IBAction) trackAction {
	NSMutableDictionary *contextData = [NSMutableDictionary dictionary];
	[contextData setObject:@"Example State" forKey:@"page.name"];
	if (_txtUserName.text.length) {
		[contextData setObject:_txtUserName.text forKey:@"user.name"];
	}

	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackAction:data: indicating the trackAction button was pushed
	 * trackAction:data: does not increment page view
	 */
	[ADBMobile trackAction:@"trackAction:data: button pushed" data:contextData];
}

#pragma mark - UITextFieldDelegate Methods
- (BOOL) textFieldShouldReturn:(UITextField *)textField {
	[textField resignFirstResponder];
	return YES;
}

- (void) touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
	if ([_txtUserName isFirstResponder]) {
		[_txtUserName resignFirstResponder];
	}
}

@end
