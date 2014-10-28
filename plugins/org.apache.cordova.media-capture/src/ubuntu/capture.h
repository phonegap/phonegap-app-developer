/*
 *
 * Copyright 2013 Canonical Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
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
#ifndef CAPTURE_H_ASCXZFG975
#define CAPTURE_H_ASCXZFG975

#include <cordova.h>
#include <cplugin.h>
#include <QtMultimedia>
#include <QtCore>
#include <QtQuick>

class MediaCapture: public CPlugin {
    Q_OBJECT
public:
    explicit MediaCapture(Cordova *cordova);

    virtual const QString fullName() override {
        return MediaCapture::fullID();
    }

    virtual const QString shortName() override {
        return "Capture";
    }

    static const QString fullID() {
        return "Capture";
    }

public slots:
    void captureAudio(int scId, int ecId, const QVariantMap &);
    void captureImage(int scId, int ecId, const QVariantMap &);
    void captureVideo(int scId, int ecId, const QVariantMap &);

    void recordAudio();
    void cancel();
    void onVideoRecordEnd(const QString &uri);
    void onImageSaved(const QString &path);

    QString generateLocation(const QString &extension) {
        int i = 1;
        for (;;++i) {
            QString path = QString("%1/.local/share/%2/persistent/%3.%4").arg(QDir::homePath())
                .arg(QCoreApplication::applicationName()).arg(i).arg(extension);

            if (!QFileInfo(path).exists())
                return path;
        }
    }
private slots:
    void onAudioRecordError(QMediaRecorder::Error);
private:
    QSharedPointer<QAudioRecorder> _recorder;

    int _scId, _ecId;
    QList<QString> _files;
    QVariantMap _options;
    QMimeDatabase _db;

    enum CaptureError {
        CAPTURE_INTERNAL_ERR = 0,
        CAPTURE_APPLICATION_BUSY = 1,
        CAPTURE_INVALID_ARGUMENT = 2,
        CAPTURE_NO_MEDIA_FILES = 3,
        CAPTURE_NOT_SUPPORTED = 20
    };
};

#endif
