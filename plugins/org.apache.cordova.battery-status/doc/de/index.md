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

# org.Apache.Cordova.Battery-status

Dieses Plugin stellt eine Implementierung einer alten Version der [Batterie-Status-API][1] dar..

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

Es fügt die folgenden drei `window` Events hinzu:

*   batterystatus
*   batterycritical
*   batterylow

## Installation

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

Dieses Ereignis wird ausgelöst, wenn sich der Prozentsatz der Akkuladung um mindestens 1 Prozent ändert, oder wenn das Gerät aufgeladen oder vom Netz getrennt wird.

Dem Batterie-Status-Event-Handler wird ein Objekt übergeben, das zwei Eigenschaften enthält:

*   **Ebene**: der Prozentsatz der Batterieladung (0-100). *(Anzahl)*

*   **IsPlugged**: ein boolescher Wert, der angibt, ob das Gerät eingesteckt ist *(boolesch)*

Anwendungen sollten in der Regel `window.addEventListener` verwenden, um einen Event-Listener hinzuzufügen, nachdem das `deviceready` -Event ausgelöst wurde.

### Unterstützte Plattformen

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Windows Phone 7 und 8
*   Tizen
*   Firefox OS

### Windows Phone 7 und 8 Eigenarten

Windows Phone 7 bietet keine systemeigenen APIs um das Batterie-Niveau zu bestimmen, so dass die `level` -Eigenschaft ist nicht verfügbar. Der `isPlugged` -Parameter wird unterstützt.

### Beispiel

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

Das Ereignis wird ausgelöst, wenn der Prozentsatz der Batterieladung den kritischen Akku-Schwellenwert erreicht hat. Der Wert ist gerätespezifisch.

Der `batterycritical` Handler übergibt ein Objekt mit zwei Eigenschaften:

*   **Ebene**: der Prozentsatz der Batterieladung (0-100). *(Anzahl)*

*   **IsPlugged**: ein boolescher Wert, der angibt, ob das Gerät eingesteckt ist *(boolesch)*

Anwendungen sollten in der Regel `window.addEventListener` verwenden, um einen Event-Listener hinzuzufügen, nachdem das `deviceready` -Event ausgelöst wurde.

### Unterstützte Plattformen

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Beispiel

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

Das Ereignis wird ausgelöst, wenn der Prozentsatz der Batterieladung den kritischen Akku-Schwellenwert erreicht hat. Der Wert ist gerätespezifisch.

Der `batterylow` Handler übergibt ein Objekt mit zwei Eigenschaften:

*   **Ebene**: der Prozentsatz der Batterieladung (0-100). *(Anzahl)*

*   **IsPlugged**: ein boolescher Wert, der angibt, ob das Gerät eingesteckt ist *(boolesch)*

Anwendungen sollten in der Regel `window.addEventListener` verwenden, um einen Event-Listener hinzuzufügen, nachdem das `deviceready` -Event ausgelöst wurde.

### Unterstützte Plattformen

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Beispiel

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }