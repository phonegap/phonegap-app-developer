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

Этот плагин предоставляет API для съемки и для выбора изображения из библиотеки изображений системы.

    cordova plugin add org.apache.cordova.camera
    

## navigator.camera.getPicture

Снимает фотографию с помощью камеры, или получает фотографию из галереи изображений устройства. Изображение передается на функцию обратного вызова успешного завершения как `String` в base64-кодировке, или как URI указывающего на файл изображения. Метод возвращает объект `CameraPopoverHandle`, который может использоваться для перемещения инструмента выбора файла.

    navigator.camera.getPicture( cameraSuccess, cameraError, cameraOptions );
    

### Описание

Функция `camera.getPicture` открывает приложение камеры устройства, которое позволяет снимать фотографии. Это происходит по умолчанию, когда `Camera.sourceType` равно `Camera.PictureSourceType.CAMERA` . Как только пользователь делает снимок,приложение камеры закрывается и приложение восстанавливается.

Если `Camera.sourceType` является `Camera.PictureSourceType.PHOTOLIBRARY` или `Camera.PictureSourceType.SAVEDPHOTOALBUM` , то показывается диалоговое окно, которое позволяет пользователям выбрать существующее изображение. Функция `camera.getPicture` возвращает объект `CameraPopoverHandle` объект, который может использоваться для перемещения диалога выбора изображения, например, при изменении ориентации устройства.

Возвращаемое значение отправляется в функцию обратного вызова `cameraSuccess` в одном из следующих форматов, в зависимости от параметра `cameraOptions` :

*   A объект `String` содержащий фото изображение в base64-кодировке.

*   Объект `String` представляющий расположение файла изображения на локальном хранилище (по умолчанию).

Вы можете сделать все, что угодно вы хотите с закодированным изображением или URI, например:

*   Отобразить изображение с помощью тега `<img>`, как показано в примере ниже

*   Сохранять данные локально (`LocalStorage`, [Lawnchair][1], и т.д.)

*   Отправлять данные на удаленный сервер

 [1]: http://brianleroux.github.com/lawnchair/

**Примечание**: разрешение фото на более новых устройствах является достаточно хорошим. Фотографии из галереи устройства не масштабируются к более низкому качеству, даже если указан параметр `quality`. Чтобы избежать общих проблем с памятью, установите `Camera.destinationType` в `FILE_URI` вместо `DATA_URL`.

### Поддерживаемые платформы

*   Amazon Fire ОС
*   Android
*   BlackBerry 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 и 8
*   Windows 8

### Особенности Amazon Fire OS

Amazon Fire OS используют намерения для запуска активности камеры на устройстве для съемки фотографий, и на устройствах с низким объемам памяти, активность Cordova может быть завершена. В этом случае изображение может не появиться при восстановлении активности Cordova.

### Особенности Android

Android использует намерения начать действие камеры на устройстве для захвата изображения, и на телефонах с низкой памяти, могут быть убиты Cordova деятельность. В этом случае изображение не может появиться, когда Кордова активность восстанавливается.

### Особенности Firefox OS

Модуль камеры в настоящее время реализуется с помощью [Веб деятельности][2].

 [2]: https://hacks.mozilla.org/2013/01/introducing-web-activities/

### Особенности iOS

Включая JavaScript `alert()` в любом из обратного вызова функции может вызвать проблемы. Оберните оповещение в `setTimeout()` выбора изображений iOS или пирог полностью закрыть прежде чем отображает оповещения:

    setTimeout(function() {/ / ваши вещи!}, 0);
    

### Особенности Windows Phone 7

Вызов приложения родной камеры, в то время как устройство подключается через Zune не работает и инициирует обратный вызов для ошибки.

### Особенности Tizen

Tizen поддерживает только `destinationType` из `Camera.DestinationType.FILE_URI` и `sourceType` из`Camera.PictureSourceType.PHOTOLIBRARY`.

### Пример

Сфотографироваться и получить его в виде изображения в кодировке base64:

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
    

Сфотографироваться и получить расположение файла изображения:

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

Необязательные параметры для настройки параметров камеры.

    { quality : 75,
      destinationType : Camera.DestinationType.DATA_URL,
      sourceType : Camera.PictureSourceType.CAMERA,
      allowEdit : true,
      encodingType: Camera.EncodingType.JPEG,
      targetWidth: 100,
      targetHeight: 100,
      popoverOptions: CameraPopoverOptions,
      saveToPhotoAlbum: false };
    

### Параметры

*   **quality**: качество сохраняемого изображения, выражается в виде числа в диапазоне от 0 до 100, где 100 является обычно полным изображением без потери качества при сжатии. Значение по умолчанию — 50. *(Число)* (Обратите внимание, что информация о разрешение камеры недоступна.)

