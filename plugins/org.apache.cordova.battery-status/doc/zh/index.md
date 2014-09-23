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

# org.apache.cordova.battery-地位

這個外掛程式提供的舊版本的[電池狀態事件 API][1]實現的.

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

它將添加以下三 `window` 事件：

*   batterystatus
*   batterycritical
*   batterylow

## 安裝

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

當電池計量的百分比改變了至少 1%，或如果在插入或拔出該設備會觸發此事件。

電池狀態處理常式傳遞一個物件，包含兩個屬性：

*   **級別**: 電池充電 (0-100) 的百分比。*（人數）*

*   **isPlugged**： 一個布林值，該值指示設備是否插*(布林值)*

應用程式通常應使用 `window.addEventListener` 將附加一個事件攔截器後的 `deviceready` 事件觸發。

### 支援的平臺

*   亞馬遜火 OS
*   iOS
*   Android 系統
*   黑莓 10
*   Windows Phone 7 和 8
*   Tizen
*   火狐瀏覽器作業系統

### Windows Phone 7 和 8 怪癖

Windows Phone 7 並不提供本機 Api 來確定電池計量水準，所以 `level` 是不可用的屬性。`isPlugged`參數**支援的。

### 示例

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

當電池計量的百分比已達到關鍵電池閾值時，將觸發該事件。值是特定于設備。

`batterycritical`處理常式傳遞一個物件，包含兩個屬性：

*   **級別**: 電池充電 (0-100) 的百分比。*（人數）*

*   **isPlugged**： 一個布林值，該值指示設備是否插*(布林值)*

應用程式通常應使用 `window.addEventListener` 將一個事件攔截器附加一次 `deviceready` 事件火災。

### 支援的平臺

*   亞馬遜火 OS
*   iOS
*   Android 系統
*   黑莓 10
*   Tizen
*   火狐瀏覽器作業系統

### 示例

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

當電池計量的百分比已達到電池計量低門檻，設備特定值時，將觸發該事件。

`batterylow`處理常式傳遞一個物件，包含兩個屬性：

*   **級別**: 電池充電 (0-100) 的百分比。*（人數）*

*   **isPlugged**： 一個布林值，該值指示設備是否插*(布林值)*

應用程式通常應使用 `window.addEventListener` 將一個事件攔截器附加一次 `deviceready` 事件火災。

### 支援的平臺

*   亞馬遜火 OS
*   iOS
*   Android 系統
*   黑莓 10
*   Tizen
*   火狐瀏覽器作業系統

### 示例

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }