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

# org.apache.cordova.splashscreen

이 플러그인은 표시 하 고 응용 프로그램 실행 하는 동안 시작 화면을 숨깁니다.

## 설치

    cordova plugin add org.apache.cordova.splashscreen
    

## 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   안 드 로이드
*   블랙베리 10
*   iOS
*   Windows Phone 7과 8
*   윈도우 8

## 메서드

*   splashscreen.show
*   splashscreen.hide

### 안 드 로이드 단점

당신의 config.xml에 다음 기본 설정 추가 해야

`<preference name="splashscreen" value="foo" />`

여기서 foo splashscreen 파일의 이름입니다. 가급적 이면 9 패치 파일입니다. 적절 한 폴더 아래 res/xml 디렉토리에 splashcreen 파일을 추가 해야 합니다.

안 드 로이드, 또한 프로젝트 주요 자바 파일을 편집 해야 합니다. 당신의 super.loadUrl 시간 지연을 나타내는 두 번째 매개 변수를 추가 해야 합니다.

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.hide

시작 화면을 닫습니다.

    navigator.splashscreen.hide();
    

### 블랙베리 10 특질

`config.xml`파일의 `AutoHideSplashScreen` 설정을 해야 합니다`false`.

### iOS 특질

`config.xml`파일의 `AutoHideSplashScreen` 설정을 해야 합니다 `false` . 2 초 동안 시작 화면을 숨기고 지연에 다음과 같이 타이머 추가 `deviceready` 이벤트 처리기:

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.show

시작 화면을 표시합니다.

    navigator.splashscreen.show();
    

응용 프로그램 호출할 수 없습니다 `navigator.splashscreen.show()` 응용 프로그램은 시작 될 때까지 및 `deviceready` 이벤트를 해 고 했다. 하지만 그 스플래시 스크린의 목적 것 같다 일반적으로 시작 화면이 당신의 애플 리 케이 션 시작 하기 전에 표시 될 운명이 다, 이후. 몇 가지 구성을 제공 `config.xml` 자동으로 `show` 시작 화면 응용 프로그램 실행 후 즉시 및 그것은 완벽 하 게 시작 하 고 받은 전에 `deviceready` 이벤트. 이 구성 하 고 자세한 내용은 [아이콘 및 시작 화면을][1] 참조 하십시오. 이러한 이유로, 그것은 가능성이 호출 해야 `navigator.splashscreen.show()` 시작 화면은 응용 프로그램 시작에 대 한 표시 되도록 합니다.

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html