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

# org.Apache.Cordova.Battery stan

Wtyczka stanowi implementację starą wersję [API zdarzeń stanu baterii][1].

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

To dodaje następujące trzy `window` zdarzenia:

*   batterystatus
*   batterycritical
*   batterylow

## Instalacji

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

To zdarzenie fires po zmianie procent naładowania baterii, przez co najmniej 1 procent, lub jeśli urządzenie jest podłączone lub odłączony.

Obsługi stan baterii jest przekazywany obiekt, który zawiera dwie właściwości:

*   **poziom**: procent naładowania baterii (0-100). *(Liczba)*

*   **isPlugged**: boolean, która wskazuje, czy urządzenie jest podłączony *(Boolean)*

Aplikacje zwykle należy użyć `window.addEventListener` Aby dołączyć słuchacza po `deviceready` pożary zdarzenia.

### Obsługiwane platformy

*   Amazon ogień OS
*   iOS
*   Android
*   Jeżyna 10
*   Windows Phone 7 i 8
*   Tizen
*   Firefox OS

### Windows Phone 7 i 8 dziwactwa

Windows Phone 7 nie zapewniają native API do określenia poziomu baterii, więc `level` Właściwość jest niedostępny. `isPlugged`Parametr *jest* obsługiwany.

### Przykład

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

Zdarzenie odpala gdy procent naładowania baterii osiągnie próg rozładowanej baterii. Wartość jest specyficzne dla urządzenia.

`batterycritical`Obsługi jest przekazywany obiekt, który zawiera dwie właściwości:

*   **poziom**: procent naładowania baterii (0-100). *(Liczba)*

*   **isPlugged**: boolean, która wskazuje, czy urządzenie jest podłączony *(logiczna)*

Aplikacje zwykle należy użyć `window.addEventListener` Aby dołączyć słuchacza raz `deviceready` pożary zdarzenia.

### Obsługiwane platformy

*   Amazon ogień OS
*   iOS
*   Android
*   Jeżyna 10
*   Tizen
*   Firefox OS

### Przykład

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

Zdarzenie odpala gdy procent naładowania baterii osiągnie próg niskiego poziomu baterii, wartości specyficzne dla urządzenia.

`batterylow`Obsługi jest przekazywany obiekt, który zawiera dwie właściwości:

*   **poziom**: procent naładowania baterii (0-100). *(Liczba)*

*   **isPlugged**: boolean, która wskazuje, czy urządzenie jest podłączony *(logiczna)*

Aplikacje zwykle należy użyć `window.addEventListener` Aby dołączyć słuchacza raz `deviceready` pożary zdarzenia.

### Obsługiwane platformy

*   Amazon ogień OS
*   iOS
*   Android
*   Jeżyna 10
*   Tizen
*   Firefox OS

### Przykład

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }