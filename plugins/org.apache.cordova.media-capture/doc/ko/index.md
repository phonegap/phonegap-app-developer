<!---
    Licensed to the Apache Software Foundation (ASF) under one
    or more contributor license agreements.  See the NOTICE file
    distributed with this work for additional information
    regarding copyright ownership.  The ASF licenses this file
    to you under the Apache License, Version 2.0 (the
    "License"); you may not use this file except in compliance
    with the License.  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing,
    software distributed under the License is distributed on an
    "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, either express or implied.  See the License for the
    specific language governing permissions and limitations
    under the License.
-->

# org.apache.cordova.media-capture

이 플러그인 디바이스의 오디오, 이미지 및 비디오 캡처 기능에 대 한 액세스를 제공합니다.

**경고**: 수집 및 이미지, 비디오 또는 오디오 장치의 카메라 또는 마이크를 사용 하 여 중요 한 개인 정보 보호 문제를 제기 하고있다. 응용 프로그램의 개인 정보 보호 정책 응용 프로그램 같은 센서를 사용 하는 방법 및 다른 당사자와 함께 기록 된 데이터는 공유 하는 여부를 토론 해야 한다. 또한, 애플 리 케이 션의 카메라 또는 마이크를 사용 하지 않으면 명백한 사용자 인터페이스에서, 제공 해야 그냥--시간 통지 (해당 되는 경우 장치 운영 체제 이렇게 이미 하지 않는) 응용 프로그램 카메라 또는 마이크에 액세스 하기 전에. 그 통지는 (예를 들어, **확인** 및 **아니오**선택 제시) 하 여 사용자의 허가 취득 뿐만 아니라, 위에서 언급 된 동일한 정보를 제공 해야 합니다. Note 일부 애플 리 케이 션 장 터 저스트-인-타임 공지 및 카메라 또는 마이크에 액세스 하기 전에 사용자에 게 허가를 귀하의 응용 프로그램에 필요할 수 있습니다. 자세한 내용은 개인 정보 보호 가이드를 참조 하십시오.

## 설치

    cordova plugin add org.apache.cordova.media-capture
    

## 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

## 개체

*   캡처
*   CaptureAudioOptions
*   CaptureImageOptions
*   CaptureVideoOptions
*   CaptureCallback
*   CaptureErrorCB
*   ConfigurationData
*   돌아가기
*   MediaFileData

## 메서드

*   capture.captureAudio
*   capture.captureImage
*   capture.captureVideo
*   MediaFile.getFormatData

## 속성

*   **supportedAudioModes**: 오디오 녹음 장치에 의해 지원 되는 형식. (ConfigurationData[])

*   **supportedImageModes**: 기록 이미지 크기 및 장치에서 지원 되는 형식. (ConfigurationData[])

*   **supportedVideoModes**: 녹음 비디오 해상도 및 장치에 의해 지원 되는 형식. (ConfigurationData[])

## capture.captureAudio

> 오디오 레코더 응용 프로그램을 시작 하 고 캡처한 오디오 클립 파일에 대 한 정보를 반환 합니다.

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );
    

### 설명

소자의 기본 오디오 녹음 응용 프로그램을 사용 하 여 오디오 녹음을 캡처하는 비동기 작업을 시작 합니다. 작업 장치 사용자를 단일 세션에서 여러 녹화를 캡처할 수 있습니다.

캡처 작업이 종료 사용자 오디오 녹음 응용 프로그램 또는 녹음에 의해 지정 된 최대 수를 종료 하는 경우 `CaptureAudioOptions.limit` 에 도달. 없는 경우 `limit` 매개 변수 값 지정, 하나 (1), 기본 및 캡처 작업이 종료 되 면 사용자는 하나의 오디오 클립을 기록 하는 후.

캡처 작업이 완료 되 면은 `CaptureCallback` 의 배열을 실행 `MediaFile` 오디오 클립 파일을 캡처 설명 하는 각 개체. 전에 오디오 클립을 캡처 작업이 종료 되 면 사용자는 `CaptureErrorCallback` 으로 실행 한 `CaptureError` 개체, 특징으로 `CaptureError.CAPTURE_NO_MEDIA_FILES` 오류 코드.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

### 예를 들어

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start audio capture
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:2});
    

### iOS 단점

*   iOS 없으므로 기본 오디오 녹음 응용 프로그램을 간단한 사용자 인터페이스를 제공 합니다.

### Windows Phone 7, 8 특수

*   Windows Phone 7 없으므로 기본 오디오 녹음 응용 프로그램을 간단한 사용자 인터페이스를 제공 합니다.

## CaptureAudioOptions

> 오디오 캡처 구성 옵션을 캡슐화합니다.

### 속성

