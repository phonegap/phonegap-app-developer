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

# org.apache.cordova.camera

這個外掛程式提供了一個 API，拍照，從系統的圖像庫中選擇圖像。

    cordova plugin add org.apache.cordova.camera
    

## navigator.camera.getPicture

需要使用的相機，一張照片或從設備的圖像庫檢索一張照片。 圖像作為 base64 編碼傳遞成功回檔到 `String` ，或作為影像檔的 URI。 該方法本身返回 `CameraPopoverHandle` 可以用於重新置放檔選擇彈出的物件。

    navigator.camera.getPicture( cameraSuccess, cameraError, cameraOptions );
    

### 說明

`camera.getPicture`函數將打開該設備的預設攝像頭應用程式，使使用者能夠對齊圖片。 預設情況下，會發生此行為時 `Camera.sourceType` 等於 `Camera.PictureSourceType.CAMERA` 。 一旦使用者快照照片、 攝像頭應用程式關閉，並恢復該應用程式。

如果 `Camera.sourceType` 是 `Camera.PictureSourceType.PHOTOLIBRARY` 或 `Camera.PictureSourceType.SAVEDPHOTOALBUM` ，然後允許使用者選擇一個現有圖像對話方塊的顯示。 `camera.getPicture`函數返回 `CameraPopoverHandle` 物件，可用於設備方向更改時重新置放圖像選擇對話方塊，例如。

傳回值發送到 `cameraSuccess` 回呼函數，根據指定的以下格式之一 `cameraOptions` ：

*   A `String` 包含的 base64 編碼的照片圖像。

*   A `String` 表示在本機存放區 （預設值） 上的影像檔位置。

你可以做任何你想與編碼的圖像或 URI，例如：

*   呈現在圖像 `<img>` 標記，如下面的示例所示

*   保存本地的資料 （ `LocalStorage` ， [Lawnchair][1]，等等.)

*   將資料發佈到遠端伺服器

 [1]: http://brianleroux.github.com/lawnchair/

**注**： 在較新的設備上的照片解析度是相當好。 從設備的庫選擇了照片不到較低的品質，壓縮螢幕使即使 `quality` 指定參數。 為了避免常見的記憶體問題，設置 `Camera.destinationType` 到 `FILE_URI` 而不是`DATA_URL`.

### 支援的平臺

*   亞馬遜火 OS
*   Android 系統
*   黑莓 10
*   瀏覽器
*   火狐瀏覽器的作業系統
*   iOS
*   泰
*   Windows Phone 7 和 8
*   Windows 8

### 首選項 （iOS）

*   **CameraUsesGeolocation**（布林值，預設值為 false）。 用於捕獲 jpeg 檔，設置為 true，以在 EXIF 頭資訊中獲取地理定位資料。 這將觸發請求的地理位置的許可權，如果設置為 true。
    
        <preference name="CameraUsesGeolocation" value="false" />
        

### 亞馬遜火 OS 怪癖

亞馬遜火 OS 使用意向啟動捕獲圖像，在設備上的相機活動和與低記憶體手機，科爾多瓦活動可能被殺。 在此方案中，可能不會顯示圖像還原科爾多瓦活動時。

### Android 的怪癖

Android 使用意向啟動捕獲圖像，在設備上的相機活動和與低記憶體手機，科爾多瓦活動可能被殺。 在此方案中，可能不會顯示圖像還原科爾多瓦活動時。

### 瀏覽器的怪癖

可以只返回照片作為 base64 編碼的圖像。

### 火狐瀏覽器作業系統的怪癖

觀景窗外掛程式目前實施使用[Web 活動][2].

 [2]: https://hacks.mozilla.org/2013/01/introducing-web-activities/

### iOS 的怪癖

包括 JavaScript `alert()` 在任何回呼函數可能會導致問題。 包裝內的警報 `setTimeout()` 允許 iOS 圖像選取器或氣泡框以完全關閉之前，警報將顯示：

    setTimeout(function() {/ / 做你的事!}，0) ；
    

### Windows Phone 7 的怪癖

調用本機攝像頭應用程式，而通過 Zune 所連接的設備不能工作，並且觸發錯誤回檔。

### 泰怪癖

泰僅支援 `destinationType` 的 `Camera.DestinationType.FILE_URI` 和 `sourceType` 的`Camera.PictureSourceType.PHOTOLIBRARY`.

### 示例

拍一張照片，並檢索它作為一個 base64 編碼的圖像：

    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
    });
    
    function onSuccess(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
    

拍一張照片和檢索圖像的檔位置：

    navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
        destinationType: Camera.DestinationType.FILE_URI });
    
    function onSuccess(imageURI) {
        var image = document.getElementById('myImage');
        image.src = imageURI;
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }
    

## CameraOptions

