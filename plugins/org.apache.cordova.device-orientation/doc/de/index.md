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

Dieses Plugin ermöglicht den Zugriff auf das Gerät Kompass. Der Kompass ist ein Sensor, der erkennt die Richtung oder Position, dass das Gerät in der Regel von der Oberseite des Geräts gezeigt wird. Er misst die Überschrift im Grad von 0 bis 359.99, 0 wo Norden ist.

## Installation

    cordova plugin add org.apache.cordova.device-orientation
    

## Unterstützte Plattformen

*   Amazon Fire OS
*   Android
*   BlackBerry 10
*   Browser
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 und 8 (falls verfügbar in Hardware)
*   Windows 8

## Methoden

*   navigator.compass.getCurrentHeading
*   navigator.compass.watchHeading
*   navigator.compass.clearWatch

## navigator.compass.getCurrentHeading

Erhalten Sie aktuelle Kompassrichtung. Die Kompassrichtung wird zurückgegeben, über ein `CompassHeading` -Objekt unter Verwendung der `compassSuccess` Callback-Funktion.

    navigator.compass.getCurrentHeading (CompassSuccess, CompassError);
    

### Beispiel

    function onSuccess(heading) {
        alert('Heading: ' + heading.magneticHeading);
    };
    
    function onError(error) {
        alert('CompassError: ' + error.code);
    };
    
    navigator.compass.getCurrentHeading(onSuccess, onError);
    

## navigator.compass.watchHeading

Ruft das Gerät an den aktuellen Kurs in regelmäßigen Abständen. Jedes Mal, die Überschrift abgerufen wird, die `headingSuccess` Callback-Funktion wird ausgeführt.

Die zurückgegebenen Watch-ID verweist das Kompass-Uhr-Intervall. Die Uhr, die ID kann verwendet werden, mit `navigator.compass.clearWatch` , beobachten die navigator.compass zu stoppen.

    var watchID = navigator.compass.watchHeading(compassSuccess, compassError, [compassOptions]);
    

`compassOptions`enthalten die folgenden Schlüssel:

*   **Häufigkeit**: wie oft die Kompassrichtung in Millisekunden abrufen. *(Anzahl)* (Default: 100)
*   **Filter**: die Veränderung der Grad benötigt, um einen WatchHeading Erfolg Rückruf initiiert. Wenn dieser Wert festgelegt ist, wird die **Häufigkeit** ignoriert. *(Anzahl)*

### Beispiel

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
    

### Browser-Eigenheiten

Werte für aktuelle Überschrift werden nach dem Zufallsprinzip generiert, um den Kompass zu simulieren.

### iOS Macken

Nur ein `watchHeading` kann in der Tat auf einmal in iOS sein. Wenn ein `watchHeading` benutzt einen Filter Aufrufen von `getCurrentHeading` oder `watchHeading` verwendet den Wert des vorhandenen Filters Überschrift Änderungen festlegen. Überschrift Veränderungen beobachten, mit einem Filter ist effizienter als mit Zeitintervallen.

### Amazon Fire OS Macken

*   `filter`wird nicht unterstützt.

### Android Macken

*   Keine Unterstützung für`filter`.

### Firefox OS Macken

*   Keine Unterstützung für`filter`.

### Tizen Macken

*   Keine Unterstützung für`filter`.

### Windows Phone 7 und 8 Macken

*   Keine Unterstützung für`filter`.

## navigator.compass.clearWatch

Stoppen Sie, beobachten den Kompass auf der Watch-ID-Parameter verweist.

    navigator.compass.clearWatch(watchID);
    

*   **WatchID**: die ID von zurückgegeben`navigator.compass.watchHeading`.

### Beispiel

    var watchID = navigator.compass.watchHeading(onSuccess, onError, options);
    
    // ... later on ...
    
    navigator.compass.clearWatch(watchID);
    

## CompassHeading

A `CompassHeading` Objekt wird zurückgegeben, um die `compassSuccess` Callback-Funktion.

### Eigenschaften

*   **MagneticHeading**: die Überschrift in Grad von 0-359.99 zu einem einzigen Zeitpunkt. *(Anzahl)*

*   **TrueHeading**: die Überschrift im Verhältnis zu den geografischen Nordpol in Grad 0-359.99 zu einem einzigen Zeitpunkt. Ein negativer Wert bedeutet, dass die wahre Überschrift nicht bestimmt werden kann. *(Anzahl)*

*   **HeadingAccuracy**: die Abweichung in Grad zwischen der gemeldeten Überschrift und die wahre Richtung. *(Anzahl)*

*   **Timestamp**: die Zeit, an dem dieser Rubrik bestimmt war. *(Millisekunden)*

### Amazon Fire OS Macken

*   `trueHeading`wird nicht unterstützt, aber meldet den gleichen Wert wie`magneticHeading`

*   `headingAccuracy`ist immer 0 da es keinen Unterschied zwischen gibt der `magneticHeading` und`trueHeading`

### Android Macken

*   Die `trueHeading` -Eigenschaft wird nicht unterstützt, jedoch meldet den gleichen Wert wie`magneticHeading`.

*   Die `headingAccuracy` -Eigenschaft ist immer 0 da es keinen Unterschied zwischen gibt der `magneticHeading` und`trueHeading`.

### Firefox OS Macken

*   Die `trueHeading` -Eigenschaft wird nicht unterstützt, jedoch meldet den gleichen Wert wie`magneticHeading`.

*   Die `headingAccuracy` -Eigenschaft ist immer 0 da es keinen Unterschied zwischen gibt der `magneticHeading` und`trueHeading`.

### iOS Macken

*   Die `trueHeading` -Eigenschaft nur für Ortungsdienste aktiviert über zurückgegeben`navigator.geolocation.watchLocation()`.

*   Für iOS 4 Geräte oben Rubrik Faktoren in das Gerät aktuelle Ausrichtung und verweist nicht auf die absolute Position für Anwendungen, die diese Ausrichtung unterstützt.

## CompassError

A `CompassError` Objekt wird zurückgegeben, um die `compassError` Callback-Funktion, wenn ein Fehler auftritt.

### Eigenschaften

*   **Code**: einer der vordefinierten Fehlercodes aufgeführt.

### Konstanten

*   `CompassError.COMPASS_INTERNAL_ERR`
*   `CompassError.COMPASS_NOT_SUPPORTED`