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

這個外掛程式提供了對設備的音訊、 圖像和視頻捕獲功能的訪問。

**警告**： 收集和使用的圖像、 視頻或音訊裝置的攝像頭或麥克風從提出了重要的隱私問題。 您的應用程式的隱私權原則應該討論應用程式如何使用這種感應器和記錄的資料是否與任何其他方共用。 此外，如果攝像機或麥克風的應用程式的使用在使用者介面中不是明顯的你應該之前應用程式訪問的相機或麥克風 （如果設備作業系統不會這樣做已經) 提供只是在時間的通知。 該通知應提供相同的資訊上文指出的並獲取該使用者的許可權 （例如，通過為**確定**並**不感謝**提出的選擇）。 請注意有些應用程式市場可能需要您的應用程式提供只是時間的通知，並從訪問攝像機或麥克風之前使用者獲得的許可權。 有關詳細資訊，請參閱隱私指南。

## 安裝

    cordova plugin add org.apache.cordova.media-capture
    

## 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

## 物件

*   捕獲
*   CaptureAudioOptions
*   CaptureImageOptions
*   CaptureVideoOptions
*   CaptureCallback
*   CaptureErrorCB
*   配置
*   媒體
*   MediaFileData

## 方法

*   capture.captureAudio
*   capture.captureImage
*   capture.captureVideo
*   MediaFile.getFormatData

## 屬性

*   **supportedAudioModes**： 音訊錄音設備所支援的格式。(ConfigurationData[])

*   **supportedImageModes**： 錄製圖像大小和格式的設備支援。(ConfigurationData[])

*   **supportedVideoModes**： 錄製的視頻解析度和設備支援的格式。(ConfigurationData[])

## capture.captureAudio

> 啟動音訊答錄機應用程式並返回有關捕獲音訊剪輯檔的資訊。

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );
    

### 說明

開始非同步作業以捕獲使用該設備的預設音訊錄製應用程式的音訊錄製。 該操作允許設備使用者的單個會話中捕獲多個錄音。

在捕獲操作結束時或者在使用者退出音訊錄音應用程式或由指定的錄音的最大數目 `CaptureAudioOptions.limit` 到達。 如果沒有 `limit` 指定參數的值，它將預設為一 (1) 和捕獲操作終止後使用者記錄單個音訊剪輯。

在捕獲操作完成後， `CaptureCallback` 執行與陣列的 `MediaFile` 物件描述每個捕獲音訊剪輯檔。 如果使用者終止操作之前捕獲音訊剪輯時， `CaptureErrorCallback` 與執行 `CaptureError` 物件中，設有 `CaptureError.CAPTURE_NO_MEDIA_FILES` 錯誤代碼。

### 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

### 示例

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
    

### iOS 的怪癖

*   iOS 沒有預設的音訊錄音應用程式，因此提供了一個簡單的使用者介面。

### Windows Phone 7 和 8 怪癖

*   Windows Phone 7 沒有預設的音訊錄音應用程式，因此提供了一個簡單的使用者介面。

## CaptureAudioOptions

> 封裝的音訊捕獲的配置選項。

### 屬性

*   **限制**： 音訊剪輯設備使用者可以在單個捕獲操作中記錄的最大數目。值必須是大於或等於 1 （預設為 1）。

*   **持續時間**： 音訊的音效片段，以秒為單位的最長期限。

### 示例

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };
    
    navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    

### 亞馬遜火 OS 怪癖

*   `duration`參數不受支援。記錄長度不能僅限於以程式設計方式。

### Android 的怪癖

*   `duration`參數不受支援。記錄長度不能僅限於以程式設計方式。

### 黑莓 10 怪癖

*   `duration`參數不受支援。記錄長度不能局限以程式設計方式。
*   `limit`參數不受支援，所以只有一個記錄可以創建的每個調用。

### iOS 的怪癖

*   `limit`參數不受支援，所以只有一個記錄可以創建的每個調用。

## capture.captureImage

> 啟動攝像頭應用程式並返回有關捕獲的影像檔的資訊。

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );
    

### 說明

開始非同步作業以捕獲圖像使用該設備的攝像頭應用程式。該操作允許使用者在一個會話中捕獲多個圖像。

在捕獲操作結束或者當使用者關閉攝像頭應用程式或由指定的錄音的最大數目 `CaptureAudioOptions.limit` 到達。 如果沒有 `limit` 指定的值，它將預設為一 (1) 和捕獲操作終止後使用者捕獲單個圖像。

在捕獲操作完成後，它將調用 `CaptureCB` 回檔與陣列的 `MediaFile` 物件描述每個捕獲的影像檔。 如果使用者終止之前捕獲圖像，操作 `CaptureErrorCB` 回檔執行與 `CaptureError` 物件特色 `CaptureError.CAPTURE_NO_MEDIA_FILES` 錯誤代碼。

