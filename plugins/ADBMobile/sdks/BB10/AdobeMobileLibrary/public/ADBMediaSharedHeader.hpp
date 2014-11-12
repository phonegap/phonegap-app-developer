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

#ifndef ADBMEDIASHAREDHEADER_HPP_
#define ADBMEDIASHAREDHEADER_HPP_

typedef enum ADBMediaEventType {
	ADBMediaEventTypeClose = 	0,
	ADBMediaEventTypePlay = 	1,
	ADBMediaEventTypeStop = 	2,
	ADBMediaEventTypeMonitor = 	3,
	ADBMediaEventTypeTrack = 	4,
	ADBMediaEventTypeComplete = 5,
	ADBMediaEventTypeClick =	7
} ADBMediaEventType;

#endif /* ADBMEDIASHAREDHEADER_HPP_ */
