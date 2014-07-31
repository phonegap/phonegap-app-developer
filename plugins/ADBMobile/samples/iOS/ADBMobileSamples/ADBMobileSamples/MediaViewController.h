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

@interface MediaViewController : UIViewController

@property (assign) IBOutlet UIView *blackBackground;
@property (weak, nonatomic) IBOutlet UISwitch *swTrackMilestones;
@property (weak, nonatomic) IBOutlet UISwitch *swSegmentByMilestones;
@property (weak, nonatomic) IBOutlet UISwitch *swTrackOffsetMilestones;
@property (weak, nonatomic) IBOutlet UISwitch *swSegmentByOffsetMilestones;
@property (weak, nonatomic) IBOutlet UISwitch *swTrackSeconds;

@end