### 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

### Windows Phone 7 的怪癖

調用本機攝像頭應用程式，同時通過 Zune 連接您的設備不工作，並錯誤回檔執行。

### 示例

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

> 封裝圖像捕獲的配置選項。

### 屬性

*   **限制**： 使用者可以在單個捕獲操作中捕獲的圖像的最大數目。值必須是大於或等於 1 （預設為 1）。

### 示例

    // limit capture operation to 3 images
    var options = { limit: 3 };
    
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
    

### iOS 的怪癖

*   **限制**參數不受支援，並只有一個圖像採取每次調用的。

## capture.captureVideo

> 啟動視頻錄製器應用程式並返回有關捕獲的視訊短片檔的資訊。

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );
    

### 說明

開始非同步作業以捕獲使用該設備的視頻錄製應用程式的視頻錄製。該操作允許使用者在一個會話中捕獲多個錄音。

在捕獲操作結束時或者在使用者退出視頻錄製應用程式或由指定的錄音的最大數目 `CaptureVideoOptions.limit` 到達。 如果沒有 `limit` 指定參數的值，它將預設為一 (1) 和捕獲操作終止後使用者記錄單個視訊短片。

在捕獲操作完成後，它 `CaptureCB` 回檔執行與陣列的 `MediaFile` 物件描述每個捕獲視訊短片檔。 如果使用者終止之前捕獲的視訊短片，操作 `CaptureErrorCB` 回檔執行與 `CaptureError` 物件特色 `CaptureError.CAPTURE_NO_MEDIA_FILES` 錯誤代碼。

### 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

### 示例

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
    

### 黑莓 10 怪癖

*   科爾多瓦的黑莓 10 嘗試啟動**視頻錄影機**提供的應用程式，由 RIM，以捕獲視頻的錄製。 這款應用程式會收到 `CaptureError.CAPTURE_NOT_SUPPORTED` 錯誤代碼，如果應用程式未安裝在設備上。

## CaptureVideoOptions

> 封裝視頻捕獲的配置選項。

### 屬性

*   **限制**： 該設備的使用者可以在單個捕獲操作中捕獲的視訊短片的最大數目。值必須是大於或等於 1 （預設為 1）。

*   **持續時間**： 視訊短片，以秒為單位的最長期限。

### 示例

    // limit capture operation to 3 video clips
    var options = { limit: 3 };
    
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    

### 黑莓 10 怪癖

*   不支援的**持續時間**參數，所以錄製的長度不能以程式設計方式加以限制。

### iOS 的怪癖

*   **限制**參數不受支援。只有一個視頻記錄每次調用的。

## CaptureCB

> 在成功的媒體捕獲操作時調用。

    function captureSuccess( MediaFile[] mediaFiles ) { ... };
    

### 說明

此函數執行成功捕獲操作完成後。 在已捕獲的媒體檔案，這點，或者使用者已退出媒體捕獲應用程式，或已達到捕獲限制。

每個 `MediaFile` 物件描述一個捕捉的媒體檔案。

### 示例

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    

## CaptureError

> 封裝失敗的媒體捕獲操作所引起的錯誤代碼。

### 屬性

*   **代碼**： 下面列出的預定義的錯誤代碼之一。

### 常量

*   `CaptureError.CAPTURE_INTERNAL_ERR`： 攝像機或麥克風無法捕獲的圖像或聲音。

*   `CaptureError.CAPTURE_APPLICATION_BUSY`： 相機或音訊捕獲應用程式正在服另一個捕獲請求。

*   `CaptureError.CAPTURE_INVALID_ARGUMENT`： API 的使用無效 （例如，價值 `limit` 小於 1)。

*   `CaptureError.CAPTURE_NO_MEDIA_FILES`： 在使用者退出之前捕獲任何相機或音訊捕獲應用程式。

*   `CaptureError.CAPTURE_NOT_SUPPORTED`： 請求的捕獲操作不受支援。

## CaptureErrorCB

> 如果媒體捕獲操作期間發生錯誤，調用。

    function captureError( CaptureError error ) { ... };
    

### 說明

如果發生錯誤時試圖發起一個媒體捕獲操作，執行此函數。 故障情形包括捕獲應用程式正忙、 捕獲操作已經發生，或使用者取消該操作之前捕獲任何媒體檔案時。

此函數執行與 `CaptureError` 物件，其中包含適當的錯誤`code`.

### 示例

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    

## 配置

> 封裝一組設備支援的媒體捕獲參數。

### 說明

描述設備所支援的媒體捕獲模式。配置資料包含的 MIME 類型和捕獲尺寸的視頻或圖像捕獲。

