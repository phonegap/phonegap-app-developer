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

# org.apache.cordova.device-orientation

這個外掛程式提供了對設備的指南針的訪問。 羅盤是感應器，可檢測的方向或設備通常指從設備的頂部的標題。 它的措施中從 0 度到 359.99，其中 0 是北部的標題。

## 安裝

    cordova plugin add org.apache.cordova.device-orientation
    

## 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   瀏覽器
*   火狐瀏覽器的作業系統
*   iOS
*   泰
*   Windows Phone 7 和第 8 （如果在硬體中可用）
*   Windows 8

## 方法

*   navigator.compass.getCurrentHeading
*   navigator.compass.watchHeading
*   navigator.compass.clearWatch

## navigator.compass.getCurrentHeading

獲取當前的羅經航向。羅經航向返回通過 `CompassHeading` 物件使用 `compassSuccess` 回呼函數。

    navigator.compass.getCurrentHeading compassError compassSuccess） ；
    

### 示例

    function onSuccess(heading) {
        alert('Heading: ' + heading.magneticHeading);
    };
    
    function onError(error) {
        alert('CompassError: ' + error.code);
    };
    
    navigator.compass.getCurrentHeading(onSuccess, onError);
    

## navigator.compass.watchHeading

獲取設備的當前標題在固定的時間間隔。檢索標題時，每次 `headingSuccess` 執行回呼函數。

返回的表 ID 引用指南針手錶的時間間隔。可以使用 ID 與手錶 `navigator.compass.clearWatch` 停止了觀看 navigator.compass。

    var watchID = navigator.compass.watchHeading(compassSuccess, compassError, [compassOptions]);
    

`compassOptions`可能包含以下鍵：

*   **頻率**： 經常如何檢索以毫秒為單位的羅經航向。*（人數）*（預設值： 100）
*   **篩選器**： 啟動 watchHeading 成功回檔所需的度的變化。當設置此值時，**頻率**將被忽略。*（人數）*

### 示例

    function onSuccess(heading) {
        var element = document.getElementById('heading');
        element.innerHTML = 'Heading: ' + heading.magneticHeading;
    };
    
    function onError(compassError) {
        alert('Compass error: ' + compassError.code);
    };
    
    var options = {
        frequency: 3000
    }; // Update every 3 seconds
    
    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    

### 瀏覽器的怪癖

隨機生成當前標題的值，以便類比羅盤。

### iOS 的怪癖

只有一個 `watchHeading` 可以在 iOS 中一次的效果。 如果 `watchHeading` 使用篩選器中，調用 `getCurrentHeading` 或 `watchHeading` 使用現有的篩選器值來指定標題的變化。 帶有篩選器看標題的變化是與時間間隔比效率更高。

### 亞馬遜火 OS 怪癖

*   `filter`不受支援。

### Android 的怪癖

*   不支援`filter`.

### 火狐瀏覽器作業系統的怪癖

*   不支援`filter`.

### 泰怪癖

*   不支援`filter`.

### Windows Phone 7 和 8 的怪癖

*   不支援`filter`.

## navigator.compass.clearWatch

別看手錶 ID 參數所引用的指南針。

    navigator.compass.clearWatch(watchID) ；
    

*   **watchID**： 由返回的 ID`navigator.compass.watchHeading`.

### 示例

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    
    // ... later on ...
    
    navigator.compass.clearWatch(watchID);
    

## CompassHeading

A `CompassHeading` 物件返回到 `compassSuccess` 回呼函數。

### 屬性

*   **magneticHeading**： 在某一時刻在時間中從 0-359.99 度的標題。*（人數）*

*   **trueHeading**： 在某一時刻的時間與地理北極在 0-359.99 度標題。 負值表示不能確定真正的標題。 *（人數）*

*   **headingAccuracy**： 中度報告的標題和真正標題之間的偏差。*（人數）*

*   **時間戳記**： 本項決定在其中的時間。*（毫秒）*

### 亞馬遜火 OS 怪癖

*   `trueHeading`不受支援，但報告相同的值`magneticHeading`

*   `headingAccuracy`是始終為 0 因為有沒有區別 `magneticHeading` 和`trueHeading`

### Android 的怪癖

*   `trueHeading`屬性不受支援，但報告相同的值`magneticHeading`.

*   `headingAccuracy`屬性始終是 0 因為有沒有區別 `magneticHeading` 和`trueHeading`.

### 火狐瀏覽器作業系統的怪癖

*   `trueHeading`屬性不受支援，但報告相同的值`magneticHeading`.

*   `headingAccuracy`屬性始終是 0 因為有沒有區別 `magneticHeading` 和`trueHeading`.

### iOS 的怪癖

*   `trueHeading`屬性只返回位置服務通過以下方式啟用`navigator.geolocation.watchLocation()`.

*   IOS 4 設備及以上，標題中設備的當前方向的因素，也不引用其絕對的位置，用於支援該方向的應用程式。

## CompassError

A `CompassError` 物件返回到 `compassError` 時出現錯誤的回呼函數。

### 屬性

*   **代碼**： 下面列出的預定義的錯誤代碼之一。

### 常量

*   `CompassError.COMPASS_INTERNAL_ERR`
*   `CompassError.COMPASS_NOT_SUPPORTED`