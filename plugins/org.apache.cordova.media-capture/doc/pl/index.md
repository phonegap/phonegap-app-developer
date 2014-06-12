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

Ten plugin umożliwia dostęp do urządzenia dźwięku, obrazu i możliwości przechwytywania wideo.

**Ostrzeżenie**: zbierania i wykorzystywania zdjęć, wideo lub audio z urządzenia kamery lub mikrofonu podnosi kwestie prywatności ważne. Polityka prywatności danej aplikacji należy Dyskutować, jak aplikacja używa takich czujników i czy dane zapisane jest współużytkowany z innymi stronami. Ponadto jeśli aplikacji wykorzystanie kamery lub mikrofonu nie jest widoczne w interfejsie użytkownika, powinny zapewnić just-in czas wypowiedzenia przed aplikacji dostęp do kamery lub mikrofonu (jeśli urządzenie system operacyjny nie robi już). Że ogłoszenie powinno zawierać te same informacje, o których wspomniano powyżej, jak również uzyskanie uprawnienia użytkownika (np. poprzez przedstawianie wyborów **OK** i **Nie dzięki**). Należy pamiętać, że niektóre platformy aplikacji może wymagać aplikacji powiadomienia just-in-time oraz uzyskania zgody użytkownika przed dostęp do kamery lub mikrofonu. Aby uzyskać więcej informacji zobacz przewodnik prywatności.

## Instalacji

    cordova plugin add org.apache.cordova.media-capture
    

## Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

## Obiekty

*   Przechwytywania
*   CaptureAudioOptions
*   CaptureImageOptions
*   CaptureVideoOptions
*   CaptureCallback
*   CaptureErrorCB
*   ConfigurationData
*   MediaFile
*   MediaFileData

## Metody

*   capture.captureAudio
*   capture.captureImage
*   capture.captureVideo
*   MediaFile.getFormatData

## Właściwości

*   **supportedAudioModes**: nagranie formatów obsługiwanych przez urządzenie. (ConfigurationData[])

*   **supportedImageModes**: nagrywanie obrazu rozmiarów i formatów obsługiwanych przez urządzenie. (ConfigurationData[])

*   **supportedVideoModes**: rozdzielczości nagrywania i formatów obsługiwanych przez urządzenie. (ConfigurationData[])

## capture.captureAudio

> Uruchom aplikację rejestrator audio i zwraca informacje o przechwyconych klip audio pliki.

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );
    

### Opis

Rozpoczyna operację asynchroniczną do przechwytywania audio nagrania za pomocą urządzenia domyślnej aplikacji do nagrywania dźwięku. Operacja pozwala uchwycić wiele nagrań w jednej sesji użytkownika urządzenia.

Operacji przechwytywania kończy się, gdy użytkownik zamyka nagranie aplikacji, lub maksymalną liczbę nagrań, określony przez `CaptureAudioOptions.limit` jest osiągnięty. Jeśli nie `limit` wartość parametru jest określony, domyślnie do jednego (1), i operacji przechwytywania kończy po użytkownik rejestruje pojedynczy klip audio.

Po zakończeniu operacji przechwytywania, `CaptureCallback` wykonuje z tablicą `MediaFile` obiekty opisujące Każdy złapany plików audio, wideo. Jeśli użytkownik kończy działanie przed klipu audio jest zrobione, `CaptureErrorCallback` wykonuje z `CaptureError` obiekt, dysponujący `CaptureError.CAPTURE_NO_MEDIA_FILES` kod błędu.

### Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

### Przykład

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
    

### iOS dziwactwa

*   iOS nie ma domyślnej aplikacji do nagrywania dźwięku, więc podano pewien prosty użytkownik złącze standardowe.

### Windows Phone 7 i 8 dziwactwa

*   Windows Phone 7 nie ma domyślnej aplikacji do nagrywania dźwięku, więc pewien prosty użytkownik złącze standardowe jest dostarczone.

## CaptureAudioOptions

> Zawiera opcje konfiguracji przechwytywania dźwięku.

### Właściwości

*   **Limit**: Maksymalna liczba klipów audio nagrywać w operacji przechwytywania pojedynczego użytkownika urządzenia. Wartość musi być większa lub równa 1 (domyślnie 1).

*   **czas trwania**: maksymalny czas trwania klipu audio dźwięku, w kilka sekund.

### Przykład

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };
    
    navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    

