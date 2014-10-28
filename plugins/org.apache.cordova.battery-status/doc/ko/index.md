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

# org.apache.cordova.battery 상태

이 플러그인에서는 [배터리 상태 이벤트 API][1] 의 이전 버전의 구현을.

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

그것은 다음과 같은 세 가지 추가 `window` 이벤트:

*   batterystatus
*   batterycritical
*   batterylow

## 설치

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

이 이벤트는 배터리 충전 비율 1% 이상에 의해 변경 될 때 또는 장치를 연결 하거나 분리 하는 경우 발생 합니다.

배터리 상태 처리기는 두 개의 속성이 포함 된 개체에 전달 됩니다.

*   **수준**: 배터리 충전 (0-100)의 비율. *(수)*

*   **isPlugged**: 장치 연결된 인치 *(부울)* 인지 여부를 나타내는 부울 값

일반적으로 응용 프로그램을 사용 해야 합니다 `window.addEventListener` 후 이벤트 리스너를 연결 하는 `deviceready` 이벤트가 발생 합니다.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   iOS
*   안 드 로이드
*   블랙베리 10
*   Windows Phone 7과 8
*   Tizen
*   Firefox 운영 체제

### Windows Phone 7, 8 특수

Windows Phone 7 배터리 수준을 확인 하려면 네이티브 Api를 제공 하지 않습니다 때문에 `level` 속성은 사용할 수 없습니다. `isPlugged`매개 변수는 *는* 지원.

### 예를 들어

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

이벤트 발생 때 배터리 충전 비율 배터리 위험 임계값에 도달 했습니다. 값은 장치 마다 다릅니다.

`batterycritical`처리기는 두 개의 속성이 포함 된 개체에 전달 됩니다:

*   **수준**: 배터리 충전 (0-100)의 비율. *(수)*

*   **isPlugged**: 장치 연결된 인치 *(부울)* 인지 여부를 나타내는 부울 값

일반적으로 응용 프로그램을 사용 해야 합니다 `window.addEventListener` 한번 이벤트 리스너를 연결 하는 `deviceready` 이벤트가 발생 합니다.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   iOS
*   안 드 로이드
*   블랙베리 10
*   Tizen
*   Firefox 운영 체제

### 예를 들어

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

이벤트 발생 때 배터리 충전 비율 낮은 배터리 임계값, 특정 값에 도달 했습니다.

`batterylow`처리기는 두 개의 속성이 포함 된 개체에 전달 됩니다:

*   **수준**: 배터리 충전 (0-100)의 비율. *(수)*

*   **isPlugged**: 장치 연결된 인치 *(부울)* 인지 여부를 나타내는 부울 값

일반적으로 응용 프로그램을 사용 해야 합니다 `window.addEventListener` 한번 이벤트 리스너를 연결 하는 `deviceready` 이벤트가 발생 합니다.

### 지원 되는 플랫폼

*   아마존 화재 운영 체제
*   iOS
*   안 드 로이드
*   블랙베리 10
*   Tizen
*   Firefox 운영 체제

### 예를 들어

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }