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

#ifndef ADBMEDIAANALYTICS_HPP_
#define ADBMEDIAANALYTICS_HPP_

#include <QString>
#include <QHash>

#include "ADBMediaState.hpp"
#include "ADBMediaSharedHeader.hpp"

class ADBMediaItem;

typedef void (*mediaMonitor_func)(ADBMediaState *media);
class ADBMediaAnalytics {
private:
	QHash<QString, QString> buildMediaVars(ADBMediaItem *mi);
	QHash<QString, QString> buildContextData(ADBMediaItem *mi, QHash<QString, QString> trackVars = QHash<QString, QString>());

	ADBMediaAnalytics();
	virtual ~ADBMediaAnalytics();
	QHash <QString, ADBMediaItem *> mediaItemList;

public:
	// added to public so we can call it from media item
	void playerEvent(QString name, ADBMediaEventType eventType, QHash<QString, QString> additionalData = QHash<QString, QString>(), double offset = -1, unsigned int segmentNum = 0, QString segment = QString());

	static ADBMediaAnalytics *sharedInstance();
	void open(QString name, double length, QString playerName, QString playerID = QString());
	void openAd(QString name, double length, QString playerName, QString parentName, QString parentPod, double parentPodPosition, QString CPM);
	void close(QString name);
	void play(QString name, double offset);
	void click(QString name, double offset);
	void complete(QString name, double offset);
	void stop(QString name, double offset);
	void track(QString name, QHash<QString, QString> additionalData = QHash<QString, QString>());

	QString channel;
	double completeCloseOffsetThreshold;

	mediaMonitor_func mediaMeasurementDelegate;

	int trackSeconds;
	QString trackMilestones;
	bool segmentByMilestones;
	QString trackOffsetMilestones;
	bool segmentByOffsetMilestones;

	int adTrackSeconds;
	QString adTrackMilestones;
	bool adSegmentByMilestones;
	QString adTrackOffsetMilestones;
	bool adSegmentByOffsetMilestones;
};

#endif /* ADBMEDIAANALYTICS_HPP_ */
