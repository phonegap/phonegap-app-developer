//
//  CDVPhoneGapBuildOauth.m
//  PhoneGap
//
//  Created by Ryan Willoughby on 2014-08-06.
//
//

#import "CDVPhonegapBuildOauth.h"

@implementation CDVPhonegapBuildOauth

NSString* CLIENT_ID;
NSString* CLIENT_SECRET;
NSString* HOSTNAME = @"https://build.phonegap.com";

NSMutableData *responseData;
CDVPluginResult* pluginResult = nil;
CDVInvokedUrlCommand* cdvCommand;
NSString* state = nil;

- (void)login:(CDVInvokedUrlCommand*)command
{
    NSString* username = [command.arguments objectAtIndex:0];
    NSString* password = [command.arguments objectAtIndex:1];

    NSString* setting = @"pgb-client-id";
    if ([self settingForKey:setting]) {
        CLIENT_ID = [self settingForKey:setting];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"missing preference pgb-client-id"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:cdvCommand.callbackId];
    }
    setting = @"pgb-client-secret";
    if ([self settingForKey:setting]) {
        CLIENT_SECRET = [self settingForKey:setting];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:@"missing preference pgb-client-secret"];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:cdvCommand.callbackId];
    }
    
    cdvCommand = command;
    responseData = [NSMutableData data];
    
    NSString *post = [NSString stringWithFormat:@"%@:%@", username, password];
    NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    NSString *authValue = [NSString stringWithFormat:@"Basic %@", [postData base64Encoding]];
    
    state = @"token";
    [self sendPost:postData :[NSString stringWithFormat:@"%@/token", HOSTNAME] :authValue];

}

- (id)settingForKey:(NSString*)key
{
    return [self.commandDelegate.settings objectForKey:[key lowercaseString]];
}

- (void)authorize:(NSString *)token
{
    NSString *post = [NSString stringWithFormat:@"&client_id=%@&client_secret=%@&auth_token=%@",CLIENT_ID, CLIENT_SECRET, token];
    
    NSData *postData = [post dataUsingEncoding:NSASCIIStringEncoding allowLossyConversion:YES];
    
    state = @"authorize";
    [self sendPost:postData :[NSString stringWithFormat:@"%@/authorize", HOSTNAME] :nil];

}

-(void)sendPost:(NSData *)postData :(NSString *)url :(NSString *)authValue
{
    NSString *postLength = [NSString stringWithFormat:@"%d",[postData length]];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    
    [request setURL:[NSURL URLWithString:[NSString stringWithFormat:url]]];
    [request setHTTPMethod:@"POST"];
    [request setValue:postLength forHTTPHeaderField:@"Content-Length"];
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    [request setHTTPBody:postData];
    
    if (authValue != nil) {
        NSString *authValue = [NSString stringWithFormat:@"Basic %@", [postData base64Encoding]];
        [request setValue:authValue forHTTPHeaderField:@"Authorization"];
    }
    
    NSURLConnection *conn = [[NSURLConnection alloc]initWithRequest:request delegate:self];
    
    if(conn) {
        //NSLog(@"Connection Successful");
    } else {
        NSLog(@"Connection could not be made");
    }
}

// NSURLConnection delegate methods

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData*)data
{
    [responseData appendData:data];
}

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    NSLog(@"didFailWithError");
}

- (void) connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    NSHTTPURLResponse* httpResponse = (NSHTTPURLResponse*)response;
    long code = [httpResponse statusCode];
    NSLog(@"Response code (%@): %ld", state, code);
    
    if (code != 200) {
        NSMutableDictionary* results = [NSMutableDictionary dictionaryWithCapacity:1];
        [results setValue:[NSString stringWithFormat:@"%ld", code] forKey:@"code"];
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsDictionary:results];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:cdvCommand.callbackId];
    }
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSData *data = [NSData dataWithData:responseData];

    NSError *error = nil;
    NSDictionary *results = [NSJSONSerialization
                             JSONObjectWithData:data
                             options:0
                             error:&error];
    
    responseData = [NSMutableData data];
    
    if ([state isEqualToString:@"token"]) {
        
        NSString *token = [results objectForKey:@"token"];
        
        [self authorize:token];
        
    } else if ([state isEqualToString:@"authorize"]) {
        state = nil;
        
        CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:results];
        [result setKeepCallback:[NSNumber numberWithBool:YES]];
        
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:results];
        [self.commandDelegate sendPluginResult:pluginResult callbackId:cdvCommand.callbackId];
    }
}

@end
