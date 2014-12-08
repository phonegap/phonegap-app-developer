//
//  ADBMobile.h
//  Adobe Digital Marketing Suite -- iOS Application Measurement Library
//
//  Copyright 1996-2013. Adobe, Inc. All Rights Reserved

#import <Foundation/Foundation.h>
@class CLLocation, CLBeacon, ADBTargetLocationRequest, ADBMediaSettings, ADBMediaState;

#pragma mark - ADBMobile

/**
 * 	@brief An enum type.
 *  The possible privacy statuses.
 *  @see privacyStatus
 *  @see setPrivacyStatus
 */
typedef NS_ENUM(NSUInteger, ADBMobilePrivacyStatus) {
    ADBMobilePrivacyStatusOptIn   = 1, /*!< Enum value ADBMobilePrivacyStatusOptIn. */
    ADBMobilePrivacyStatusOptOut  = 2, /*!< Enum value ADBMobilePrivacyStatusOptOut. */
    ADBMobilePrivacyStatusUnknown = 3  /*!< Enum value ADBMobilePrivacyStatusUnknown. @note only available in conjunction with offline tracking */
};

/**
 * 	@class ADBMobile
 *  This class is used for all interaction with the Adobe Mobile Services.
 */
@interface ADBMobile : NSObject {}

#pragma mark - Configuration

/**
 * 	@brief Gets the version.
 *  @return a string pointer containing the version value.
 */
+ (NSString *) version;

/**
 * 	@brief Gets the privacy status.
 *  @return an ADBMobilePrivacyStatus enum value of the privacy status.
 *  @see ADBMobilePrivacyStatus
 */
+ (ADBMobilePrivacyStatus) privacyStatus;

/**
 * 	@brief Sets the privacy status.
 *  @param status an ADBMobilePrivacyStatus enum value of the privacy status.
 *  @see ADBMobilePrivacyStatus
 */
+ (void) setPrivacyStatus:(ADBMobilePrivacyStatus)status;

/**
 * 	@brief Gets user's current lifetime value
 *  @return a NSDecimalNumber pointer to the current user's value.
 */
+ (NSDecimalNumber *) lifetimeValue;

/**
 * 	@brief Gets the user identifier.
 *  @return a string pointer containing the user identifier value.
 */
+ (NSString *) userIdentifier;

/**
 * 	@brief Sets the user identifier.
 *  @param identifier a string pointer containing the user identifier value.
 */
+ (void) setUserIdentifier:(NSString *)identifier;

/**
 * 	@brief Gets the preference for debug log output.
 *  @return a bool value indicating the preference for debug log output.
 */
+ (BOOL) debugLogging;

/**
 * 	@brief Sets the preference of debug log output.
 *  @param debug a bool value indicating the preference for debug log output.
 */
+ (void) setDebugLogging:(BOOL)debug;

/**
 * 	@brief Sets the preference of lifecycle session keep alive.
 *  @note Calling keepLifecycleSessionAlive will prevent your app from launching a new session the next time it is resumed from background
 *  @note Only use this if your app registers for notifications in the background
 */
+ (void) keepLifecycleSessionAlive;

/**
 * 	@brief Begins the collection of lifecycle data.
 *  @note This should be the first method called upon app launch.
 */
+ (void) collectLifecycleData;

/**
 *	@brief allows one-time override of the path for the json config file
 *	@note This *must* be called prior to AppDidFinishLaunching has completed and before any other interactions with the Adobe Mobile library have happened.  
 *		Only the first call to this function will have any effect.
 */
+ (void) overrideConfigPath: (NSString *) path;

#pragma mark - Analytics

/**
 * 	@brief Tracks a state with context data.
 * 	@param state a string pointer containing the state value to be tracked.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method increments page views.
 */
+ (void) trackState:(NSString *)state data:(NSDictionary *)data;

/**
 * 	@brief Tracks an action with context data.
 * 	@param action a string pointer containing the action value to be tracked.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method does not increment page views.
 */
