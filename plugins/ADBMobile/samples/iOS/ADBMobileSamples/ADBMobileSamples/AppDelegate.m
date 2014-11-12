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

#import "AppDelegate.h"
#import "ADBMobile.h"

@implementation AppDelegate

- (BOOL) application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    // Override point for customization after application launch.
	if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
	    UISplitViewController *splitViewController = (UISplitViewController *)self.window.rootViewController;
	    UINavigationController *navigationController = [splitViewController.viewControllers lastObject];
	    splitViewController.delegate = (id)navigationController.topViewController;
	}
	
	/*
	 * Adobe Tracking - Analytics
	 *
	 * turn on debug logging for the ADBMobile SDK
	 */
	[ADBMobile setDebugLogging:YES];
		
	_storyboard = [UIStoryboard storyboardWithName: self.storyboardName bundle: nil];
	
	self.locationManager = [[CLLocationManager alloc] init];
	[_locationManager setDelegate: self];
	[_locationManager setDesiredAccuracy: kCLLocationAccuracyBest];
	[_locationManager setPausesLocationUpdatesAutomatically: NO];
	[_locationManager startUpdatingLocation];
	
    return YES;
}

- (NSString *) storyboardName {
    return UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone ? kPhoneStoryboard : kPadStoryboard;
}

- (void) locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations {
	CLLocation *currentLocation = [locations lastObject];
	if (currentLocation.horizontalAccuracy <= 100 && currentLocation.verticalAccuracy <= 100) {
		[_locationManager stopUpdatingLocation];
		[self trackCurrentLocation: currentLocation];
	}
}

- (void) trackCurrentLocation:(CLLocation *)location {
	static dispatch_once_t onceToken;
	dispatch_once(&onceToken, ^{
		/*
		 * Adobe Tracking - Analytics
		 *
		 * trackLocation:data: call to get the location of the current user
		 * because the config file has points of interest in it, the SDK will automatically determine
		 * whether the user falls within a point of interest
		 */
		[ADBMobile trackLocation: location data: nil];
	});
}

@end
