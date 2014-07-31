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

#import <CoreLocation/CoreLocation.h>
#import "ADBMobile_PhoneGap.h"
#import "ADBMobile.h"

@implementation ADBMobile_PhoneGap

- (void)getVersion:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;

		NSString *version = [ADBMobile version];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:version];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)getPrivacyStatus:(CDVInvokedUrlCommand*)command; {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		int privacyStatus = [ADBMobile privacyStatus];
		switch (privacyStatus) {
			case ADBMobilePrivacyStatusOptIn:
				pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Opted In"];
				break;
			case ADBMobilePrivacyStatusOptOut:
				pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Opted Out"];
				break;
			case ADBMobilePrivacyStatusUnknown:
				pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Opt Unknown"];
				break;
			default:
				pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_NO_RESULT messageAsString:@"Privacy Status was an unknown value"];
				break;
		}

		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)setPrivacyStatus:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString *privacyStatusString = [command.arguments objectAtIndex:0];
		
		// if a privacyStatus was not passed in, return
		if (privacyStatusString == (id)[NSNull null]) {
			return;
		}

		int privacyStatus = [privacyStatusString intValue];
		
		
		if (privacyStatus >= 0 && privacyStatus <= 3) {
			[ADBMobile setPrivacyStatus:privacyStatus];
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Set Opt Status"];
		} else {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Privacy Status was an unknown value"];
		}
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)getLifetimeValue:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		double lifetimeValue = [[ADBMobile lifetimeValue] doubleValue];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDouble:lifetimeValue];
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)getUserIdentifier:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		NSString *userIdentifier = [ADBMobile userIdentifier];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:userIdentifier];

		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)setUserIdentifier:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* userIdentifier = [command.arguments objectAtIndex:0];

		// if a userIdentifier was not passed in, return
		if (userIdentifier == (id)[NSNull null]) {
			return;
		}

		if (userIdentifier != nil) {
			[ADBMobile setUserIdentifier:userIdentifier];
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		} else {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"User Identifier was null"];
		}
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)getDebugLogging:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		BOOL debugLogging = [ADBMobile debugLogging];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:debugLogging];
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)setDebugLogging:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString *privacyStatusString = [command.arguments objectAtIndex:0];

		// if a privacyStatus was not passed in, return
		if (privacyStatusString == (id)[NSNull null]) {
			return;
		}

		BOOL debugLogging = [privacyStatusString boolValue];
		
		[ADBMobile setDebugLogging:debugLogging];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Set DebugLogging"];
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)keepLifecycleSessionAlive:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		[ADBMobile keepLifecycleSessionAlive];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Keeping lifecycle session alive"];
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)collectLifecycleData:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		[ADBMobile collectLifecycleData];

		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Collecting Lifecycle"];
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackState:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* appState = nil;
		NSDictionary *cData = nil;
		
		// set appState if passed in
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			appState = [command.arguments objectAtIndex:0];
		} // else set cData if it is passed in alone
		else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:0];
		}
		
		// set cData if it is passed in along with appState
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}
		
		[ADBMobile trackState:appState data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackAction:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = nil;
		NSDictionary *cData = nil;
		
		// set action if passed in
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			action = [command.arguments objectAtIndex:0];
		} // else set cData if it is passed in alone
		else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:0];
		}
		
		// set cData if it is passed in along with action
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}

		[ADBMobile trackAction:action data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackActionFromBackground:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = nil;
		NSDictionary *cData = nil;
		
		// set action if passed in
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			action = [command.arguments objectAtIndex:0];
		} // else set cData if it is passed in alone
		else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:0];
		}
		
		// set cData if it is passed in along with action
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}
		
		[ADBMobile trackActionFromBackground:action data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackLocation:(CDVInvokedUrlCommand *)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;

		double latitude = 0;
		double longitude = 0;
		NSDictionary *cData = nil;
		
		if (([[command.arguments objectAtIndex: 0] isKindOfClass:[NSString class]]
				&& [[command.arguments objectAtIndex: 1] isKindOfClass:[NSString class]])
			|| ([[command.arguments objectAtIndex: 0] isKindOfClass:[NSNumber class]]
				&& [[command.arguments objectAtIndex: 1] isKindOfClass:[NSNumber class]])) {
			latitude = [[command.arguments objectAtIndex: 0] doubleValue];
			longitude = [[command.arguments objectAtIndex: 1] doubleValue];
		}
		else {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
			return;
		}
		
		if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:2];
		}

		if(NSClassFromString(@"CLLocation")) {
			id location = [[NSClassFromString(@"CLLocation") alloc] initWithLatitude: latitude longitude: longitude];
			
			[ADBMobile trackLocation:location data:cData];
			
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		} else {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR ];
		}
	}];
}

