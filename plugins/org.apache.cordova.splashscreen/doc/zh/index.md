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

這個外掛程式顯示和隱藏在應用程式啟動期間的初始螢幕。

## 安裝

    cordova plugin add org.apache.cordova.splashscreen
    

## 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

## 方法

*   splashscreen.show
*   splashscreen.hide

### Android 的怪癖

您需要在您的 config.xml 中添加下列優先選項

`<preference name="splashscreen" value="foo" />`

美孚在哪裡的閃屏檔的名稱。最好是 9 修補程式檔。請確保您的 splashcreen 檔添加到相應的資料夾下的 res/xml 目錄。

Android 系統，也可以編輯您的專案主要的 java 檔。您必須添加第二個參數表示一個時間延遲到你 super.loadUrl。

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.hide

解雇的初始螢幕。

    navigator.splashscreen.hide();
    

### 黑莓 10 怪癖

`config.xml`檔的 `AutoHideSplashScreen` 設置必須為`false`.

### iOS 怪癖

`config.xml`檔的 `AutoHideSplashScreen` 設置必須為 `false` 。 若要延遲兩秒鐘隱藏的閃屏，添加如下所示在計時器 `deviceready` 事件處理常式：

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.show

顯示初始螢幕。

    navigator.splashscreen.show();
    

您的應用程式不能調用 `navigator.splashscreen.show()` 直到應用程式已啟動和 `deviceready` 觸發了事件。 但因為通常的閃屏為了是可見的在您的應用程式啟動之前，似乎要打敗閃屏的目的。 提供一些配置在 `config.xml` 自動將 `show` 的初始螢幕，您的應用程式啟動後立即和它在之前已完全開始收到 `deviceready` 事件。 做這種配置的詳細資訊，請參閱[圖示和閃屏][1]。 出於此原因，它是不太可能你需要調用 `navigator.splashscreen.show()` ，使初始螢幕可見為應用程式啟動。

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html