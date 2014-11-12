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

#import "TimedActionController.h"
#import "ADBMobile.h"
#import <QuartzCore/QuartzCore.h>

@implementation TimedActionController

- (void) viewDidLoad {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * call to trackState:data: for view states report
	 * trackState:data: increments the page view
	 */
	[ADBMobile trackState:@"Timed Action Example" data:nil];

	// make our black background rounded
	_blackBackground.layer.cornerRadius = 5;
	_blackBackground.layer.masksToBounds = YES;
}

- (IBAction) startAction1 {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * start a timed action with name "action1" and no additional context data
	 * note: if you call trackTimedActionStart:data: for an action already running, it will overwrite the existing one
	 */
	[ADBMobile trackTimedActionStart:@"action1" data:nil];
}

- (IBAction) stopAction1 {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * stop a timed action with name "action1"
	 * in the logic: callback, you can manipulate your context data as the NSMutableDictionary data object
	 * you must return YES if you want the SDK to send a hit for this timed action, or NO to suppress the hit
	 */
	[ADBMobile trackTimedActionEnd:@"action1" logic:^BOOL(NSTimeInterval inAppDuration, NSTimeInterval totalDuration, NSMutableDictionary *data) {
		_lblAction1InApp.text = [NSString stringWithFormat:@"%.0f second(s)", inAppDuration];
		_lblAction1Total.text = [NSString stringWithFormat:@"%.0f second(s)", totalDuration];
		
		return YES;
	}];
}

- (IBAction) startAction2 {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * start a timed action with name "action2" and no additional context data
	 * note: if you call trackTimedActionStart:data: for an action already running, it will overwrite the existing one
	 */
	[ADBMobile trackTimedActionStart:@"action2" data:nil];
}

- (IBAction) stopAction2 {
	/*
	 * Adobe Tracking - Analytics
	 *
	 * stop a timed action with name "action2"
	 * in the logic: callback, you can manipulate your context data as the NSMutableDictionary data object
	 * you must return YES if you want the SDK to send a hit for this timed action, or NO to suppress the hit
	 */
	[ADBMobile trackTimedActionEnd:@"action2" logic:^BOOL(NSTimeInterval inAppDuration, NSTimeInterval totalDuration, NSMutableDictionary *data) {
		_lblAction2InApp.text = [NSString stringWithFormat:@"%.0f second(s)", inAppDuration];
		_lblAction2Total.text = [NSString stringWithFormat:@"%.0f second(s)", totalDuration];
		
		return YES;
	}];
}

@end