要自訂相機設置的可選參數。

    {品質： 75，destinationType： Camera.DestinationType.DATA_URL，sourceType： Camera.PictureSourceType.CAMERA，allowEdit： 為 true，encodingType： Camera.EncodingType.JPEG，targetWidth： 100，targetHeight： 100，popoverOptions： CameraPopoverOptions，saveToPhotoAlbum： 虛假} ；
    

### 選項

*   **品質**： 保存的圖像，表示為範圍 0-100，100，是通常全解析度，無損失從檔案壓縮的品質。 預設值為 50。 *（人數）*（請注意相機的解析度有關的資訊是不可用）。

*   **可**： 選擇傳回值的格式。預設值是 FILE_URI。定義在 `navigator.camera.DestinationType` *（人數）*
    
        Camera.DestinationType = {
            DATA_URL : 0,      // Return image as base64-encoded string
            FILE_URI : 1,      // Return image file URI
            NATIVE_URI : 2     // Return image native URI (e.g., assets-library:// on iOS or content:// on Android)
        };
        

*   **時**： 設置圖片的來源。預設值是觀景窗。定義在 `navigator.camera.PictureSourceType` *（人數）*
    
        Camera.PictureSourceType = {
            PHOTOLIBRARY : 0,
            CAMERA : 1,
            SAVEDPHOTOALBUM : 2
        };
        

*   **allowEdit**： 允許簡單編輯前選擇圖像。*（布林）*

*   **encodingType**： 選擇返回的影像檔的編碼。預設值為 JPEG。定義在 `navigator.camera.EncodingType` *（人數）*
    
        Camera.EncodingType = {
            JPEG : 0,               // Return JPEG encoded image
            PNG : 1                 // Return PNG encoded image
        };
        

*   **targetWidth**： 向尺度圖像的圖元寬度。必須用**targetHeight**。縱橫比保持不變。*（人數）*

*   **targetHeight**： 以圖元為單位向尺度圖像的高度。必須用**targetWidth**。縱橫比保持不變。*（人數）*

*   **媒體類型**： 設置的媒體，從選擇類型。 時才起作用 `PictureSourceType` 是 `PHOTOLIBRARY` 或 `SAVEDPHOTOALBUM` 。 定義在 `nagivator.camera.MediaType` *（人數）*
    
        Camera.MediaType = {
            PICTURE: 0,    // allow selection of still pictures only. 預設情況。 Will return format specified via DestinationType
            VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
            ALLMEDIA : 2   // allow selection from all media types
        };
        

*   **correctOrientation**： 旋轉圖像，該設備時捕獲的定向的正確。*（布林）*

*   **saveToPhotoAlbum**： 將圖像保存到相冊在設備上捕獲後。*（布林）*

*   **popoverOptions**： 只有 iOS 在 iPad 中指定氣泡框位置的選項。在中定義`CameraPopoverOptions`.

*   **cameraDirection**： 選擇相機以使用 （前面或後面-面向）。預設值是背。定義在 `navigator.camera.Direction` *（人數）*
    
        Camera.Direction = {
            BACK : 0,      // Use the back-facing camera
            FRONT : 1      // Use the front-facing camera
        };
        

### 亞馬遜火 OS 怪癖

*   任何 `cameraDirection` 值回朝的照片中的結果。

*   忽略 `allowEdit` 參數。

*   `Camera.PictureSourceType.PHOTOLIBRARY`和 `Camera.PictureSourceType.SAVEDPHOTOALBUM` 都顯示相同的相冊。

### Android 的怪癖

*   任何 `cameraDirection` 值結果在背面的照片。

*   忽略 `allowEdit` 參數。

*   `Camera.PictureSourceType.PHOTOLIBRARY`和 `Camera.PictureSourceType.SAVEDPHOTOALBUM` 都顯示相同的寫真集。

### 黑莓 10 的怪癖

*   忽略 `quality` 參數。

*   忽略 `allowEdit` 參數。

*   `Camera.MediaType`不受支援。

*   忽略 `correctOrientation` 參數。

*   忽略 `cameraDirection` 參數。

### 火狐瀏覽器作業系統的怪癖

*   忽略 `quality` 參數。

*   `Camera.DestinationType`將被忽略並且等於 `1` （影像檔的 URI）

*   忽略 `allowEdit` 參數。

*   忽略 `PictureSourceType` 參數 （使用者選擇它在對話方塊視窗中)

*   忽略`encodingType`

*   忽略了 `targetWidth` 和`targetHeight`

*   `Camera.MediaType`不受支援。

*   忽略 `correctOrientation` 參數。

*   忽略 `cameraDirection` 參數。

### iOS 的怪癖

*   設置 `quality` 低於 50，避免在某些設備上的記憶體不足錯誤。

*   當使用 `destinationType.FILE_URI` ，照片都保存在應用程式的臨時目錄。應用程式結束時，將刪除該應用程式的臨時目錄中的內容。

