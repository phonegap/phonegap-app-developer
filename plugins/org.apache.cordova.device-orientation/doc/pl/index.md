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

Ten plugin umożliwia dostęp do urządzenia kompas. Kompas jest czujnik, który wykrywa kierunek lub pozycji, że urządzenie jest wskazywany, zazwyczaj z górnej części urządzenia. Mierzy on nagłówek w stopniach od 0 do 359.99, gdzie 0 jest północ.

## Instalacji

    cordova plugin add org.apache.cordova.device-orientation
    

## Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   Przeglądarka
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 i 8 (jeśli jest dostępny w sprzęcie)
*   Windows 8

## Metody

*   navigator.compass.getCurrentHeading
*   navigator.compass.watchHeading
*   navigator.compass.clearWatch

## navigator.compass.getCurrentHeading

Uzyskać bieżącej pozycji kompas. Kompas pozycji jest zwracana za pośrednictwem `CompassHeading` obiektu przy użyciu `compassSuccess` funkcji wywołania zwrotnego.

    navigator.compass.getCurrentHeading (compassSuccess, compassError);
    

### Przykład

    function onSuccess(heading) {
        alert('Heading: ' + heading.magneticHeading);
    };
    
    function onError(error) {
        alert('CompassError: ' + error.code);
    };
    
    navigator.compass.getCurrentHeading(onSuccess, onError);
    

## navigator.compass.watchHeading

Pobiera bieżący nagłówek urządzenia w regularnych odstępach czasu. Za każdym razem jest źródło nagłówka, `headingSuccess` funkcja wywołania zwrotnego jest wykonywany.

Identyfikator zwrócony zegarek odwołuje interwał kompas zegarek. Oglądaj identyfikator może być używany z `navigator.compass.clearWatch` Aby przestać oglądać navigator.compass.

    var watchID = navigator.compass.watchHeading(compassSuccess, compassError, [compassOptions]);
    

`compassOptions`może zawierać następujące klucze:

*   **częstotliwość**: jak często pobrać kompas pozycji w milisekundach. *(Liczba)* (Domyślnie: 100)
*   **Filtr**: zmiana stopni wymagane zainicjować wywołania zwrotnego watchHeading sukces. Gdy ta wartość jest ustawiona, **częstotliwość** jest ignorowana. *(Liczba)*

### Przykład

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
    

### Quirks przeglądarki

Wartości dla bieżącej pozycji są losowo generowane w celu symulacji kompas.

### iOS dziwactwa

Tylko jeden `watchHeading` może być efekt w tym samym czasie w iOS. Jeśli `watchHeading` używa filtru, wywołanie `getCurrentHeading` lub `watchHeading` używa istniejących wartości filtru określić zmiany pozycji. Obserwując zmiany pozycji z filtrem jest bardziej efektywne niż z odstępach czasu.

### Amazon ogień OS dziwactwa

*   `filter`nie jest obsługiwane.

### Android dziwactwa

*   Brak wsparcia dla`filter`.

### Firefox OS dziwactwa

*   Brak wsparcia dla`filter`.

### Osobliwości Tizen

*   Brak wsparcia dla`filter`.

### Windows Phone 7 i 8 dziwactwa

*   Brak wsparcia dla`filter`.

## navigator.compass.clearWatch

Przestać oglądać określany przez parametr ID Zegarek kompas.

    navigator.compass.clearWatch(watchID);
    

*   **watchID**: Identyfikator zwrócony przez`navigator.compass.watchHeading`.

### Przykład

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    
    // ... later on ...
    
    navigator.compass.clearWatch(watchID);
    

## CompassHeading

A `CompassHeading` obiekt jest zwracany do `compassSuccess` funkcji wywołania zwrotnego.

### Właściwości

*   **magneticHeading**: pozycja w stopniach od 0-359.99 w jednym momencie. *(Liczba)*

*   **trueHeading**: nagłówek do geograficznego Bieguna Północnego w stopniu 0-359.99 w jednym momencie. Wartość ujemna wskazuje, że prawda pozycji nie może być ustalona. *(Liczba)*

*   **headingAccuracy**: odchylenie w stopniach między zgłoszonych pozycji i pozycji prawda. *(Liczba)*

*   **sygnatura czasowa**: czas, w którym pozycja ta została ustalona. *(w milisekundach)*

### Amazon ogień OS dziwactwa

*   `trueHeading`nie jest obsługiwane, ale raporty taką samą wartość jak`magneticHeading`

*   `headingAccuracy`jest zawsze 0, ponieważ nie ma żadnej różnicy między `magneticHeading` i`trueHeading`

### Android dziwactwa

*   `trueHeading`Właściwość nie jest obsługiwany, ale raporty taką samą wartość jak`magneticHeading`.

*   `headingAccuracy`Właściwość jest zawsze 0, ponieważ nie ma żadnej różnicy między `magneticHeading` i`trueHeading`.

### Firefox OS dziwactwa

*   `trueHeading`Właściwość nie jest obsługiwany, ale raporty taką samą wartość jak`magneticHeading`.

*   `headingAccuracy`Właściwość jest zawsze 0, ponieważ nie ma żadnej różnicy między `magneticHeading` i`trueHeading`.

### iOS dziwactwa

*   `trueHeading`Właściwość jest zwracana tylko dla lokalizacji usług włączone za pomocą`navigator.geolocation.watchLocation()`.

*   Urządzeń iOS 4 i powyżej pozycji czynniki w orientacji bieżącego urządzenia, a nie odwołuje się do pozycji absolutnej, dla aplikacji, które obsługuje tej orientacji.

## CompassError

A `CompassError` obiekt jest zwracany do `compassError` funkcji wywołania zwrotnego, gdy wystąpi błąd.

### Właściwości

*   **Kod**: jeden z kodów błędów wstępnie zdefiniowanych poniżej.

### Stałe

*   `CompassError.COMPASS_INTERNAL_ERR`
*   `CompassError.COMPASS_NOT_SUPPORTED`