+ (void) trackAction:(NSString *)action data:(NSDictionary *)data;

/**
 * 	@brief Tracks an action with context data.
 * 	@param action a string pointer containing the action value to be tracked.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method does not increment page views. 
 *  @note This method is intended to be called while your app is in the background(it will not cause lifecycle data to send if the session timeout has been exceeded)
 */
+ (void) trackActionFromBackground:(NSString *)action data:(NSDictionary *)data;

/**
 * 	@brief Tracks a location with context data.
 * 	@param location a CLLocation pointer containing the location information to be tracked.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method does not increment page views.
 */
+ (void) trackLocation:(CLLocation *)location data:(NSDictionary *)data;

/**
 * 	@brief Tracks a beacon with context data.
 * 	@param beacon a CLBeacon pointer containing the beacon information to be tracked.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method does not increment page views.
 */
+ (void) trackBeacon:(CLBeacon *)beacon data:(NSDictionary *)data;

/**
 * 	@brief Clears beacon data persisted for Target
 */
+ (void) trackingClearCurrentBeacon;

/**
 * 	@brief Tracks an increase in a user's lifetime value.
 * 	@param amount a positive NSDecimalNumber detailing the amount to increase lifetime value by.
 * 	@param data a dictionary pointer containing the context data to be tracked.
 *  @note This method does not increment page views.
 */
+ (void) trackLifetimeValueIncrease:(NSDecimalNumber *)amount data:(NSDictionary *)data;

/**
 * 	@brief Tracks the start of a timed event
 *  @param action a required NSString value that denotes the action name to track.
 *  @param data optional dictionary pointer containing context data to track with this timed action.
 *  @note This method does not send a tracking hit
 *  @attention If an action with the same name already exists it will be deleted and a new one will replace it.
 */
+ (void) trackTimedActionStart:(NSString *)action data:(NSDictionary *)data;

/**
 * 	@brief Tracks the start of a timed event
 *  @param action a required NSString value that denotes the action name to track.
 *  @param data optional dictionary pointer containing context data to track with this timed action.
 *  @note This method does not send a tracking hit
 *  @attention When the timed event is updated the contents of the parameter data will overwrite existing context data keys and append new ones.
 */
+ (void) trackTimedActionUpdate:(NSString *)action data:(NSDictionary *)data;

/**
 * 	@brief Tracks the end of a timed event
 *  @param action a required NSString pointer that denotes the action name to finish tracking.
 * 	@param logic optional block to perform logic and update parameters when this timed event ends, this block can cancel the sending of the hit by returning NO.
 *  @note This method will send a tracking hit if the parameter logic is nil or returns YES.
 */
+ (void) trackTimedActionEnd:(NSString *)action
					   logic:(BOOL (^)(NSTimeInterval inAppDuration, NSTimeInterval totalDuration, NSMutableDictionary *data))block;

/**
 * 	@brief Returns whether or not a timed action is in progress
 *  @return a bool value indicating the existence of the given timed action
 */
+ (BOOL) trackingTimedActionExists:(NSString *)action;

/**
 *	@brief Retrieves the analytics tracking identifier
 *	@return an NSString value containing the tracking identifier
 */
+ (NSString *) trackingIdentifier;

/**
 *	@brief Force library to send all queued hits regardless of current batch options
 */
+ (void) trackingSendQueuedHits;

/**
 *	@brief Clears any hits out of the tracking queue and removes them from the database
 */
+ (void) trackingClearQueue;

/**
 *	@brief Retrieves the number of hits currently in the tracking queue
 *	@return an NSUInteger indicating the size of the queue
 */
+ (NSUInteger) trackingGetQueueSize;


#pragma mark - Media Analytics

/**
 * 	@brief Creates an ADBMediaSettings populated with the parameters.
 *  @param name name of media item.
 *  @param length length of media (in seconds).
 * 	@param playerName name of media player.
 * 	@param playerID ID of media player.
 *  @return An ADBMediaSettings pointer.
 */
