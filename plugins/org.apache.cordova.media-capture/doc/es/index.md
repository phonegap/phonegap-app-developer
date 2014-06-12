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

Este plugin proporciona acceso a audio, imagen y las capacidades de captura de vídeo del dispositivo.

**ADVERTENCIA**: recopilación y uso de imágenes, video o audio desde el micrófono o cámara del dispositivo plantea cuestiones de privacidad importante. Política de privacidad de su aplicación debe discutir cómo la aplicación utiliza dichos sensores y si los datos registrados se compartieron con cualquiera de las partes. Además, si el uso de la aplicación de la cámara o el micrófono no es aparente en la interfaz de usuario, debe proporcionar un aviso de just-in-time antes de la aplicación tiene acceso a la cámara o el micrófono (si el sistema operativo del dispositivo ya no hacerlo). Que el aviso debe proporcionar la misma información mencionada, además de obtener un permiso del usuario (por ejemplo, presentando opciones para **Aceptar** y **No gracias**). Tenga en cuenta que algunos mercados de aplicación pueden requerir su aplicación para proporcionar aviso just-in-time y obtener permiso del usuario antes de acceder a la cámara o el micrófono. Para obtener más información, por favor consulte a la guía de privacidad.

## Instalación

    cordova plugin add org.apache.cordova.media-capture
    

## Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

## Objetos

*   Captura
*   CaptureAudioOptions
*   CaptureImageOptions
*   CaptureVideoOptions
*   CaptureCallback
*   CaptureErrorCB
*   ConfigurationData
*   MediaFile
*   MediaFileData

## Métodos

*   capture.captureAudio
*   capture.captureImage
*   capture.captureVideo
*   MediaFile.getFormatData

## Propiedades

*   **supportedAudioModes**: la grabación de formatos soportados por el dispositivo de audio. (ConfigurationData[])

*   **supportedImageModes**: los tamaños de imagen de grabación y formatos soportados por el dispositivo. (ConfigurationData[])

*   **supportedVideoModes**: las resoluciones de grabación de vídeo y formatos soportados por el dispositivo. (ConfigurationData[])

## capture.captureAudio

> Iniciar la aplicación grabadora de audio y devolver información acerca de los archivos capturados clip de audio.

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );
    

### Descripción

Inicia una operación asincrónica para capturar grabaciones de audio mediante la aplicación de grabación de audio del dispositivo por defecto. La operación permite al usuario del dispositivo capturar varias grabaciones en una sola sesión.

La operación de captura termina cuando el usuario sale del audio grabación de aplicación, o el número máximo de registros especificado por `CaptureAudioOptions.limit` se alcanza. Si no `limit` se especifica el valor del parámetro, el valor predeterminado es de un (1), y la operación de captura termina después de que el usuario registra un solo clip de audio.

Cuando finaliza la operación de captura, el `CaptureCallback` se ejecuta con una gran variedad de `MediaFile` objetos describiendo cada uno capturado archivo del clip de audio. Si el usuario finaliza la operación antes de un clip de audio es capturado, el `CaptureErrorCallback` se ejecuta con un `CaptureError` de objetos, con el `CaptureError.CAPTURE_NO_MEDIA_FILES` código de error.

### Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

### Ejemplo

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
    

### iOS rarezas

*   iOS no tiene una aplicación de grabación de audio predeterminada, así se proporciona una sencilla interfaz de usuario.

### Windows Phone 7 y 8 rarezas

*   Windows Phone 7 no tiene una aplicación de grabación de audio predeterminada, así se proporciona una sencilla interfaz de usuario.

## CaptureAudioOptions

> Encapsula las opciones de configuración de captura de audio.

### Propiedades

*   **límite**: el número máximo de clips de audio del usuario del dispositivo puede grabar en una operación de captura individual. El valor debe ser mayor o igual a 1 (por defecto 1).

*   **duración**: la duración máxima de un clip de sonido audio, en segundos.

### Ejemplo

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };
    
    navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    

