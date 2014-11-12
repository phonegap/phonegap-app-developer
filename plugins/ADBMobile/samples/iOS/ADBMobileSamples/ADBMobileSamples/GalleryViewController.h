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

@class GalleryItem, ADBS7ImageView, AppDelegate;

@interface GalleryViewController : UIViewController <UIGestureRecognizerDelegate>

@property (weak) AppDelegate *appDelegate;

@property (strong) NSMutableArray *galleryItems;

@property (nonatomic, strong) GalleryItem *galleryItem;

@property (weak) IBOutlet ADBS7ImageView *imgGallery;

@property (weak) IBOutlet UIImageView *imgBanner;
@property (weak) NSString *webURL;

@property (weak) IBOutlet UIView *viewProgressBackground;
@property (weak) IBOutlet UILabel *lblProgress;

@property (weak) IBOutlet UIView *viewInfoBackground;
@property (weak) IBOutlet UILabel *lblInfo;

@property (weak) IBOutlet UISwipeGestureRecognizer *swipeLeftRecognizer;
@property (weak) IBOutlet UISwipeGestureRecognizer *swipeRightRecognizer;
@property (weak) IBOutlet UITapGestureRecognizer *tapRecognizer;

@property NSInteger currentIndex;

@property BOOL infoVisible;

@end
