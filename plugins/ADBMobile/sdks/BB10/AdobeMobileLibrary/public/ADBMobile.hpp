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

#ifndef ADBMOBILE_HPP_
#define ADBMOBILE_HPP_

#include <QObject>
#include <QHash>
#include <bps/bps.h>
#include <bps/geolocation.h>

typedef enum ADBMobilePrivacyStatus {
    ADBMobilePrivacyStatusOptIn   = 1,
    ADBMobilePrivacyStatusOptOut  = 2,
    ADBMobilePrivacyStatusUnknown = 3
} ADBMobilePrivacyStatus;

class ADBMobile : public QObject{
public:
// library version
	static const char * version;

// initializiation calls
	static ADBMobilePrivacyStatus getPrivacyStatus();
	static void setPrivacyStatus(ADBMobilePrivacyStatus status);
// get/set custom user identifier(visitor id)
	static QString getUserIdentifier();
	static void setUserIdentifier(QString identifier);
// get/set debug logging mode
	static bool getDebugLogging();
	static void setDebugLogging(bool debugLogging);
// analytics specific functions
	static void collectLifecycleData();
	static void trackState(QString state, QHash<QString, QString> contextData = QHash<QString, QString>());
	static void trackAction(QString action, QHash<QString, QString> contextData = QHash<QString, QString>());
	static void trackLocation(bps_event_t *geoEvent, QHash<QString, QString> contextData = QHash<QString, QString>());
};

#endif /* ADBMOBILE_HPP_ */