### Amazon fuego OS rarezas

*   El `duration` no se admite el parámetro. Longitudes de la grabación no puede limitarse mediante programación.

### Rarezas Android

*   El `duration` no se admite el parámetro. Longitudes de la grabación no puede limitarse mediante programación.

### BlackBerry 10 rarezas

*   El `duration` no se admite el parámetro. Longitudes de la grabación no puede limitarse mediante programación.
*   El `limit` no se admite el parámetro, tan sólo una grabación puede crearse para cada invocación.

### iOS rarezas

*   El `limit` no se admite el parámetro, tan sólo una grabación puede crearse para cada invocación.

## capture.captureImage

> Iniciar una aplicación de cámara y devolver información acerca de los archivos de imagen capturada.

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );
    

### Descripción

Inicia una operación asincrónica para capturar imágenes utilizando la aplicación de la cámara del dispositivo. La operación permite a los usuarios capturar más de una imagen en una sola sesión.

La operación de captura tampoco termina cuando el usuario cierra una aplicación de cámara, o el número máximo de registros especificado por `CaptureAudioOptions.limit` se alcanza. Si no `limit` se especifica el valor por defecto a uno (1) y termina la operación de captura después de que el usuario capta una sola imagen.

Cuando finaliza la operación de captura, invoca la `CaptureCB` "callback" con una gran variedad de `MediaFile` objetos que describen cada archivo de imagen capturada. Si el usuario finaliza la operación antes de capturar una imagen, la `CaptureErrorCB` devolución de llamada se ejecuta con un `CaptureError` objeto ofrece un `CaptureError.CAPTURE_NO_MEDIA_FILES` código de error.

### Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

### Windows Phone 7 rarezas

Invocando la aplicación de cámara nativa mientras el dispositivo está conectado vía Zune no funciona, y se ejecuta el callback de error.

### Ejemplo

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

> Encapsula las opciones de configuración de captura de imagen.

### Propiedades

*   **límite**: el número máximo de imágenes que el usuario puede capturar en una operación de captura individual. El valor debe ser mayor o igual a 1 (por defecto 1).

### Ejemplo

    // limit capture operation to 3 images
    var options = { limit: 3 };
    
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
    

### iOS rarezas

*   No se admite el parámetro **límite** , y sólo una imagen es tomada por invocación.

## capture.captureVideo

> Iniciar la aplicación grabadora de vídeo y devolver información acerca de archivos de vídeo capturado.

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );
    

### Descripción

Inicia una operación asincrónica para capturar video grabaciones mediante aplicación de grabación de vídeo del dispositivo. La operación permite al usuario capturar grabaciones de más de una en una sola sesión.

La operación de captura termina cuando el usuario sale de la aplicación de grabación de vídeo, o el número máximo de registros especificado por `CaptureVideoOptions.limit` se alcanza. Si no `limit` se especifica el valor del parámetro, por defecto a uno (1), y la operación de captura termina después de que el usuario registra un solo clip de video.

Cuando finaliza la operación de captura, es la `CaptureCB` devolución de llamada se ejecuta con una gran variedad de `MediaFile` objetos describiendo cada uno capturado archivo de videoclip. Si el usuario finaliza la operación antes de capturar un clip de vídeo, el `CaptureErrorCB` devolución de llamada se ejecuta con un `CaptureError` objeto ofrece un `CaptureError.CAPTURE_NO_MEDIA_FILES` código de error.

### Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

### Ejemplo

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
    

### BlackBerry 10 rarezas

*   Cordova para BlackBerry 10 intentos iniciar la aplicación **Grabadora de Video** , proporcionada por RIM, para capturar las grabaciones de vídeo. La aplicación recibe una `CaptureError.CAPTURE_NOT_SUPPORTED` código de error si la aplicación no está instalada en el dispositivo.

## CaptureVideoOptions

> Encapsula las opciones de configuración de captura de vídeo.

### Propiedades

