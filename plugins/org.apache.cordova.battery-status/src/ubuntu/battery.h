/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

#ifndef BATTERY_H_AAAAAAAA
#define BATTERY_H_AAAAAAAA

#include <QBatteryInfo>

#include <cplugin.h>

class BatteryStatus: public CPlugin {
    Q_OBJECT
public:
    explicit BatteryStatus(Cordova *cordova);

    virtual const QString fullName() override {
        return BatteryStatus::fullID();
    }

    virtual const QString shortName() override {
        return "Battery";
    }

    static const QString fullID() {
        return "Battery";
    }

public slots:
    void start(int scId, int ecId);
    void stop(int scId, int ecId);

private slots:
    void remainingCapacityChanged(int battery, int capacity);
    void chargerTypeChanged(QBatteryInfo::ChargerType type);
    void onlineStatusChanged(bool isOnline);

private:
    void fireEvents();

    QBatteryInfo _batteryInfo;

    int _scId;
};

#endif