*   **제한**: 최대 오디오 클립 장치 사용자는 단일 캡처 작업에 기록할 수 있습니다. 값 1 (기본값: 1) 보다 크거나 같아야 합니다.

*   **기간**: 오디오 사운드 클립의 최대 기간 초.

### 예를 들어

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };
    
    navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    

### 아마존 화재 OS 단점

*   `duration`매개 변수는 지원 되지 않습니다. 녹음 길이 프로그래밍 방식으로 제한 될 수 없습니다.

### 안 드 로이드 단점

*   `duration`매개 변수는 지원 되지 않습니다. 녹음 길이 프로그래밍 방식으로 제한 될 수 없습니다.

### 블랙베리 10 단점

*   `duration`매개 변수는 지원 되지 않습니다. 녹음 길이 프로그래밍 방식으로 제한 될 수 없습니다.
*   `limit`매개 변수는 지원 되지 않습니다, 그래서 하나의 기록 각 호출에 대해 만들 수 있습니다.

### iOS 단점

*   `limit`매개 변수는 지원 되지 않습니다, 그래서 하나의 기록 각 호출에 대해 만들 수 있습니다.

## capture.captureImage

> 카메라 응용 프로그램을 시작 하 고 캡처된 이미지 파일에 대 한 정보를 반환 합니다.

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );
    

### 설명

디바이스의 카메라 응용 프로그램을 사용 하 여 이미지를 캡처하는 비동기 작업을 시작 합니다. 작업이 단일 세션에서 하나 이상의 이미지를 캡처할 수 있습니다.

캡처 작업이 종료 하거나 사용자가 닫으면 카메라 응용 프로그램 또는 녹음에 의해 지정 된 최대 수 `CaptureAudioOptions.limit` 에 도달. 없는 경우 `limit` 값이 지정 된, 하나 (1), 기본 및 캡처 작업이 종료 되 면 사용자는 단일 이미지 캡처 후.

캡처 작업이 완료 되 면 호출에 `CaptureCB` 의 배열과 콜백 `MediaFile` 각 캡처된 이미지 파일을 설명 하는 개체. 사용자는 이미지를 캡처하기 전에 작업을 종료 하는 경우는 `CaptureErrorCB` 콜백 실행 한 `CaptureError` 개체를 특징으로 `CaptureError.CAPTURE_NO_MEDIA_FILES` 오류 코드.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

### Windows Phone 7 단점

당신의 장치 Zune 통해 연결 하는 동안 네이티브 카메라 응용 프로그램을 호출 하면 작동 하지 않는다, 및 오류 콜백 실행.

### 예를 들어

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start image capture
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit:2});
    

## CaptureImageOptions

> 이미지 캡처 구성 옵션을 캡슐화합니다.

### 속성

*   **제한**: 사용자는 단일 캡처 작업에서 캡처할 수 있는 이미지의 최대 수. 값 1 (기본값: 1) 보다 크거나 같아야 합니다.

### 예를 들어

    // limit capture operation to 3 images
    var options = { limit: 3 };
    
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
    

### iOS 단점

*   **제한** 매개 변수는 지원 되지 않습니다, 그리고 하나의 이미지 호출 당 촬영.

## capture.captureVideo

> 비디오 레코더 응용 프로그램을 시작 하 고 캡처한 비디오 클립 파일에 대 한 정보를 반환 합니다.

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );
    

### 설명

비디오 녹화 장치의 비디오 레코딩 응용 프로그램을 사용 하 여 캡처하는 비동기 작업을 시작 합니다. 작업을 사용 하면 단일 세션에서 하나 이상의 녹음을 캡처할 수 있습니다.

캡처 작업이 끝나면 사용자 종료 비디오 레코딩 응용 프로그램 또는 녹음에 의해 지정 된 최대 수 `CaptureVideoOptions.limit` 에 도달. 없는 경우 `limit` 매개 변수 값 지정, 하나 (1), 기본 및 캡처 작업이 종료 되 면 사용자는 하나의 비디오 클립을 기록 하는 후.

캡처 작업이 완료 되 면 그것은 `CaptureCB` 의 배열과 콜백 실행 `MediaFile` 비디오 클립 파일을 캡처 설명 하는 각 개체. 사용자는 비디오 클립을 캡처하기 전에 작업을 종료 하는 경우는 `CaptureErrorCB` 콜백 실행 한 `CaptureError` 개체를 특징으로 `CaptureError.CAPTURE_NO_MEDIA_FILES` 오류 코드.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

### 예를 들어

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});
    

### 블랙베리 10 단점

