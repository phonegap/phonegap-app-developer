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

#ifndef ADBMEDIAITEM_HPP_
#define ADBMEDIAITEM_HPP_

#include <QString>
#include <QDateTime>
#include <QHash>
#include <QObject>

#include "ADBMediaSharedHeader.hpp"

class ADBMediaAnalytics;

#define MEDIA_MONITOR_PULSE_DURATION 1

class ADBMediaItem {
public:
	QString name;
	double length;
	double offset;
	double percent;
	QString playerName;
	QString playerID;
	double timePlayed;
	double timePlayedSinceTrack;
	double timestamp;
	ADBMediaEventType lastEventType;
	double lastEventTimestamp;
	double lastEventOffset;
	QString session;
	double lastTrackOffset;
	int trackCount;
	QHash<QString, bool> firstEventList;

	bool viewTracked;

	int segmentNum;
	QString segment;
	double segmentLength;
	bool segmentGenerated;
	bool segmentChanged;
	bool updateSegment;

	bool ad;
	QString parentName;
	QString parentPod;
	int parentPodPosition;
	bool clicked;
	QString CPM;

	bool complete;
	bool completeTracked;

	int lastMilestone;
	int lastOffsetMilestone;

	bool monitorThreadActive;
	bool cancelMonitorThread;

	ADBMediaAnalytics *m;

	ADBMediaItem();
	virtual ~ADBMediaItem();

	void startMonitor();
	void stopMonitor();
};

inline bool operator==(const ADBMediaItem &i1, const ADBMediaItem &i2) {
	return i1.name == i2.name &&
			i1.length == i2.length &&
			i1.playerName == i2.playerName &&
			i1.playerID == i2.playerID;
}
inline uint qHash(const ADBMediaItem &item) {
	return qHash(item.name) ^ qHash(item.playerName);
}


#endif /* ADBMEDIAITEM_HPP_ */