### Amazon ogień OS dziwactwa

*   `duration`Parametr nie jest obsługiwana. Zapis długości nie może być ograniczony programowo.

### Android dziwactwa

*   `duration`Parametr nie jest obsługiwana. Zapis długości nie może być ograniczony programowo.

### Jeżyna 10 dziwactwa

*   `duration`Parametr nie jest obsługiwana. Zapis długości nie może być ograniczony programowo.
*   `limit`Parametr nie jest obsługiwana, więc tylko jednego nagrania mogą być tworzone dla każdego wywołania.

### iOS dziwactwa

*   `limit`Parametr nie jest obsługiwana, więc tylko jednego nagrania mogą być tworzone dla każdego wywołania.

## capture.captureImage

> Uruchom aplikację aparatu i zwraca informacje o przechwyconych obrazów.

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );
    

### Opis

Rozpoczyna operację asynchroniczną do przechwytywania obrazów przy użyciu urządzenia aparatu. Operacja pozwala użytkownik wobec zawładnięcie więcej niż jeden obraz w jednej sesji.

Operacji przechwytywania kończy albo, gdy użytkownik zamyka aparat aplikacji, lub maksymalną liczbę nagrań określony przez `CaptureAudioOptions.limit` jest osiągnięty. Jeśli nie `limit` wartość jest określona, domyślnie jest to jeden (1) i operacji przechwytywania kończy po użytkownika przechwytuje obraz pojedynczy.

Po zakończeniu operacji przechwytywania, wywołuje `CaptureCB` wywołania zwrotnego z tablicą `MediaFile` obiekty opisujące każdy plik przechwyconego obrazu. Jeśli użytkownik kończy operację przed zrobieniem zdjęcia, `CaptureErrorCB` wykonuje wywołanie zwrotne z `CaptureError` obiekt oferujący `CaptureError.CAPTURE_NO_MEDIA_FILES` kod błędu.

### Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

### Windows Phone 7 dziwactwa

Wywoływanie aparat native aplikacji, podczas gdy urządzenie jest podłączone przez Zune nie dziala, i wykonuje błąd wywołania zwrotnego.

### Przykład

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

> Zawiera opcje konfiguracji przechwytywania obrazu.

### Właściwości

*   **Limit**: Maksymalna liczba zdjęć, użytkownik puszka metalowa zawładnięcie w operacji przechwytywania pojedynczego. Wartość musi być większa lub równa 1 (domyślnie 1).

### Przykład

    // limit capture operation to 3 images
    var options = { limit: 3 };
    
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
    

### iOS dziwactwa

*   Parametr **limit** nie jest obsługiwane, i tylko jeden obraz jest podejmowana na wywołanie.

## capture.captureVideo

> Uruchom aplikację rejestrator wideo i zwraca informacje o przechwyconych wideo akta.

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );
    

### Opis

Rozpoczyna operację asynchroniczną do przechwytywania nagrania wideo za pomocą urządzenia wideo notujący zgłoszenie. Operacja pozwala użytkownik wobec zawładnięcie więcej niż jednego nagrania w pojedynczej sesji.

Operacji przechwytywania kończy się, gdy użytkownik zamyka aplikacji nagrywania wideo, lub maksymalną liczbę nagrań, określony przez `CaptureVideoOptions.limit` jest osiągnięty. Jeśli nie `limit` wartość parametru jest określony, domyślnie do jednego (1) i operacji przechwytywania kończy po użytkownika rekordy jednego klipu wideo.

Po zakończeniu operacji przechwytywania, to `CaptureCB` wykonuje wywołanie zwrotne z tablicą `MediaFile` obiekty opisujące Każdy złapany pliku wideo. Jeśli użytkownik kończy operację przed przechwytywania wideo, `CaptureErrorCB` wykonuje wywołanie zwrotne z `CaptureError` obiekt oferujący `CaptureError.CAPTURE_NO_MEDIA_FILES` kod błędu.

### Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

### Przykład

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
    

### Jeżyna 10 dziwactwa

*   Cordova dla BlackBerry 10 próbuje uruchomić wniosku **Rejestrator wideo** dostarczone przez RIM, przechwytywanie nagrań wideo. Aplikacja otrzymuje `CaptureError.CAPTURE_NOT_SUPPORTED` kod błędu, jeśli aplikacja nie jest zainstalowana na urządzeniu.

## CaptureVideoOptions