*   블랙베리 10 코르도바는 **비디오 레코더** 응용 프로그램을 실행, RIM, 제공한 비디오 녹화를 잡으려고 시도 합니다. 응용 프로그램 수신는 `CaptureError.CAPTURE_NOT_SUPPORTED` 오류 코드 응용 프로그램을 장치에 설치 되어 있지 않으면.

## CaptureVideoOptions

> 비디오 캡처 구성 옵션을 캡슐화합니다.

### 속성

*   **제한**: 디바이스의 사용자는 단일 캡처 작업에서 캡처할 수 있는 비디오 클립의 최대 수. 값 1 (기본값: 1) 보다 크거나 같아야 합니다.

*   **기간**: 비디오 클립의 최대 기간 초.

### 예를 들어

    // limit capture operation to 3 video clips
    var options = { limit: 3 };
    
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    

### 블랙베리 10 단점

*   **기간** 매개 변수가 지원 되지 않으므로 녹음 길이 프로그래밍 방식으로 제한 될 수 없습니다.

### iOS 단점

*   **제한** 매개 변수는 지원 되지 않습니다. 비디오 호출 당 기록 됩니다.

## CaptureCB

> 성공적인 미디어 캡처 작업에 따라 호출 됩니다.

    function captureSuccess( MediaFile[] mediaFiles ) { ... };
    

### 설명

이 함수는 성공적인 캡처 작업이 완료 된 후 실행 합니다. 미디어 파일을 캡처한이 포인트와 중에 사용자가 미디어 캡처 응용 프로그램 종료 또는 캡처 한계에 도달 했습니다.

각 `MediaFile` 개체 캡처한 미디어 파일에 설명 합니다.

### 예를 들어

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    

## CaptureError

> 실패 한 미디어 캡처 작업에서 발생 하는 오류 코드를 캡슐화 합니다.

### 속성

*   **코드**: 미리 정의 된 오류 코드 중 하나가 아래에 나열 된.

### 상수

*   `CaptureError.CAPTURE_INTERNAL_ERR`: 카메라 또는 마이크 캡처 이미지 또는 소리 하지 못했습니다.

*   `CaptureError.CAPTURE_APPLICATION_BUSY`: 카메라 또는 오디오 캡처 응용 프로그램은 현재 또 다른 캡처 요청을 제공 하고있다.

*   `CaptureError.CAPTURE_INVALID_ARGUMENT`: API 잘못 된 사용 (예를 들어, 값 `limit` 보다 작은 하나입니다).

*   `CaptureError.CAPTURE_NO_MEDIA_FILES`: 사용자는 아무것도 캡처하기 전에 카메라 또는 오디오 캡처 응용 프로그램을 종료 합니다.

*   `CaptureError.CAPTURE_NOT_SUPPORTED`: 요청 된 캡처 작업이 지원 되지 않습니다.

## CaptureErrorCB

> 미디어 캡처 작업 중에 오류가 발생 하면 호출 됩니다.

    function captureError( CaptureError error ) { ... };
    

### 설명

이 함수는 오류가 발생 하면 실행 하려고 할 때 미디어 캡처 작업을 실행 합니다. 실패 시나리오 등 캡처 응용 프로그램이, 캡처 작업이 이미 일어나 고 있다, 또는 어떤 미디어 파일 캡처 전에 사용자가 작업을 취소 합니다.

이 함수를 함께 실행 하는 `CaptureError` 는 적절 한 오류를 포함 하는 개체`code`.

### 예를 들어

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    

## ConfigurationData

> 장치가 지 원하는 미디어 캡처 매개 변수 집합을 캡슐화 합니다.

### 설명

장치에서 지 원하는 미디어 캡처 모드를 설명 합니다. 구성 데이터는 MIME 유형 및 비디오 또는 이미지 캡처 캡처 크기 포함 됩니다.

MIME 형식 [RFC2046][1]을 준수 해야 합니다. 예:

 [1]: http://www.ietf.org/rfc/rfc2046.txt

*   `video/3gpp`
*   `video/quicktime`
*   `image/jpeg`
*   `audio/amr`
*   `audio/wav`

### 속성

*   **유형**: 미디어 형식을 나타내는 ASCII로 인코딩 소문자 문자열. (DOMString)

*   **높이**: 이미지 또는 비디오 픽셀에서의 높이 있습니다. 사운드 클립에 대 한 0입니다. (수)

*   **폭**: 이미지 또는 비디오 픽셀에서의 너비. 사운드 클립에 대 한 0입니다. (수)

### 예를 들어

    // retrieve supported image modes
    var imageModes = navigator.device.capture.supportedImageModes;
    
    // Select mode that has the highest horizontal resolution
    var width = 0;
    var selectedmode;
    for each (var mode in imageModes) {
        if (mode.width > width) {
            width = mode.width;
            selectedmode = mode;
        }
    }
    