MIME 類型應堅持[RFC2046][1]。例子：

 [1]: http://www.ietf.org/rfc/rfc2046.txt

*   `video/3gpp`
*   `video/quicktime`
*   `image/jpeg`
*   `audio/amr`
*   `audio/wav`

### 屬性

*   **類型**： ASCII 編碼的小寫字串表示的媒體類型。() DOMString

*   **高度**： 圖像或視頻以圖元為單位的高度。值為零的音效片段。（人數）

*   **寬度**： 圖像或視頻以圖元為單位的寬度。值為零的音效片段。（人數）

### 示例

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
    

不支援任何平臺。所有配置資料陣列都是空的。

## MediaFile.getFormatData

> 檢索格式媒體捕獲檔的資訊。

    mediaFile.getFormatData （MediaFileDataSuccessCB successCallback） [MediaFileDataErrorCB errorCallback] ；
    

### 說明

此函數以非同步方式嘗試檢索該媒體檔案的格式資訊。 如果成功，它將調用 `MediaFileDataSuccessCB` 回檔與 `MediaFileData` 物件。 如果該嘗試失敗，此函數將調用 `MediaFileDataErrorCB` 回檔。

### 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   iOS
*   Windows Phone 7 和 8
*   Windows 8

### 亞馬遜火 OS 怪癖

訪問媒體檔案格式資訊的 API 的限制，所以並不是所有 `MediaFileData` 支援的屬性。

### 黑莓 10 怪癖

不為媒體檔案，所以所有有關的資訊提供一個 API `MediaFileData` 物件返回的預設值。

### Android 的怪癖

訪問媒體檔案格式資訊的 API 的限制，所以並不是所有 `MediaFileData` 支援的屬性。

### iOS 的怪癖

訪問媒體檔案格式資訊的 API 的限制，所以並不是所有 `MediaFileData` 支援的屬性。

## 媒體

> 封裝媒體捕獲檔的屬性。

### 屬性

*   **名稱**： 檔的名稱，不包含路徑資訊。() DOMString

*   **完整路徑**： 檔，包括名稱的完整路徑。() DOMString

*   **類型**： 檔的 mime 類型 (DOMString)

*   **lastModifiedDate**： 日期和檔的上次修改時間。（日期）

*   **大小**： 檔的大小，以位元組為單位。（人數）

### 方法

*   **MediaFile.getFormatData**: 檢索該媒體檔案的格式資訊。

## MediaFileData

> 封裝有關的媒體檔案的格式資訊。

### 屬性

*   **編解碼器**： 實際的音訊和視頻內容的格式。() DOMString

*   **位元速率**： 內容的平均位元速率。值為零的圖像。（人數）

*   **高度**： 圖像或視頻以圖元為單位的高度。值為零的音訊剪輯。（人數）

*   **寬度**： 圖像或視頻以圖元為單位的寬度。值為零的音訊剪輯。（人數）

*   **持續時間**： 以秒為單位的視頻或音效片段的長度。值為零的圖像。（人數）

### 黑莓 10 怪癖

沒有 API 提供的格式資訊的媒體檔案，所以 `MediaFileData` 物件返回的 `MediaFile.getFormatData` 功能以下預設值：

*   **編解碼器**： 不受支援，並且返回`null`.

*   **位元速率**: 不受支援，並且返回零。

*   **高度**: 不受支援，並且返回零。

*   **寬度**: 不受支援，並且返回零。

*   **持續時間**： 不受支援，並且返回零。

### 亞馬遜火 OS 怪癖

支援以下 `MediaFileData` 屬性：

*   **編解碼器**： 不受支援，並且返回`null`.

*   **位元速率**: 不受支援，並且返回零。

*   **高度**： 支援： 僅圖像和視頻檔。

*   **寬度**： 支援： 僅圖像和視頻檔。

*   **持續時間**： 支援： 僅音訊和視頻檔

### Android 的怪癖

支援以下 `MediaFileData` 屬性：

*   **編解碼器**： 不受支援，並且返回`null`.

*   **位元速率**: 不受支援，並且返回零。

*   **高度**： 支援： 僅圖像和視頻檔。

*   **寬度**： 支援： 僅圖像和視頻檔。

*   **持續時間**： 支援： 僅音訊和視頻檔。

### iOS 的怪癖

支援以下 `MediaFileData` 屬性：

*   **編解碼器**： 不受支援，並且返回`null`.

*   **位元速率**： 僅音訊 iOS4 設備上受支援。對於圖像和視頻，返回零。

*   **高度**： 支援： 僅圖像和視頻檔。

*   **寬度**： 支援： 僅圖像和視頻檔。

*   **持續時間**： 支援： 僅音訊和視頻檔。