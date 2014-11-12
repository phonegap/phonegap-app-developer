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
#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface ADBMobile_PhoneGap : CDVPlugin

- (void)getVersion:(CDVInvokedUrlCommand*)command;
- (void)getPrivacyStatus:(CDVInvokedUrlCommand*)command;
- (void)setPrivacyStatus:(CDVInvokedUrlCommand*)command;
- (void)getLifetimeValue:(CDVInvokedUrlCommand*)command;
- (void)getUserIdentifier:(CDVInvokedUrlCommand*)command;
- (void)setUserIdentifier:(CDVInvokedUrlCommand*)command;
- (void)getDebugLogging:(CDVInvokedUrlCommand*)command;
- (void)setDebugLogging:(CDVInvokedUrlCommand*)command;
- (void)keepLifecycleSessionAlive:(CDVInvokedUrlCommand*)command;
- (void)collectLifecycleData:(CDVInvokedUrlCommand*)command;
- (void)trackState:(CDVInvokedUrlCommand*)command;
- (void)trackAction:(CDVInvokedUrlCommand*)command;
- (void)trackActionFromBackground:(CDVInvokedUrlCommand*)command;
- (void)trackLocation:(CDVInvokedUrlCommand*)command;
- (void)trackLifetimeValueIncrease:(CDVInvokedUrlCommand*)command;
- (void)trackTimedActionStart:(CDVInvokedUrlCommand*)command;
- (void)trackTimedActionUpdate:(CDVInvokedUrlCommand*)command;
- (void)trackingTimedActionExists:(CDVInvokedUrlCommand*)command;
- (void)trackTimedActionEnd:(CDVInvokedUrlCommand*)command;
- (void)trackingIdentifier:(CDVInvokedUrlCommand*)command;
- (void)trackingClearQueue:(CDVInvokedUrlCommand*)command;
- (void)trackingGetQueueSize:(CDVInvokedUrlCommand*)command;

- (void)targetLoadRequest:(CDVInvokedUrlCommand*)command;
- (void)targetLoadOrderConfirmRequest:(CDVInvokedUrlCommand*)command;
@end