*   **límite**: la cantidad máxima de usuario del dispositivo puede capturar en una operación sola captura clips de vídeo. El valor debe ser mayor o igual a 1 (por defecto 1).

*   **duración**: la duración máxima de un clip de vídeo, en segundos.

### Ejemplo

    // limit capture operation to 3 video clips
    var options = { limit: 3 };
    
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    

### BlackBerry 10 rarezas

*   No se admite el parámetro de **duración** , así que la longitud de las grabaciones no puede limitarse mediante programación.

### iOS rarezas

*   No se admite el parámetro **límite** . Sólo un vídeo se graba por invocación.

## CaptureCB

> Se invoca en una operación de captura exitosa de los medios de comunicación.

    function captureSuccess( MediaFile[] mediaFiles ) { ... };
    

### Descripción

Esta función se ejecuta después de que finalice una operación de captura exitosa. En este punto que ha sido capturado un archivo multimedia y tampoco el usuario ha salido de la aplicación de captura de los medios de comunicación, o se ha alcanzado el límite de captura.

Cada `MediaFile` objeto describe un archivo multimedia capturado.

### Ejemplo

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    

## CaptureError

> Encapsula el código de error resultante de una operación de captura de medios fallidos.

### Propiedades

*   **código**: uno de los códigos de error previamente definidos a continuación.

### Constantes

*   `CaptureError.CAPTURE_INTERNAL_ERR`: La cámara o el micrófono no pudo capturar la imagen y el sonido.

*   `CaptureError.CAPTURE_APPLICATION_BUSY`: La aplicación de captura de audio o cámara está cumpliendo otro pedido de captura.

*   `CaptureError.CAPTURE_INVALID_ARGUMENT`: Uso no válido de la API (por ejemplo, el valor de `limit` es menor que uno).

*   `CaptureError.CAPTURE_NO_MEDIA_FILES`: El usuario sale de la aplicación de captura de audio o cámara antes de capturar cualquier cosa.

*   `CaptureError.CAPTURE_NOT_SUPPORTED`: La operación de captura solicitada no es compatible.

## CaptureErrorCB

> Se invoca si se produce un error durante una operación de captura de los medios de comunicación.

    function captureError( CaptureError error ) { ... };
    

### Descripción

Esta función se ejecuta si se produce un error al intentar lanzar un medio de captura de operación. Escenarios de fallas incluyen cuando la solicitud de captura está ocupada, una operación de captura ya está llevando a cabo o el usuario cancela la operación antes de que los archivos de los medios de comunicación son capturados.

Esta función se ejecuta con un `CaptureError` objeto que contiene un error apropiado`code`.

### Ejemplo

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    

## ConfigurationData

> Encapsula un conjunto de parámetros de captura de los medios de comunicación un dispositivo compatible.

### Descripción

Describe los modos de captura de los medios de comunicación soportados por el dispositivo. Los datos de configuración incluyen el tipo MIME y captura de dimensiones para captura de vídeo o imagen.

Los tipos MIME deben adherirse a [RFC2046][1]. Ejemplos:

 [1]: http://www.ietf.org/rfc/rfc2046.txt

*   `video/3gpp`
*   `video/quicktime`
*   `image/jpeg`
*   `audio/amr`
*   `audio/wav`

### Propiedades

*   **tipo**: cadena codificada en el ASCII en minúsculas que representa el tipo de medios de comunicación. (DOMString)

*   **altura**: la altura de la imagen o vídeo en píxeles. El valor es cero para clips de sonido. (Número)

*   **ancho**: el ancho de la imagen o vídeo en píxeles. El valor es cero para clips de sonido. (Número)

### Ejemplo

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
    

No compatible con cualquier plataforma. Todas las matrices de datos configuración están vacías.

## MediaFile.getFormatData

> El formato recupera información sobre el archivo de captura de los medios de comunicación.

    mediaFile.getFormatData(
        MediaFileDataSuccessCB successCallback,
        [MediaFileDataErrorCB errorCallback]
    );
    