*   **параметр destinationType**: выберите формат возвращаемого значения. Значение по умолчанию — FILE_URI. Определяется в `navigator.camera.DestinationType` *(число)*
    
        Camera.DestinationType = {
        DATA_URL: 0, / / возвращение изображения в base64-кодировке строки 
        FILE_URI: 1, / / возврат файла изображения URI 
        NATIVE_URI: 2 / / возвращение образа собственного URI (например, Библиотека активов: / / на iOS или содержание: / / на андроиде)
        };
        

*   **тип источника**: установить источник рисунка. По умолчанию используется камера. Определяется в `navigator.camera.PictureSourceType` *(число)*
    
        Camera.PictureSourceType = {
        PHOTOLIBRARY: 0, 
        CAMERA: 1, 
        SAVEDPHOTOALBUM: 2
        };
        

*   **allowEdit**: позволит редактирование изображения средствами телефона перед окончательным выбором изображения. *(Логический)*

*   **Тип_шифрования**: выберите возвращенный файл в кодировку. Значение по умолчанию — JPEG. Определяется в `navigator.camera.EncodingType` *(число)*
    
        Camera.EncodingType = {
        JPEG: 0, // возвращает изображение в формате JPEG
        PNG: 1 // возвращает рисунок в формате PNG
        };
        

*   **targetWidth**: ширина изображения в пикселах к которой необходимо осуществить масштабирование. Это значение должно использоваться совместно с **targetHeight**. Пропорции изображения останутся неизменными. *(Число)*

*   **targetHeight**: высота изображения в пикселах к которой необходимо осуществить масштабирование. Это значение должно использоваться совместно с **targetWidth**. Пропорции изображения останутся неизменными. *(Число)*

*   **mediaType**: Установите источник получения изображения, из которого надо выбрать изображение. Работает только если `PictureSourceType` равно `PHOTOLIBRARY` или `SAVEDPHOTOALBUM` . Определено в `nagivator.camera.MediaType` *(число)* 
    
        Camera.MediaType = {
        PICTURE: 0, / / разрешить выбор только сохраненных изображений. DEFAULT. Will return format specified via DestinationType
            VIDEO: 1,      // allow selection of video only, WILL ALWAYS RETURN FILE_URI
            ALLMEDIA : 2   // allow selection from all media types
        };
        

*   **correctOrientation**: вращает изображение, чтобы внести исправления к ориентации устройства во время захвата. *(Логический)*

*   **saveToPhotoAlbum**: сохранить изображение в фотоальбом на устройстве после захвата. *(Логический)*

*   **popoverOptions**: только для iOS параметры, которые определяют местоположение инструмента в iPad. Определены в`CameraPopoverOptions`.

*   **cameraDirection**: выбрать камеру для использования (передней или задней стороне). Значение по умолчанию — обратно. Определяется в `navigator.camera.Direction` *(число)*
    
        Camera.Direction = {обратно: 0, / / использовать обратно, стоящих перед камерой фронт: 1 / / использовать фронтальная камера};
        

### Особенности Amazon Fire OS

*   Любое значение `cameraDirection` возвращает фотографию сделанную задней камерой.

*   Игнорирует `allowEdit` параметр.

*   `Camera.PictureSourceType.PHOTOLIBRARY`и `Camera.PictureSourceType.SAVEDPHOTOALBUM` оба отображения же фотоальбом.

### Android причуды

*   Любой `cameraDirection` значение результатов на задней стороне фотографии.

*   Игнорирует параметр `allowEdit`.

*   Оба параметра `Camera.PictureSourceType.PHOTOLIBRARY` и `Camera.PictureSourceType.SAVEDPHOTOALBUM` отображают один и тот же фотоальбом.

### Особенности BlackBerry 10

*   Игнорирует `quality` параметр.

*   Игнорирует `allowEdit` параметр.

*   `Camera.MediaType`не поддерживается.

*   Игнорирует `correctOrientation` параметр.

*   Игнорирует `cameraDirection` параметр.

### Firefox OS причуды

*   Игнорирует `quality` параметр.

*   Значение `Camera.DestinationType` игнорируется и равно `1` (URI для файла изображения)

*   Игнорирует параметр `allowEdit`.

*   Игнорирует параметр `PictureSourceType` (пользователь выбирает его в диалоговом окне)

*   Игнорирует параметр `encodingType`

*   Игнорирует `targetWidth` и `targetHeight`

*   `Camera.MediaType` не поддерживается.

*   Игнорирует параметр `correctOrientation`.

*   Игнорирует параметр `cameraDirection`.

### Особенности iOS

*   Установите `quality` ниже 50, для того чтобы избежать ошибок памяти на некоторых устройствах.

