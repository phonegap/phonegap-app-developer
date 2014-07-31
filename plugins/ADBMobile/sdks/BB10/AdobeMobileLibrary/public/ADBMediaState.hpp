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

#ifndef ADBMEDIASTATE_HPP_
#define ADBMEDIASTATE_HPP_

#include <QString>
#include <QDateTime>

class ADBMediaState {
public:
	QString name;
	bool ad;
	bool clicked;
	double length;
	QString playerName;
	QString mediaEvent;
	bool eventFirstTime;
	QDateTime openTime;
	double offset;
	double percent;
	double timePlayed;
	double milestone;

	double offsetMilestone;
	int segmentNum;
	QString segment;
	double segmentLength;
	bool complete;

	ADBMediaState();
	virtual ~ADBMediaState();
};

#endif /* ADBMEDIASTATE_HPP_ */
