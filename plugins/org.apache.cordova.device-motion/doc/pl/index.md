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

# org.apache.cordova.device-motion

Ten plugin umożliwia dostęp do akcelerometru. Akcelerometr jest czujnikiem ruchu, który wykrywa zmiany (*delta*) w ruchu względem bieżącej orientacji urządzenia, w trzech wymiarach na osi *x*, *y*i *z* .

## Instalacja

    cordova plugin add org.apache.cordova.device-motion
    

## Obsługiwane platformy

*   Amazon Fire OS
*   Android
*   BlackBerry 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 i 8
*   Windows 8

## Metody

*   navigator.accelerometer.getCurrentAcceleration
*   navigator.accelerometer.watchAcceleration
*   navigator.accelerometer.clearWatch

## Obiekty

*   Acceleration

## navigator.accelerometer.getCurrentAcceleration

Zwraca aktualne przyspieszenie wzdłuż osi *x*, *y* oraz *z*.

Wartości przyspieszeń są zwracane w argumencie funkcji `accelerometerSuccess`.

    navigator.accelerometer.getCurrentAcceleration(accelerometerSuccess, accelerometerError);
    

### Przykład

    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    };
    
    function onError() {
        alert('onError!');
    };
    
    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    

### Wyjątki iOS

*   W iOS nie wprowadzono możliwości zmierzenia aktualnego przyspieszenia w dowolnym punkcie.

*   Musisz obserwować przyspieszenie i odbierać wyniki w określonych odstępach czasu.

*   Podsumowując, funkcja `getCurrentAcceleration` zwraca ostatnią wartość zgłoszoną przez wywołanie `watchAccelerometer`.

## navigator.accelerometer.watchAcceleration

Pobiera aktualny obiekt `Acceleration` w regularnych odstępach czasu, za każdym razem wywołując funkcję zwrotną `accelerometerSuccess`. Interwał jest określony w milisekundach w parametrze `frequency` obiektu `acceleratorOptions`.

Zwracane watch ID jest odniesieniem do obserwacji akcelerometru i może być użyty w `navigator.accelerometer.clearWatch` do zatrzymania tego procesu.

    var watchID = navigator.accelerometer.watchAcceleration(accelerometerSuccess,
                                                           accelerometerError,
                                                           [accelerometerOptions]);
    

*   **accelerometerOptions**: Obiekt z następującymi opcjonalnymi kluczami: 
    *   **frequency**: Jak często pozyskiwane będą dane z `Acceleration` w milisekundach. *(Number)* (Domyślnie: 10000)

### Przykład

    function onSuccess(acceleration) {
        alert('Acceleration X: ' + acceleration.x + '\n' +
              'Acceleration Y: ' + acceleration.y + '\n' +
              'Acceleration Z: ' + acceleration.z + '\n' +
              'Timestamp: '      + acceleration.timestamp + '\n');
    };
    
    function onError() {
        alert('onError!');
    };
    
    var options = { frequency: 3000 };  // Update every 3 seconds
    
    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    

### Wyjątki iOS

API wywołuje funkcję zwrotną success w żądanym przedziale czasowym, zakres żądania do urządzenia jest ograniczony przedziałem od 40ms do 1000ms. Dla przykładu, jeśli żądasz 3 sekundowy przedział (3000ms), API pobierze dane z urządzenia co 1 sekundę, ale wykona funkcję zwrotną success co każde 3 sekundy.

## navigator.accelerometer.clearWatch

Przestaje obserwować `Acceleration` odnoszące się do parametru `watchID`.

    navigator.accelerometer.clearWatch(watchID);
    

*   **watchID**: Identyfikator zwrócony przez `navigator.accelerometer.watchAcceleration`.

### Przykład

    var watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, options);
    
    // ... later on ...
    
    navigator.accelerometer.clearWatch(watchID);
    

## Acceleration

Zawiera przechwycone w danej chwili dane z `akcelerometru`. Wartości przyśpieszenia to efekt grawitacji (9.81 m/s ^ 2), tak, że kiedy urządzenie znajduje się w pozycji na płask i w górę, *x*, *y*, i *z* wartości zwracane powinny być `` , `` , i`9.81`.

### Właściwości

*   **x**: Wartość przyśpieszenia na osi x. (w m/s^2) *(Liczba)*
*   **y**: Wartość przyśpieszenia na osi y. (w m/s^2) *(Liczba)*
*   **z**: Wartość przyśpieszenia na osi z. (w m/s^2) *(Liczba)*
*   **timestamp**: Znacznik czasu w milisekundach. *(DOMTimeStamp)*