모든 플랫폼에서 지원 되지 않습니다. 모든 구성 데이터 배열이 비어 있습니다.

## MediaFile.getFormatData

> 검색은 미디어 캡처 파일에 대 한 정보를 서식을 지정 합니다.

    mediaFile.getFormatData (MediaFileDataSuccessCB successCallback, [MediaFileDataErrorCB errorCallback]);
    

### 설명

이 함수는 비동기적으로 미디어 파일에 대 한 형식 정보를 검색 하려고 합니다. 경우, 호출 하는 `MediaFileDataSuccessCB` 와 콜백을 `MediaFileData` 개체. 이 함수 호출 하는 시도가 실패 하는 경우는 `MediaFileDataErrorCB` 콜백.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

### 아마존 화재 OS 단점

미디어 파일 형식 정보에 액세스할 수 API는 제한, 그래서 모든 `MediaFileData` 속성이 지원 됩니다.

### 블랙베리 10 단점

그래서 모든 미디어 파일에 대 한 정보에 대 한 API를 제공 하지 않습니다 `MediaFileData` 개체를 기본 값으로 반환 합니다.

### 안 드 로이드 단점

미디어 파일 형식 정보에 액세스할 수 API는 제한, 그래서 모든 `MediaFileData` 속성이 지원 됩니다.

### iOS 단점

미디어 파일 형식 정보에 액세스할 수 API는 제한, 그래서 모든 `MediaFileData` 속성이 지원 됩니다.

## 돌아가기

> 미디어 캡처 파일의 속성을 캡슐화합니다.

### 속성

*   **이름**: 경로 정보 없이 파일 이름. (DOMString)

*   **fullPath**: 이름을 포함 한 파일의 전체 경로. (DOMString)

*   **유형**: 파일의 mime 형식 (DOMString)

*   **lastModifiedDate**: 날짜 및 시간 파일을 마지막으로 수정한. (날짜)

*   **크기**: 바이트에서 파일의 크기. (수)

### 메서드

*   **MediaFile.getFormatData**: 미디어 파일의 형식 정보를 검색 합니다.

## MediaFileData

> 미디어 파일에 대 한 형식 정보를 캡슐화합니다.

### 속성

*   **코덱**: 실제 형식의 오디오 및 비디오 콘텐츠. (DOMString)

*   **비트 레이트**: 콘텐츠의 평균 비트 전송률. 값은 이미지에 대 한 0. (수)

*   **높이**: 이미지 또는 비디오 픽셀에서의 높이 있습니다. 오디오 클립에 대 한 0입니다. (수)

*   **폭**: 이미지 또는 비디오 픽셀에서의 너비. 오디오 클립에 대 한 0입니다. (수)

*   **기간**: 초에 비디오 또는 사운드 클립의 길이. 값은 이미지에 대 한 0. (수)

### 블랙베리 10 단점

미디어 파일에 대 한 형식 정보를 제공 하는 없는 API 때문에 `MediaFileData` 에 의해 반환 되는 개체 `MediaFile.getFormatData` 다음과 같은 기본 값을 기능:

*   **코덱**: 안 지원, 및 반환`null`.

*   **비트 레이트**: 안 지원, 및 0을 반환 합니다.

*   **높이**: 안 지원, 및 0을 반환 합니다.

*   **폭**: 안 지원, 및 0을 반환 합니다.

*   **기간**: 안 지원, 및 0을 반환 합니다.

### 아마존 화재 OS 단점

지원 되는 `MediaFileData` 속성:

*   **코덱**: 안 지원, 및 반환`null`.

*   **비트 레이트**: 안 지원, 및 0을 반환 합니다.

*   **높이**: 지원: 이미지 및 비디오 파일에만.

*   **폭**: 지원: 이미지 및 비디오 파일에만.

*   **기간**: 지원: 오디오 및 비디오 파일을

### 안 드 로이드 단점

지원 되는 `MediaFileData` 속성:

*   **코덱**: 안 지원, 및 반환`null`.

*   **비트 레이트**: 안 지원, 및 0을 반환 합니다.

*   **높이**: 지원: 이미지 및 비디오 파일에만.

*   **폭**: 지원: 이미지 및 비디오 파일에만.

*   **기간**: 지원: 오디오 및 비디오 파일을.

### iOS 단점

지원 되는 `MediaFileData` 속성:

*   **코덱**: 안 지원, 및 반환`null`.

*   **비트 레이트**: iOS4 장치 오디오 전용에 대 한 지원. 이미지 및 비디오에 대 한 반환 0입니다.

*   **높이**: 지원: 이미지 및 비디오 파일에만.

*   **폭**: 지원: 이미지 및 비디오 파일에만.

*   **기간**: 지원: 오디오 및 비디오 파일을.