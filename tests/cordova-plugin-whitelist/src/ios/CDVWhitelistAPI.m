/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import <Cordova/CDV.h>
#import "CDVWhitelistAPI.h"

@implementation CDVWhitelistAPI

- (void)URLMatchesPatterns:(CDVInvokedUrlCommand*)command
{
    NSString *url = [command argumentAtIndex:0];
    NSArray *allowedHosts = [command argumentAtIndex:1];

    CDVWhitelist* whitelist = [[CDVWhitelist alloc] initWithArray:allowedHosts];

    bool isAllowed = [whitelist URLIsAllowed:[NSURL URLWithString:url]];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isAllowed];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)URLIsAllowed:(CDVInvokedUrlCommand*)command
{
    NSString *url = [command argumentAtIndex:0];

    CDVWhitelist* whitelist = [(CDVViewController *)self.viewController whitelist];

    bool isAllowed = [whitelist URLIsAllowed:[NSURL URLWithString:url]];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsBool:isAllowed];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

@end
