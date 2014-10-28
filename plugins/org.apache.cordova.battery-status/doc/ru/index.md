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

# org.apache.cordova.battery-status

Этот плагин предоставляет реализацию старой версии [API Событий Статуса Батареи][1].

 [1]: http://www.w3.org/TR/2011/WD-battery-status-20110915/

API добавляет следующие три события для объекта `window`:

*   batterystatus
*   batterycritical
*   batterylow

## Установка

    cordova plugin add org.apache.cordova.battery-status
    

## batterystatus

Это событие возникает при изменении процент заряда батареи по крайней мере на 1%, или если устройство подключается или отключается от заряжающего устройства.

Обработчику события batterystatus передается объект, содержащий два свойства:

*   **level**: процент заряда батареи (0-100). *(Число)*

*   **isPlugged**: логическое значение, указывающее, подключено ли устройство к заряжающему устройству *(Boolean)*

Приложения обычно должны использовать `window.addEventListener` прикрепить прослушиватель событий после `deviceready` пожаров события.

### Поддерживаемые платформы

*   Amazon Fire ОС
*   iOS
*   Android
*   BlackBerry 10
*   Windows Phone 7 и 8
*   Tizen
*   Firefox OS

### Особенности Windows Phone 7 и 8

Windows Phone 7 не обеспечивает API, чтобы определить уровень заряда батареи, так что свойство `level` недоступно. Параметр `isPlugged` *поддерживается*.

### Пример

    window.addEventListener("batterystatus", onBatteryStatus, false);
    
    function onBatteryStatus(info) {
        // Handle the online event
        console.log("Level: " + info.level + " isPlugged: " + info.isPlugged);
    }
    

## batterycritical

Событие возникает, когда процент заряда батареи почти достиг порога полной разрядки батареи. Значение этого порога зависит от конкретного устройства.

Обработчику события `batterycritical` передается объект, содержащий два свойства:

*   **уровень**: процент заряда батареи (0-100). *(Число)*

*   **isPlugged**: значение boolean, указывающее, является ли устройство подключено дюйма *(Boolean)*

Приложения обычно должны использовать `window.addEventListener` чтобы добавить обработчик события после того как произойдет событие `deviceready`.

### Поддерживаемые платформы

*   Amazon Fire ОС
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Пример

    window.addEventListener("batterycritical", onBatteryCritical, false);
    
    function onBatteryCritical(info) {
        // Handle the battery critical event
        alert("Battery Level Critical " + info.level + "%\nRecharge Soon!");
    }
    

## batterylow

Событие возникает, когда процент заряда батареи достигает порога низкого заряда батареи, это значение зависит от конкретного устройства.

Обработчику события `batterylow` передается объект, содержащий два свойства:

*   **уровень**: процент заряда батареи (0-100). *(Число)*

*   **isPlugged**: значение boolean, указывающее, является ли устройство подключено дюйма *(Boolean)*

Приложения обычно должны использовать `window.addEventListener` чтобы добавить обработчик события после того как произойдет событие `deviceready`.

### Поддерживаемые платформы

*   Amazon Fire ОС
*   iOS
*   Android
*   BlackBerry 10
*   Tizen
*   Firefox OS

### Пример

    window.addEventListener("batterylow", onBatteryLow, false);
    
    function onBatteryLow(info) {
        // Handle the battery low event
        alert("Battery Level Low " + info.level + "%");
    }