> Zawiera opcje konfiguracji przechwytywania wideo.

### Właściwości

*   **Limit**: Maksymalna liczba klipów wideo urządzenia użytkownik puszka metalowa zawładnięcie w operacji przechwytywania pojedynczego. Wartość musi być większa lub równa 1 (domyślnie 1).

*   **czas trwania**: maksymalny czas trwania klipu wideo w kilka sekund.

### Przykład

    // limit capture operation to 3 video clips
    var options = { limit: 3 };
    
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    

### Jeżyna 10 dziwactwa

*   **Czas trwania** parametr nie jest obsługiwana, więc długość nagrania nie może być ograniczony programowo.

### iOS dziwactwa

*   Parametr **limit** nie jest obsługiwane. Tylko jeden film jest nagrany na wywołanie.

## CaptureCB

> Wywoływane po operacji przechwytywania mediów sukces.

    function captureSuccess( MediaFile[] mediaFiles ) { ... };
    

### Opis

Ta funkcja wykonuje się po zakończeniu operacji wychwytywania sukces. W tym momencie plik multimedialny został złapany, a następnie użytkownik ma zakończony aplikacji przechwytywania mediów, czy osiągnięto limit przechwytywania.

Każdy `MediaFile` obiektu opisuje plik multimedialny przechwycone.

### Przykład

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    

## CaptureError

> Hermetyzuje kod błędów wynikających z operacji przechwytywania mediów nie powiodło się.

### Właściwości

*   **Kod**: jeden z kodów błędów wstępnie zdefiniowanych poniżej.

### Stałe

*   `CaptureError.CAPTURE_INTERNAL_ERR`: Kamery lub mikrofonu udało się przechwycić obraz lub dźwięk.

*   `CaptureError.CAPTURE_APPLICATION_BUSY`: Aplikacji przechwytywania kamery lub audio jest aktualnie obsługujący wniosek innego przechwytywania.

*   `CaptureError.CAPTURE_INVALID_ARGUMENT`: Nieprawidłowe użycie interfejsu API (np. wartości `limit` jest mniej niż jeden).

*   `CaptureError.CAPTURE_NO_MEDIA_FILES`: Użytkownik zamyka aparat fotograficzny lub audio aplikacji przechwytywania przed zrobieniem czegokolwiek.

*   `CaptureError.CAPTURE_NOT_SUPPORTED`: Przechwytywania Żądana operacja nie jest obsługiwana.

## CaptureErrorCB

> Wywołany, jeśli wystąpi błąd podczas operacji przechwytywania mediów.

    function captureError( CaptureError error ) { ... };
    

### Opis

Ta funkcja wykonuje, jeśli wystąpi błąd, gdy próbuje uruchomić nośnik przechwytywania operacji. Brak scenariusze podczas aplikacji przechwytywania jest zajęty, operacji przechwytywania jest już miejsce, lub użytkownik nie anuluje operację zanim jakiekolwiek pliki multimedialne są przechwytywane.

Ta funkcja wykonuje z `CaptureError` obiekt zawierający odpowiedni błąd`code`.

### Przykład

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    

## ConfigurationData

> Hermetyzuje zestaw parametrów przechwytywania mediów, które urządzenie obsługuje.

### Opis

W tym artykule opisano tryby przechwytywania mediów obsługiwane przez urządzenie. Dane konfiguracji zawiera typ MIME i przechwytywania wymiary do przechwytywania wideo lub obraz.

Typy MIME powinno stosować się do [RFC2046][1]. Przykłady:

 [1]: http://www.ietf.org/rfc/rfc2046.txt

*   `video/3gpp`
*   `video/quicktime`
*   `image/jpeg`
*   `audio/amr`
*   `audio/wav`

### Właściwości

*   **Typ**: The ASCII algorytmem małe ciąg reprezentujący typ nośnika. (DOMString)

*   **wysokość**: wysokość obrazu lub wideo w pikselach. Wartość wynosi zero dla klipy dźwiękowe. (Liczba)

*   **szerokość**: szerokość obrazu lub wideo w pikselach. Wartość wynosi zero dla klipy dźwiękowe. (Liczba)

### Przykład

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
    

Nie obsługiwane przez każdą platformę. Wszystkie tablice danych konfiguracji są puste.

## MediaFile.getFormatData