+ (ADBMediaSettings *) mediaCreateSettingsWithName:(NSString *)name
                                            length:(double)length
                                        playerName:(NSString *)playerName
                                          playerID:(NSString *)playerID;

/**
 * 	@brief Creates an ADBMediaSettings populated with the parameters.
 *  @param name name of media item.
 *  @param length length of media (in seconds).
 * 	@param parentName name of the ads parent video.
 * 	@param pod of the media item that the media ad is playing in.
 * 	@param parentPodPosition position of parent pod (in seconds).
 * 	@param CPM .
 *  @return An ADBMediaSettings pointer.
 */
+ (ADBMediaSettings *) mediaAdCreateSettingsWithName:(NSString *)name
											  length:(double)length
										  playerName:(NSString *)playerName
                                          parentName:(NSString *)parentName
                                           parentPod:(NSString *)parentPod
								   parentPodPosition:(double)parentPodPosition
												 CPM:(NSString *)CPM;

/**
 * 	@brief Opens a media item for tracking.
 *  @param settings a pointer to the configured ADBMediaSettings
 *  @param callback a block pointer to call with an ADBMediaState pointer every second.
 */
+ (void) mediaOpenWithSettings:(ADBMediaSettings *)settings
                      callback:(void (^)(ADBMediaState *mediaState))callback;

/**
 * 	@brief Closes a media item.
 *  @param name name of media item.
 */
+ (void) mediaClose:(NSString *)name;

/**
 * 	@brief Begins tracking a media item.
 *  @param name name of media item.
 *	@param offset point that the media items is being played from (in seconds)
 */
+ (void) mediaPlay:(NSString *)name offset:(double)offset;

/**
 * 	@brief Artificially completes a media item.
 *  @param name name of media item.
 *	@param offset point that the media items is when complete is called (in seconds)
 */
+ (void) mediaComplete:(NSString *)name offset:(double)offset;

/**
 * 	@brief Notifies the media module that the media item has been paused or stopped
 *	@param name name of media item.
 *	@param offset point that the media item was stopped (in seconds)
 */
+ (void) mediaStop:(NSString *)name offset:(double)offset;

/**
 * 	@brief Notifies the media module that the media item has been clicked
 *	@param name name of media item.
 *	@param offset point that the media item was clicked (in seconds)
 */
+ (void) mediaClick:(NSString *)name offset:(double)offset;

/**
 *	@brief Sends a track event with the current media state
 *
 *	@param name name of media item.
 *  @param data optional dictionary pointer containing context data to track with this media action.
 */
+ (void) mediaTrack:(NSString *)name data:(NSDictionary *)data;

#pragma mark - Target

/**
 * 	@brief Processes a Target service request.
 * 	@param request a ADBTargetLocationRequest pointer.
 * 	@param callback a block pointer to call with a response string pointer parameter upon completion of the service request.
 */
+ (void) targetLoadRequest:(ADBTargetLocationRequest *)request callback:(void (^)(NSString *content))callback;

/**
 * 	@brief Creates a ADBTargetLocationRequest populated with the parameters.
 * 	@param name a string pointer.
 * 	@param defaultContent a string pointer.
 *  @param parameters a dictionary of key-value pairs that will be added to the request.
 *  @return A ADBTargetLocationRequest pointer.
 *  @see targetLoadRequest:callback: for processing the returned ADBTargetLocationRequest pointer.
 */
+ (ADBTargetLocationRequest *) targetCreateRequestWithName:(NSString *)name
											defaultContent:(NSString *)defaultContent
												parameters:(NSDictionary *)parameters;