- (void)trackLifetimeValueIncrease:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSDictionary *cData = nil;
		NSDecimalNumber* amount;
		// if an ammount was not passed in, return
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			amount = [NSDecimalNumber decimalNumberWithString:[command.arguments objectAtIndex:0]];
		} else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSNumber class]]) {
			amount = [NSDecimalNumber decimalNumberWithDecimal:[[command.arguments objectAtIndex:0] decimalValue]];
		} else {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
			return;
		}
		
		// set cData if it is passed in along with action
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}
		
		[ADBMobile trackLifetimeValueIncrease:amount data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackTimedActionStart:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = nil;
		NSDictionary *cData = nil;
		
		// set action if passed in
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			action = [command.arguments objectAtIndex:0];
		} // else set cData if it is passed in alone
		else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:0];
		}
		
		// set cData if it is passed in along with action
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}

		[ADBMobile trackTimedActionStart:action data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackTimedActionUpdate:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = nil;
		NSDictionary *cData = nil;
		
		// set action if passed in
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			action = [command.arguments objectAtIndex:0];
		} // else set cData if it is passed in alone
		else if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:0];
		}
		
		// set cData if it is passed in along with action
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSDictionary class]]) {
			cData = [command.arguments objectAtIndex:1];
		}

		[ADBMobile trackTimedActionUpdate:action data:cData];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackingTimedActionExists:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = [command.arguments objectAtIndex:0];
		
		// if an action was not passed in, return
		if (action == (id)[NSNull null]) {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"Action was null"];
		} else {
			BOOL exists = [ADBMobile trackingTimedActionExists:action];
			
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:exists];
		}
		
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackTimedActionEnd:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		NSString* action = [command.arguments objectAtIndex:0];

		// if an action was not passed in, return
		if (action == (id)[NSNull null]) {
			return;
		}
		
		[ADBMobile trackTimedActionEnd:action logic:nil];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackingIdentifier:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		NSString *trackingIdentifier = [ADBMobile trackingIdentifier];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:trackingIdentifier];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackingClearQueue:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		[ADBMobile trackingClearQueue];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

- (void)trackingGetQueueSize:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		CDVPluginResult* pluginResult = nil;
		
		NSUInteger size = [ADBMobile trackingGetQueueSize];
		
		pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsInt:size];
		[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
	}];
}

#pragma mark - Target
- (void)targetLoadRequest:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		__block CDVPluginResult* pluginResult = nil;
		NSString* name = nil;
		NSString* defaultContent = nil;
		NSDictionary *parameters = nil;
		
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			name = [command.arguments objectAtIndex:0];
		}
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSString class]]) {
			defaultContent = [command.arguments objectAtIndex:1];
		}
		// set parameters if it is passed in
		if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSDictionary class]]) {
			parameters = [command.arguments objectAtIndex:2];
		}
		
		ADBTargetLocationRequest *request = [ADBMobile targetCreateRequestWithName:name defaultContent:defaultContent parameters:parameters];

		[ADBMobile targetLoadRequest:request callback:^(NSString *content) {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:content];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		}];
	}];
}

- (void)targetLoadOrderConfirmRequest:(CDVInvokedUrlCommand*)command {
	[self.commandDelegate runInBackground:^{
		__block CDVPluginResult* pluginResult = nil;
		NSString* name = nil;
		NSString* orderId = nil;
		NSString* orderTotal = nil;
		NSString* productPurchaseId = nil;
		NSDictionary *parameters = nil;
		
		if ([[command.arguments objectAtIndex:0] isKindOfClass:[NSString class]]) {
			name = [command.arguments objectAtIndex:0];
		}
		if ([[command.arguments objectAtIndex:1] isKindOfClass:[NSString class]]) {
			orderId = [command.arguments objectAtIndex:1];
		}
		if ([[command.arguments objectAtIndex:2] isKindOfClass:[NSString class]] || [[command.arguments objectAtIndex:2] isKindOfClass:[NSNumber class]]) {
			orderTotal = [command.arguments objectAtIndex:2];
		}
		if ([[command.arguments objectAtIndex:3] isKindOfClass:[NSString class]]) {
			productPurchaseId = [command.arguments objectAtIndex:3];
		}		
		// set parameters if it is passed in
		if ([[command.arguments objectAtIndex:4] isKindOfClass:[NSDictionary class]]) {
			parameters = [command.arguments objectAtIndex:4];
		}
		
		ADBTargetLocationRequest *request = [ADBMobile targetCreateOrderConfirmRequestWithName:name orderId:orderId orderTotal:orderTotal productPurchasedId:productPurchaseId parameters:parameters];
		
		[ADBMobile targetLoadRequest:request callback:^(NSString *content) {
			pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:content];
			[self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
		}];
	}];
}

@end
