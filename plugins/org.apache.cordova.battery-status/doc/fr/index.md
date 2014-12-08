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

# org.Apache.Cordova.Battery inscrits

Ce plugin fournit une implémentation d'une ancienne version de [Batterie Status événements API][1].

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

Il ajoute les trois `window` des événements :

*   batterystatus
*   batterycritical
*   batterylow

## Installation

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

L'évènement se déclenche lorsque le taux de charge de la batterie gagne ou perd au moins un pourcent, ou quand l'appareil est branché ou débranché.

Le gestionnaire est appelé avec un objet contenant deux propriétés :

*   **level** : le taux de charge de la batterie (0-100). *(Number)*

*   **isPlugged** : un booléen indiquant si l'appareil est en cours de chargement ou non. *(Boolean)*

Les applications doivent généralement utiliser `window.addEventListener` pour attacher un écouteur d'événements après le `deviceready` événement se déclenche.

### Plates-formes prises en charge

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Windows Phone 7 et 8
*   Paciarelli
*   Firefox OS

### Notes au sujet de Windows Phone 7 et 8

Windows Phone 7 ne fournit pas d'API native pour déterminer le niveau de la batterie, de ce fait la propriété `level` n'est pas disponible. La propriété `isPlugged` *est* quant à elle prise en charge.

### Exemple

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

L'évènement se déclenche lorsque le pourcentage de charge de la batterie a atteint un seuil critique. Cette valeur est spécifique à l'appareil.

Le gestionnaire `batterycritical` est appelé avec un objet contenant deux propriétés :

*   **niveau**: le pourcentage de charge de la batterie (0-100). *(Nombre)*

*   **isPlugged**: valeur booléenne qui indique si l'appareil n'est branché *(Boolean)*

Les applications devraient en général utiliser `window.addEventListener` pour attacher un écouteur d'évènements, une fois l'évènement `deviceready` déclenché.

### Plates-formes prises en charge

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Paciarelli
*   Firefox OS

### Exemple

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

L'évènement se déclenche lorsque le pourcentage de charge de la batterie a atteint un niveau faible, cette valeur est spécifique à l'appareil.

Le gestionnaire `batterylow` est appelé avec un objet contenant deux propriétés :

*   **niveau**: le pourcentage de charge de la batterie (0-100). *(Nombre)*

*   **isPlugged**: valeur booléenne qui indique si l'appareil n'est branché *(Boolean)*

Les applications devraient en général utiliser `window.addEventListener` pour attacher un écouteur d'évènements, une fois l'évènement `deviceready` déclenché.

### Plates-formes prises en charge

*   Amazon Fire OS
*   iOS
*   Android
*   BlackBerry 10
*   Paciarelli
*   Firefox OS

### Exemple

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }