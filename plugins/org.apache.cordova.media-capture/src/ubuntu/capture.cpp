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
#include "capture.h"

const char code[] = "\
var component, object;                                                  \
function createObject() {                                               \
    component = Qt.createComponent(%1);                                 \
    if (component.status == Component.Ready)                            \
        finishCreation();                                               \
    else                                                                \
        component.statusChanged.connect(finishCreation);                \
}                                                                       \
function finishCreation() {                                             \
    CordovaWrapper.global.captureObject = component.createObject(root,         \
        {root: root, cordova: cordova, state: \"%2\"});                 \
}                                                                       \
createObject()";

static QString formatFile(const QMimeDatabase &db, const QString &path) {
    QFileInfo info(path);
    QMimeType mime = db.mimeTypeForFile(info.fileName());

    QVariantMap file;
    file.insert("name", info.fileName());
    file.insert("fullPath", info.absoluteFilePath());
    file.insert("lastModifiedDate", info.lastModified().toMSecsSinceEpoch());
    file.insert("size", info.size());
    file.insert("type", mime.name());

    return CordovaInternal::format(file);
}

MediaCapture::MediaCapture(Cordova *cordova): CPlugin(cordova), _scId(0), _ecId(0) {
}

void MediaCapture::captureAudio(int scId, int ecId, const QVariantMap &) {
    if (_scId || _ecId) {
        this->callback(_ecId, QString("{code: %1}").arg(CAPTURE_APPLICATION_BUSY));
        return;
    }

    QString path = m_cordova->get_app_dir() + "/../qml/MediaCaptureWidget.qml";

    QString qml = QString(code).arg(CordovaInternal::format(path)).arg("audio");
    m_cordova->execQML(qml);

    _scId = scId;
    _ecId = ecId;
}

void MediaCapture::onAudioRecordError(QMediaRecorder::Error) {
    if (!_ecId)
        return;
    this->callback(_ecId, QString("{code: %1}").arg(CAPTURE_INTERNAL_ERR));
    _ecId = _scId = 0;

    _recorder.clear();
    _files.clear();

    m_cordova->execQML("CordovaWrapper.global.captureObject.destroy()");
}

void MediaCapture::recordAudio() {
    if (_recorder.data()) {
        QUrl url = _recorder->outputLocation();

        QString path = url.toString();
        _recorder->stop();

        _recorder.clear();

        this->callback(_scId, QString("[%1]").arg(formatFile(_db, path)));
        _ecId = _scId = 0;

        m_cordova->execQML("CordovaWrapper.global.captureObject.destroy()");
    } else {
        _recorder = QSharedPointer<QAudioRecorder>(new QAudioRecorder);
        QObject::connect(_recorder.data(), SIGNAL(error(QMediaRecorder::Error)), this, SLOT(onAudioRecordError(QMediaRecorder::Error)));

        if (_options.find("mode")->toString() == "audio/amr") {
            _recorder->setContainerFormat("amr");
            _recorder->setOutputLocation(generateLocation("amr"));
        } else {
            _recorder->setContainerFormat("wav");
            _recorder->setOutputLocation(generateLocation("wav"));
        }
        _recorder->record();
    }
}

void MediaCapture::cancel() {
    if (!_ecId)
        return;

    m_cordova->execQML("CordovaWrapper.global.captureObject.destroy()");

    _recorder.clear();
    this->callback(_ecId, QString("{code: %1}").arg(CAPTURE_NO_MEDIA_FILES));
    _ecId = _scId = 0;

    _recorder.clear();
}

void MediaCapture::captureVideo(int scId, int ecId, const QVariantMap &) {
    if (_scId || _ecId) {
        this->callback(_ecId, QString("{code: %1}").arg(CAPTURE_APPLICATION_BUSY));
        return;
    }

    QString path = m_cordova->get_app_dir() + "/../qml/MediaCaptureWidget.qml";
    QString qml = QString(code).arg(CordovaInternal::format(path)).arg("videoRecording");
    m_cordova->execQML(qml);

    _scId = scId;
    _ecId = ecId;
}

void MediaCapture::onVideoRecordEnd(const QString &uri) {
    QString path = QUrl::fromUserInput(uri).path();

    this->callback(_scId, QString("[%1]").arg(formatFile(_db, path)));
    _ecId = _scId = 0;

    m_cordova->execQML("CordovaWrapper.global.captureObject.destroy()");
}

void MediaCapture::captureImage(int scId, int ecId, const QVariantMap &) {
    if (_scId || _ecId) {
        this->callback(_ecId, QString("{code: %1}").arg(CAPTURE_APPLICATION_BUSY));
        return;
    }

    QString path = m_cordova->get_app_dir() + "/../qml/MediaCaptureWidget.qml";
    QString qml = QString(code).arg(CordovaInternal::format(path)).arg("camera");
    m_cordova->execQML(qml);

    _scId = scId;
    _ecId = ecId;
}

void MediaCapture::onImageSaved(const QString &path) {
    this->callback(_scId, QString("[%1]").arg(formatFile(_db, path)));
    _ecId = _scId = 0;
}
