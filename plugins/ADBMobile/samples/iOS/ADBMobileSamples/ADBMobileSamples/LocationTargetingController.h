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

#import <UIKit/UIKit.h>
#import <CoreLocation/CoreLocation.h>

@interface LocationTargetingController : UIViewController

@property (assign) IBOutlet UIView *backgroundView;
@property (assign) IBOutlet UITextView *textView;

@property (strong) CLLocation *seattle;
@property (strong) CLLocation *sanJose;
@property (strong) CLLocation *nyc;
@property (strong) CLLocation *dallas;
@property (strong) CLLocation *miami;

@end