### 泰怪癖

*   不支援的選項

*   總是返回一個檔的 URI

### Windows Phone 7 和 8 的怪癖

*   忽略 `allowEdit` 參數。

*   忽略 `correctOrientation` 參數。

*   忽略 `cameraDirection` 參數。

*   忽略 `saveToPhotoAlbum` 參數。 重要： 使用 wp7/8 科爾多瓦攝像頭 API 拍攝的所有圖像總是都複製到手機的相機膠捲。 根據使用者的設置，這可能也意味著圖像是自動上傳到他們另。 這有可能意味著的圖像，可以比你的應用程式的目的更多的觀眾。 如果此阻滯劑您的應用程式，您將需要實現 CameraCaptureTask 在 msdn 上記載： [HTTP://msdn.microsoft.com/en-us/library/windowsphone/develop/hh394006.aspx][3]你可能還評論或在[問題追蹤器][4]的向上投票的相關的問題

*   忽略了 `mediaType` 屬性的 `cameraOptions` 作為 Windows Phone SDK 並不提供從 PHOTOLIBRARY 中選擇視頻的方法。

 [3]: http://msdn.microsoft.com/en-us/library/windowsphone/develop/hh394006.aspx
 [4]: https://issues.apache.org/jira/browse/CB-2083

## CameraError

onError 的回呼函數提供了一條錯誤訊息。

    function(message) {
        // Show a helpful message
    }
    

### 參數

*   **消息**： 消息提供的設備的本機代碼。*（字串）*

## cameraSuccess

提供的圖像資料的 onSuccess 回呼函數。

    function(imageData) {
        // Do something with the image
    }
    

### 參數

*   **圖像資料**： Base64 編碼進行編碼的圖像資料，*或*影像檔的 URI，取決於 `cameraOptions` 效果。*（字串）*

### 示例

    // Show image
    //
    function cameraCallback(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    }
    

## CameraPopoverHandle

由創建的氣泡框對話方塊的控制碼`navigator.camera.getPicture`.

### 方法

*   **setPosition**： 設置氣泡框的位置。

### 支援的平臺

*   iOS

### setPosition

設置氣泡框的位置。

**參數**：

*   `cameraPopoverOptions`： `CameraPopoverOptions` ，指定新的位置

### 示例

     var cameraPopoverHandle = navigator.camera.getPicture(onSuccess, onFail,
         { destinationType: Camera.DestinationType.FILE_URI,
           sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
           popoverOptions: new CameraPopoverOptions(300, 300, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY)
         });
    
     // Reposition the popover if the orientation changes.
     window.onorientationchange = function() {
         var cameraPopoverOptions = new CameraPopoverOptions(0, 0, 100, 100, Camera.PopoverArrowDirection.ARROW_ANY);
         cameraPopoverHandle.setPosition(cameraPopoverOptions);
     }
    

## CameraPopoverOptions

iOS 僅指定氣泡框的錨元素的位置和箭頭方向，從 iPad 庫或專輯選擇圖像時的參數。

    {x: 0，y： 32，寬度： 320，高度： 480，arrowDir： Camera.PopoverArrowDirection.ARROW_ANY} ；
    

### CameraPopoverOptions

*   **x**： x 螢幕元素到其錨定氣泡框上的圖元座標。*（人數）*

*   **y**： 螢幕元素到其錨定氣泡框上的 y 圖元座標。*（人數）*

*   **寬度**： 寬度以圖元為單位），到其錨定氣泡框上的螢幕元素。*（人數）*

*   **高度**： 高度以圖元為單位），到其錨定氣泡框上的螢幕元素。*（人數）*

*   **arrowDir**： 氣泡框上的箭頭應指向的方向。定義在 `Camera.PopoverArrowDirection` *（人數）*
    
            Camera.PopoverArrowDirection = {
                ARROW_UP : 1,        // matches iOS UIPopoverArrowDirection constants
                ARROW_DOWN : 2,
                ARROW_LEFT : 4,
                ARROW_RIGHT : 8,
                ARROW_ANY : 15
            };
        

請注意氣泡框的大小可能會更改箭頭的方向和螢幕的方向進行調整。 請確保帳戶方向更改時指定錨元素位置。

## navigator.camera.cleanup

刪除中間從臨時存儲攝像機所拍攝的照片。

    navigator.camera.cleanup( cameraSuccess, cameraError );
    

### 描述

刪除中間打完電話後保留在臨時存儲中的影像檔 `camera.getPicture` 。 只有當適用的價值 `Camera.sourceType` 等於 `Camera.PictureSourceType.CAMERA` 和 `Camera.destinationType` 等於`Camera.DestinationType.FILE_URI`.

### 支援的平臺

*   iOS

### 示例

    navigator.camera.cleanup(onSuccess, onFail);
    
    function onSuccess() {
        console.log("Camera cleanup success.")
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }