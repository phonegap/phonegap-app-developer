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

# org.apache.cordova.network-information

Этот плагин обеспечивает реализацию старой версии в [Сети информацию о API][1]. Он предоставляет информацию о сотовых и Wi-Fi подключение устройства, и имеет ли устройство подключения к Интернету.

 [1]: http://www.w3.org/TR/2011/WD-netinfo-api-20110607/

## Установка

    cordova plugin add org.apache.cordova.network-information
    

## Поддерживаемые платформы

*   Amazon Fire ОС
*   Android
*   BlackBerry 10
*   Обозреватель
*   iOS
*   Windows Phone 7 и 8
*   Tizen
*   Windows 8
*   Firefox OS

# Подключение

> `connection`Объектов, через `navigator.connection` , предоставляет информацию о сотовых и wifi подключение устройства.

## Свойства

*   connection.type

## Константы

*   Connection.UNKNOWN
*   Connection.ETHERNET
*   Connection.WIFI
*   Connection.CELL_2G
*   Connection.CELL_3G
*   Connection.CELL_4G
*   Connection.CELL
*   Connection.NONE

## connection.type

Это свойство предоставляет быстрый способ для определения состояния подключения устройства сети и тип подключения.

### Быстрый пример

    function checkConnection() {
        var networkState = navigator.connection.type;
    
        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.CELL]     = 'Cell generic connection';
        states[Connection.NONE]     = 'No network connection';
    
        alert('Connection type: ' + states[networkState]);
    }
    
    checkConnection();
    

### Изменения API

До Кордова 2.3.0 `Connection` был доступ к объекту через `navigator.network.connection` , после которого оно было изменено на `navigator.connection` в соответствии со спецификацией консорциума W3C. Он все еще доступен в его исходном расположении, но является устаревшим и в конечном итоге будут удалены.

### iOS причуды

*   iOS не может определить тип подключения к сотовой сети. 
    *   `navigator.connection.type`имеет значение `Connection.CELL` для всех сотовых данных.

### Windows Phone причуды

*   Когда заработает в эмуляторе, всегда определяет `navigator.connection.type` как`Connection.UNKNOWN`.

*   Windows Phone не может определить тип подключения к сотовой сети.
    
    *   `navigator.connection.type`имеет значение `Connection.CELL` для всех сотовых данных.

### Причуды Tizen

*   Tizen может только обнаружить Wi-Fi или сотовой связи. 
    *   `navigator.connection.type`имеет значение `Connection.CELL_2G` для всех сотовых данных.

### Firefox OS причуды

*   Firefox OS не может определить тип подключения к сотовой сети. 
    *   `navigator.connection.type`имеет значение `Connection.CELL` для всех сотовых данных.

# События, связанные с сетью

## offline

Событие возникает, когда приложение переходит в автономный режим, и устройство не подключено к сети Интернет.

    document.addEventListener("offline", yourCallbackFunction, false);
    

### Детали

`offline`Событие возникает, когда ранее подключенное устройство теряет подключение к сети, так что приложение больше не может получить доступ к Интернет. Он опирается на ту же информацию, подключение API и пожары, когда значение `connection.type` становится`NONE`.

Приложения обычно должны использовать `document.addEventListener` прикрепить прослушиватель событий после `deviceready` пожаров события.

### Быстрый пример

    document.addEventListener("offline", onOffline, false);
    
    function onOffline() {
        // Handle the offline event
    }
    

### iOS причуды

Во время первоначального запуска первый автономный событие (если применимо) принимает по крайней мере второй на огонь.

### Windows Phone 7 причуды

Когда заработает в эмуляторе, `connection.status` не всегда известно, так это событие не *не* огонь.

### Windows Phone 8 причуды

Эмулятор сообщает тип подключения как `Cellular` , которая не меняется, поэтому событие не *не* огонь.

## online

Это событие возникает, когда приложение выходит в онлайн, и устройство становится подключен к Интернету.

    document.addEventListener("online", yourCallbackFunction, false);
    

### Детали

`online`Событие возникает, когда ранее несвязанных устройство получает связь сети, чтобы разрешить приложению доступ к Интернету. Он опирается на ту же информацию, подключение API и применяется при `connection.type` меняется от `NONE` в любое другое значение.

Приложения обычно должны использовать `document.addEventListener` прикрепить прослушиватель событий после `deviceready` пожаров события.

### Быстрый пример

    document.addEventListener("online", onOnline, false);
    
    function onOnline() {
        // Handle the online event
    }
    

### iOS причуды

Во время первоначального запуска первая `online` событий (если применимо) занимает по меньшей мере второе огонь, до которой `connection.type` является`UNKNOWN`.

### Windows Phone 7 причуды

Когда заработает в эмуляторе, `connection.status` не всегда известно, так это событие не *не* огонь.

### Windows Phone 8 причуды

Эмулятор сообщает тип подключения как `Cellular` , который не меняется, поэтому не события *не* огонь.