/**
 * 	@brief Creates a ADBTargetLocationRequest populated with the parameters.
 * 	@param name a string pointer containing the value of the order name.
 * 	@param orderId a string pointer containing the value of the order id.
 * 	@param orderTotal a string pointer containing the value of the order total.
 * 	@param productPurchaseId a string pointer containing the value of the product purchased id.
 *  @param parameters a dictionary of key-value pairs that will be added to the request.
 *  @return A ADBTargetLocationRequest pointer.
 *  @see targetLoadRequest:callback: for processing the returned ADBTargetLocationRequest pointer.
 */
+ (ADBTargetLocationRequest *) targetCreateOrderConfirmRequestWithName:(NSString *)name
															   orderId:(NSString *)orderId
															orderTotal:(NSString *)orderTotal
													productPurchasedId:(NSString *)productPurchasedId
															parameters:(NSDictionary *)parameters;

/**
 * 	@brief Clears target cookies from shared cookie storage
 */
+ (void) targetClearCookies;

#pragma mark - Audience Manager

/**
 * 	@brief Gets the visitor's profile.
 *  @return A dictionary pointer containing the visitor's profile information.
 */
+ (NSDictionary *) audienceVisitorProfile;

/**
 * 	@brief Gets the DPID.
 *  @return A string pointer containing the DPID value.
 */
+ (NSString *) audienceDpid;

/**
 * 	@brief Gets the DPUUID.
 *  @return A string pointer containing the DPUUID value.
 */
+ (NSString *) audienceDpuuid;

/**
 * 	@brief Sets the DPID and DPUUID.
 *  @param dpid a string pointer containing the DPID value.
 * 	@param dpuuid a string pointer containing the DPUUID value.
 */
+ (void) audienceSetDpid:(NSString *)dpid dpuuid:(NSString *)dpuuid;

/**
 * 	@brief Processes an Audience Manager service request.
 * 	@param data a dictionary pointer.
 * 	@param callback a block pointer to call with a response dictionary pointer parameter upon completion of the service request.
 */
+ (void) audienceSignalWithData:(NSDictionary *)data callback:(void (^)(NSDictionary *response))callback;

/**
 * 	@brief Resets audience manager UUID and purges current visitor profile
 */
+ (void) audienceReset;

@end

#pragma mark - ADBTargetLocationRequest

/** @defgroup ADBTargetParameters
 *  These constant strings can be used as the keys for add common Target parameters to context data.
 *  Example: contextData[ADBTargetParameterOrderId] = @"12345";
 *  @{
 */
FOUNDATION_EXPORT NSString *const ADBTargetParameterOrderId;            ///< The key for an Order ID.
FOUNDATION_EXPORT NSString *const ADBTargetParameterOrderTotal;         ///< The key for an Order Total.
FOUNDATION_EXPORT NSString *const ADBTargetParameterProductPurchasedId; ///< The key for a Product Purchased ID.
FOUNDATION_EXPORT NSString *const ADBTargetParameterCategoryId;         ///< The key for a Category ID.
FOUNDATION_EXPORT NSString *const ADBTargetParameterMbox3rdPartyId;     ///< The key for an Mbox 3rd Party ID.
FOUNDATION_EXPORT NSString *const ADBTargetParameterMboxPageValue;      ///< The key for an Mbox Page Value.
FOUNDATION_EXPORT NSString *const ADBTargetParameterMboxPc;             ///< The key for an Mbox PC.
FOUNDATION_EXPORT NSString *const ADBTargetParameterMboxSessionId;      ///< The key for an Mbox Session ID.
FOUNDATION_EXPORT NSString *const ADBTargetParameterMboxHost;           ///< The key for an Mbox Host.
/** @} */ // end of group ADBTargetParameters

/**
 * 	@class ADBTargetLocationRequest
 *  This class is used to interact with Adobe Target servers.
 */
@interface ADBTargetLocationRequest : NSObject

@property (nonatomic, strong) NSString *name;                   ///< The name of the target location.
@property (nonatomic, strong) NSString *defaultContent;         ///< The default content that should be returned if the request fails.
@property (nonatomic, strong) NSMutableDictionary *parameters;  ///< Optional. The parameters to be attached to the request.