*   При использовании `destinationType.FILE_URI` , фотографии сохраняются во временном каталоге приложения. Содержимое приложения временного каталога удаляется при завершении приложения.

### Особенности Tizen

*   options, не поддерживается

*   всегда возвращает URI файла

### Windows Phone 7 и 8 причуды

*   Игнорирует параметр `allowEdit`.

*   Игнорирует параметр `correctOrientation`.

*   Игнорирует параметр `cameraDirection`.

*   Игнорирует `saveToPhotoAlbum` параметр. Важно: Все изображения, снятые камерой wp7/8 cordova API всегда копируются в рулон камеры телефона. В зависимости от параметров пользователя это также может означать, что изображение автоматически загружены на их OneDrive. Потенциально это может означать, что этот образ доступен для более широкой аудитории, чем ваше приложение предназначено. Если этот блокатор для вашего приложения, вам нужно будет осуществить CameraCaptureTask, как описано на сайте msdn: <http://msdn.microsoft.com/en-us/library/windowsphone/develop/hh394006.aspx> вы можете также комментарий или вверх голосование связанный с этим вопрос [отслеживания][3]

*   Игнорирует `mediaType` свойство `cameraOptions` как Windows Phone SDK не обеспечивает способ выбора видео от PHOTOLIBRARY.

 [3]: https://issues.apache.org/jira/browse/CB-2083

## CameraError

Функция обратного вызова onError, который предоставляет сообщение об ошибке.

    function(message) {
        // Show a helpful message
    }
    

### Параметры

*   **message**: сообщение об ошибке предоставляемое платформой устройства. *(Строка)*

## cameraSuccess

onSuccess обратного вызова функция, которая предоставляет данные изображения.

    function(imageData) {
        // Do something with the image
    }
    

### Параметры

*   **imageData**: Данные изображения в Base64 кодировке, *или* URI, в зависимости от применяемых параметров `cameraOptions`. *(Строка)*

### Пример

    // Show image
    //
    function cameraCallback(imageData) {
        var image = document.getElementById('myImage');
        image.src = "data:image/jpeg;base64," + imageData;
    }
    

## CameraPopoverHandle

Дескриптор диалогового окна инструмента, созданного`navigator.camera.getPicture`.

### Методы

*   **setPosition**: Задайте положение инструмента выбора изображения.

### Поддерживаемые платформы

*   iOS

### setPosition

Задайте положение инструмента.

**Параметры**:

*   `cameraPopoverOptions`: Объект `CameraPopoverOptions`, определяющий новое положение

### Пример

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

только для iOS параметры, указывающие якорь элемент расположение и стрелкой направление инструмента при выборе изображений из библиотеки iPad или альбома.

    {x: 0, y: 32, ширина: 320, высота: 480, arrowDir: Camera.PopoverArrowDirection.ARROW_ANY};
    

### CameraPopoverOptions

*   **x**: x координата в пикселях элемента экрана, на котором закрепить инструмента. *(Число)*

*   **x**: y координата в пикселях элемента экрана, на котором закрепить инструмента. *(Число)*

*   **width**: ширина в пикселях элемента экрана, на котором закрепить инструмент выбора изображения. *(Число)*

*   **height**: высота в пикселях элемента экрана, на котором закрепить инструмент выбора изображения. *(Число)*

*   **arrowDir**: Направление, куда должна указывать стрелка на инструменте. Определено в `Camera.PopoverArrowDirection` *(число)*
    
            Camera.PopoverArrowDirection = {ARROW_UP: 1, / / матчи iOS UIPopoverArrowDirection константы ARROW_DOWN: 2, ARROW_LEFT: 4, ARROW_RIGHT: 8, ARROW_ANY: 15};
        

Обратите внимание, что размер инструмента может измениться для регулировки в направлении стрелки и ориентации экрана. Убедитесь в том, что для учета изменения ориентации при указании расположения элемента привязки.

## navigator.camera.cleanup

Удаляет промежуточные фотографии, снятые на камеру от временного хранения.

    navigator.camera.cleanup( cameraSuccess, cameraError );
    

### Описание

Удаляет промежуточные файлы изображений, которые хранятся в временного хранения после вызова метода `camera.getPicture` . Применяется только тогда, когда значение `Camera.sourceType` равно `Camera.PictureSourceType.CAMERA` и `Camera.destinationType` равно`Camera.DestinationType.FILE_URI`.

### Поддерживаемые платформы

*   iOS

### Пример

    navigator.camera.cleanup(onSuccess, onFail);
    
    function onSuccess() {
        console.log("Camera cleanup success.")
    }
    
    function onFail(message) {
        alert('Failed because: ' + message);
    }