> Pobiera formatu informacji o pliku przechwytywania mediów.

    mediaFile.getFormatData(
        MediaFileDataSuccessCB successCallback,
        [MediaFileDataErrorCB errorCallback]
    );
    

### Opis

Ta funkcja asynchronicznie podejmie próby pobrania informacji o formacie plik multimedialny. Jeśli powołuje udane, `MediaFileDataSuccessCB` wywołania zwrotnego z `MediaFileData` obiektu. Jeżeli próba nie powiedzie się, funkcja ta wywołuje `MediaFileDataErrorCB` wywołania zwrotnego.

### Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

### Amazon ogień OS dziwactwa

Ten API wobec dostęp do mediów informacji o formacie pliku jest ograniczona, więc nie wszystkie `MediaFileData` są obsługiwane właściwości.

### Jeżyna 10 dziwactwa

Nie dostarcza API dla informacji na temat plików multimedialnych, więc wszystkie `MediaFileData` obiektów zwrotu z wartości domyślnych.

### Android dziwactwa

Ten API wobec dostęp do mediów informacji o formacie pliku jest ograniczona, więc nie wszystkie `MediaFileData` są obsługiwane właściwości.

### iOS dziwactwa

Ten API wobec dostęp do mediów informacji o formacie pliku jest ograniczona, więc nie wszystkie `MediaFileData` są obsługiwane właściwości.

## MediaFile

> Hermetyzuje właściwości pliku przechwytywania mediów.

### Właściwości

*   **Nazwa**: Nazwa pliku, bez informacji o ścieżce. (DOMString)

*   **fullPath**: pełną ścieżkę pliku, łącznie z nazwą. (DOMString)

*   **Typ**: Typ mime pliku (DOMString)

*   **Data ostatniej modyfikacji**: data i czas ostatniej modyfikacji pliku. (Data)

*   **rozmiar**: wielkość pliku w bajtach. (Liczba)

### Metody

*   **MediaFile.getFormatData**: pobiera informacje o formatach plików multimedialnych.

## MediaFileData

> Hermetyzuje informacje formatu pliku multimedialnego.

### Właściwości

*   **kodery-dekodery**: format rzeczywista zawartość audio i wideo. (DOMString)

*   **bitrate**: średnia szybkość transmisji bitów zawartości. Wartość wynosi zero dla obrazów. (Liczba)

*   **wysokość**: wysokość obrazu lub wideo w pikselach. Wartość wynosi zero dla klipów audio. (Liczba)

*   **szerokość**: szerokość obrazu lub wideo w pikselach. Wartość wynosi zero dla klipów audio. (Liczba)

*   **czas trwania**: długość dźwięku lub wideo klip w kilka sekund. Wartość wynosi zero dla obrazów. (Liczba)

### Jeżyna 10 dziwactwa

Nie API zapewnia informacje o formatach plików multimedialnych, więc `MediaFileData` Obiekt zwrócony przez `MediaFile.getFormatData` oferuje następujące wartości domyślne:

*   **kodery-dekodery**: nie obsługiwane i zwraca`null`.

*   **bitrate**: nie obsługiwane i zwraca zero.

*   **wysokość**: nie obsługiwane i zwraca zero.

*   **szerokość**: nie obsługiwane i zwraca zero.

*   **czas trwania**: nie obsługiwane i zwraca zero.

### Amazon ogień OS dziwactwa

Obsługuje następujące `MediaFileData` Właściwości:

*   **kodery-dekodery**: nie obsługiwane i zwraca`null`.

*   **bitrate**: nie obsługiwane i zwraca zero.

*   **wysokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **szerokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **czas trwania**: obsługiwane: audio i wideo tylko pliki

### Android dziwactwa

Obsługuje następujące `MediaFileData` Właściwości:

*   **kodery-dekodery**: nie obsługiwane i zwraca`null`.

*   **bitrate**: nie obsługiwane i zwraca zero.

*   **wysokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **szerokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **czas trwania**: obsługiwane: audio i wideo tylko pliki.

### iOS dziwactwa

Obsługuje następujące `MediaFileData` Właściwości:

*   **kodery-dekodery**: nie obsługiwane i zwraca`null`.

*   **bitrate**: obsługiwane na iOS4 urządzeń audio tylko. Zwraca wartość zero dla zdjęć i filmów.

*   **wysokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **szerokość**: obsługiwane: tylko pliki obrazów i wideo.

*   **czas trwania**: obsługiwane: audio i wideo tylko pliki.