### Descripción

Esta función asincrónica intentará recuperar la información de formato para el archivo de los medios de comunicación. Si exitoso, invoca la `MediaFileDataSuccessCB` devolución de llamada con un `MediaFileData` objeto. Si fracasa el intento, esta función invoca el `MediaFileDataErrorCB` "callback".

### Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

### Amazon fuego OS rarezas

La API de acceso a la prensa archivo formato información es limitada, así que no todos `MediaFileData` se admiten las propiedades.

### BlackBerry 10 rarezas

No proporciona una API para obtener información sobre los archivos de medios, para que todos `MediaFileData` devolver objetos con valores predeterminados.

### Rarezas Android

La API de acceso a la prensa archivo formato información es limitada, así que no todos `MediaFileData` se admiten las propiedades.

### iOS rarezas

La API de acceso a la prensa archivo formato información es limitada, así que no todos `MediaFileData` se admiten las propiedades.

## MediaFile

> Encapsula las propiedades de un archivo de captura de los medios de comunicación.

### Propiedades

*   **nombre**: el nombre del archivo, sin información de la ruta. (DOMString)

*   **fullPath**: la ruta de acceso completa del archivo, incluyendo el nombre. (DOMString)

*   **tipo**: tipo mime del archivo (DOMString)

*   **lastModifiedDate**: la fecha y hora cuando el archivo se modificó por última vez. (Fecha)

*   **tamaño**: el tamaño del archivo, en bytes. (Número)

### Métodos

*   **MediaFile.getFormatData**: recupera la información del formato del archivo de los medios de comunicación.

## MediaFileData

> Encapsula la información de formato de un archivo multimedia.

### Propiedades

*   **codecs**: el actual formato de los contenidos de audio y video. (DOMString)

*   **bitrate**: el bitrate promedio del contenido. El valor es cero para las imágenes. (Número)

*   **altura**: la altura de la imagen o vídeo en píxeles. El valor es cero para los clips de audio. (Número)

*   **ancho**: el ancho de la imagen o vídeo en píxeles. El valor es cero para los clips de audio. (Número)

*   **duración**: la longitud del clip de vídeo o de sonido en segundos. El valor es cero para las imágenes. (Número)

### BlackBerry 10 rarezas

Ninguna API proporciona información de formato para archivos de medios, así que el `MediaFileData` objeto devuelto por `MediaFile.getFormatData` cuenta con los siguientes valores predeterminados:

*   **codecs**: no soportado y devuelve`null`.

*   **bitrate**: no soportado y devuelve el valor cero.

*   **altura**: no soportado y devuelve el valor cero.

*   **anchura**: no soportado y devuelve el valor cero.

*   **duración**: no soportado y devuelve el valor cero.

### Amazon fuego OS rarezas

Es compatible con los siguientes `MediaFileData` Propiedades:

*   **codecs**: no soportado y devuelve`null`.

*   **bitrate**: no soportado y devuelve el valor cero.

*   **altura**: apoyado: sólo los archivos de imagen y video.

*   **anchura**: admite: sólo los archivos de imagen y video.

*   **duración**: apoyado: archivos audio y video

### Rarezas Android

Es compatible con los siguientes `MediaFileData` Propiedades:

*   **codecs**: no soportado y devuelve`null`.

*   **bitrate**: no soportado y devuelve el valor cero.

*   **altura**: apoyado: sólo los archivos de imagen y video.

*   **anchura**: admite: sólo los archivos de imagen y video.

*   **duración**: apoyado: archivos audio y video.

### iOS rarezas

Es compatible con los siguientes `MediaFileData` Propiedades:

*   **codecs**: no soportado y devuelve`null`.

*   **bitrate**: compatible con iOS4 dispositivos de audio solamente. Devuelve cero para imágenes y vídeos.

*   **altura**: apoyado: sólo los archivos de imagen y video.

*   **anchura**: admite: sólo los archivos de imagen y video.

*   **duración**: apoyado: archivos audio y video.