@end

#pragma mark - ADBMediaSettings

/**
 * 	@class ADBMediaSettings
 *  This class represents the configuration of a media item.
 */
@interface ADBMediaSettings : NSObject

@property (readwrite) bool segmentByMilestones;                 ///< Indicates if segment info should be automatically generated for milestones generated or not, the default is NO.
@property (readwrite) bool segmentByOffsetMilestones;           ///< Indicates if segment info should be automatically generated for offset milestones or not, the default is NO.
@property (readwrite) double length;                            ///< The length of the media item in seconds.
@property (nonatomic, strong) NSString *channel;                ///< The name or ID of the channel.
@property (nonatomic, strong) NSString *name;                   ///< The name or ID of the media item.
@property (nonatomic, strong) NSString *playerName;             ///< The name of the media player.
@property (nonatomic, strong) NSString *playerID;               ///< The ID of the media player.
@property (nonatomic, strong) NSString *milestones;             ///< A comma-delimited list of intervals (as a percentage) for sending tracking data.
@property (nonatomic, strong) NSString *offsetMilestones;       ///< A comma-delimited list of intervals (in seconds) for sending tracking data.
@property (nonatomic) NSUInteger trackSeconds;                  ///< The interval at which tracking data should be sent, the default is 0.
@property (nonatomic) NSUInteger completeCloseOffsetThreshold;  ///< The number of second prior to the end of the media that it should be considered complete, the default is 1.

// Media Ad settings
@property (readwrite) bool isMediaAd;               ///< Indicates if the media item is an ad or not.
@property (readwrite) double parentPodPosition;     ///< The position within the pod where the ad is played.
@property (nonatomic, strong) NSString *CPM;        ///< The CMP or encrypted CPM (prefixed with a "~") for the media item.
@property (nonatomic, strong) NSString *parentName; ///< The name or ID of the media item that the ad is embedded in.
@property (nonatomic, strong) NSString *parentPod;  ///< The position in the primary content the ad was played.

@end

#pragma mark - ADBMediaState

/**
 * 	@class ADBMediaState
 *  This class represents the state of a media item.
 */
@interface ADBMediaState : NSObject

@property(readwrite) BOOL ad;                       ///< Indicates if the media item is an ad or not.
@property(readwrite) BOOL clicked;                  ///< Indicates if the media item has been clicked or not.
@property(readwrite) BOOL complete;                 ///< Indicates if media play is complete or not.
@property(readwrite) BOOL eventFirstTime;           ///< Indicates if this was the first time that this media event was called for this video.
@property(readwrite) double length;                 ///< The length of the media item in seconds.
@property(readwrite) double offset;                 ///< The current point in the media item in seconds.
@property(readwrite) double percent;                ///< The current point in the media item as a percentage.
@property(readwrite) double segmentLength;          ///< The length of the current segment.
@property(readwrite) double timePlayed;             ///< The total time played so far in seconds.
@property(readwrite) double timePlayedSinceTrack;   ///< The amount of time played since the last track event occurred in seconds.
@property(readwrite) double timestamp;              ///< The number of seconds since 1970 when this media state was created.
@property(readwrite, copy) NSDate *openTime;        ///< The date and time of when the media item was opened.
@property(readwrite, copy) NSString *name;          ///< The name or ID of the media item.
@property(readwrite, copy) NSString *playerName;    ///< The name or ID of the media player.
@property(readwrite, copy) NSString *mediaEvent;    ///< The name of the most recent media event.
@property(readwrite, copy) NSString *segment;       ///< The name of the current segment.
@property(readwrite) NSUInteger milestone;          ///< The most recent milestone.
@property(readwrite) NSUInteger offsetMilestone;    ///< The most recent offset milestone.
@property(readwrite) NSUInteger segmentNum;         ///< The current segment.
@property(readwrite) NSUInteger eventType;          ///< The current event type.

@end