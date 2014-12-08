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

# org.apache.Cordova.Battery-status

Questo plugin fornisce un'implementazione di una vecchia versione dell' [API di eventi lo stato della batteria][1].

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

Aggiunge i seguenti tre `window` eventi:

*   batterystatus
*   batterycritical
*   batterylow

## Installazione

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

Questo evento viene generato quando la percentuale di carica della batteria cambia almeno l'1 per cento, o se il dispositivo è collegato o scollegato.

Il gestore di stato della batteria viene passato un oggetto che contiene due proprietà:

*   **livello**: la percentuale di carica della batteria (0-100). *(Numero)*

*   **isPlugged**: un valore booleano che indica se il dispositivo è collegato poll *(Boolean)*

Applicazioni in genere è necessario utilizzare `window.addEventListener` per fissare un listener di eventi dopo il `deviceready` evento incendi.

### Piattaforme supportate

*   Amazon fuoco OS
*   iOS
*   Android
*   BlackBerry 10
*   Windows Phone 7 e 8
*   Tizen
*   Firefox OS

### Windows Phone 7 e 8 stranezze

Windows Phone 7 non fornisce le API native per determinare il livello della batteria, così la `level` proprietà non è disponibile. Il `isPlugged` parametro *è* supportato.

### Esempio

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

L'evento viene generato quando la percentuale di carica della batteria ha raggiunto la soglia critica di batteria. Il valore è specifico del dispositivo.

Il `batterycritical` gestore viene passato un oggetto che contiene due proprietà:

*   **livello**: la percentuale di carica della batteria (0-100). *(Numero)*

*   **isPlugged**: un valore booleano che indica se il dispositivo è collegato poll *(Boolean)*

Applicazioni in genere è necessario utilizzare `window.addEventListener` per fissare un listener di eventi una volta il `deviceready` evento incendi.

### Piattaforme supportate

*   Amazon fuoco OS
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Esempio

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

L'evento viene generato quando la percentuale di carica della batteria ha raggiunto la soglia di batteria scarica, il valore specifico del dispositivo.

Il `batterylow` gestore viene passato un oggetto che contiene due proprietà:

*   **livello**: la percentuale di carica della batteria (0-100). *(Numero)*

*   **isPlugged**: un valore booleano che indica se il dispositivo è collegato poll *(Boolean)*

Applicazioni in genere è necessario utilizzare `window.addEventListener` per fissare un listener di eventi una volta il `deviceready` evento incendi.

### Piattaforme supportate

*   Amazon fuoco OS
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Esempio

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }