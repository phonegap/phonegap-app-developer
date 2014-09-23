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

# org.apache.cordova.geolocation

Этот плагин предоставляет информацию о местоположении устройства, например, Широта и Долгота. Общие источники информации о местонахождении включают глобальной системы позиционирования (GPS) и местоположение, выведено из сети сигналов, таких как IP-адрес, RFID, WiFi и Bluetooth MAC-адреса и идентификаторы базовых станций сотовой GSM/CDMA. Нет никакой гарантии, что API возвращает фактическое местоположение устройства.

Этот API основан на [Спецификации W3C Geolocation API][1]и выполняется только на устройствах, которые уже не обеспечивают реализацию.

 [1]: http://dev.w3.org/geo/api/spec-source.html

**Предупреждение**: сбор и использование данных геопозиционирования поднимает вопросы важные конфиденциальности. Политика конфиденциальности вашего приложения должна обсудить, как приложение использует данные геопозиционирования, ли она совместно с другими сторонами и уровень точности данных (например, грубый, тонкий, почтовый индекс уровня, т.д.). Геолокации, как правило, считается конфиденциальной, потому, что она может выявить местонахождение пользователя и, если сохранены, история их путешествия. Таким образом помимо политики конфиденциальности приложения, следует решительно рассмотреть уведомления just-in-time, прежде чем приложение обращается к геолокации (если операционной системы устройства не так уже). Это уведомление должно обеспечивать ту же информацию, отметили выше, а также получения разрешения пользователя (например, путем представления выбора **OK** и **Нет, спасибо**). Для получения дополнительной информации пожалуйста, смотрите в руководстве конфиденциальности.

## Установка

    cordova plugin add org.apache.cordova.geolocation
    

## Поддерживаемые платформы

*   Amazon Fire ОС
*   Android
*   BlackBerry 10
*   Firefox OS
*   iOS
*   Tizen
*   Windows Phone 7 и 8
*   Windows 8

## Методы

*   navigator.geolocation.getCurrentPosition
*   navigator.geolocation.watchPosition
*   navigator.geolocation.clearWatch

## Объекты (только для чтения)

*   Position
*   PositionError
*   Coordinates

## navigator.geolocation.getCurrentPosition

Возвращает текущее положение устройства для `geolocationSuccess` обратного вызова с `Position` объект в качестве параметра. Если есть ошибка, `geolocationError` обратного вызова передается `PositionError` объект.

    navigator.geolocation.getCurrentPosition (geolocationSuccess, [geolocationError], [geolocationOptions]);
    

### Параметры

*   **geolocationSuccess**: обратный вызов, который передается в текущей позиции.

*   **geolocationError**: *(необязательно)* обратного вызова, который выполняется при возникновении ошибки.

*   **geolocationOptions**: *(необязательно)* параметры геопозиционирования.

### Пример

    onSuccess обратного вызова / / этот метод принимает позицию объекта, который содержит / / текущие GPS координаты / / var onSuccess = function(position) {alert (' Широта: ' + position.coords.latitude + «\n» + ' Долгота: ' + position.coords.longitude + «\n» + ' Высота: ' + position.coords.altitude + «\n» + ' точность: ' + position.coords.accuracy + «\n» + ' высоте точность: ' + position.coords.altitudeAccuracy + «\n» + ' заголовок: ' + position.coords.heading + «\n» + ' скорость: ' + position.coords.speed + «\n» + ' штампа времени: ' + position.timestamp + «\n»);};
    
    onError обратного вызова получает объект PositionError / / функция onError(error) {alert (' код: ' + error.code + «\n» + ' сообщение: ' + error.message + «\n»);}
    
    navigator.geolocation.getCurrentPosition (onSuccess, onError);
    

## navigator.geolocation.watchPosition

Возвращает текущее положение устройства при обнаружении изменения в позиции. Когда устройство получает новое место, `geolocationSuccess` обратного вызова выполняется с `Position` объект в качестве параметра. Если есть ошибка, `geolocationError` обратного вызова выполняется с `PositionError` объект в качестве параметра.

    var watchId = navigator.geolocation.watchPosition (geolocationSuccess, [geolocationError], [geolocationOptions]);
    

### Параметры

*   **geolocationSuccess**: обратный вызов, который передается в текущей позиции.

*   **geolocationError**: (необязательно) обратного вызова, который выполняется при возникновении ошибки.

*   **geolocationOptions**: параметры (необязательно) географического расположения.

### Возвращает

*   **Строка**: Возвращает идентификатор часы, ссылается на позицию интервала часы. Идентификатор часы должны использоваться с `navigator.geolocation.clearWatch` прекратить слежение за изменением в положении.

### Пример

    onSuccess обратного вызова / / этот метод принимает «Position» объект, который содержит / / текущие GPS координаты / / функция onSuccess(position) {var элемент = document.getElementById('geolocation');
        element.innerHTML = ' Широта: ' + position.coords.latitude + ' < br / >' + ' Долгота: ' + position.coords.longitude + ' < br / >' + ' < hr / >' + element.innerHTML;
    } / / onError обратного вызова получает объект PositionError / / функция onError(error) {alert (' код: ' + error.code + «\n» + ' сообщение: ' + error.message + «\n»);}
    
    Опции: Бросьте сообщение об ошибке, если обновление не получено каждые 30 секунд.
    var watchID = navigator.geolocation.watchPosition (onSuccess, onError, {тайм-аут: 30000});
    

## geolocationOptions

Необязательные параметры для настройки поиска географического расположения`Position`.

    {maximumAge: 3000, тайм-аут: 5000, enableHighAccuracy: true};
    

### Параметры

*   **enableHighAccuracy**: предоставляет подсказку, что приложению требуются наилучшие результаты. По умолчанию устройство пытается получить `Position` с использованием методов на основе сети. Установка этого свойства значение `true` указывает среде использовать более точные методы, например спутникового позиционирования. *(Логическое значение)*

*   **время ожидания**: максимальная длина времени (в миллисекундах), которое может пройти от вызова `navigator.geolocation.getCurrentPosition` или `geolocation.watchPosition` до соответствующих `geolocationSuccess` выполняет обратный вызов. Если `geolocationSuccess` обратного вызова не вызывается в течение этого времени, `geolocationError` обратного вызова передается `PositionError.TIMEOUT` код ошибки. (Обратите внимание, что при использовании в сочетании с `geolocation.watchPosition` , `geolocationError` обратный вызов может быть вызван на интервале каждые `timeout` миллисекунд!) *(Число)*

*   **maximumAge**: принять кэшированное положение, возраст которых не превышает указанного времени в миллисекундах. *(Число)*

### Android причуды

Эмуляторы Android 2.x не возвращать результат географического расположения, если `enableHighAccuracy` параметр имеет значение`true`.

## navigator.geolocation.clearWatch

Остановить просмотр для изменения местоположения устройства ссылается `watchID` параметр.

    navigator.geolocation.clearWatch(watchID);
    

### Параметры

*   **watchID**: идентификатор `watchPosition` интервал, чтобы очистить. (Строка)

### Пример

    Опции: наблюдать за изменениями в положении и использовать наиболее / / точная позиция приобретение доступным методом.
    var watchID = navigator.geolocation.watchPosition (onSuccess, onError, {enableHighAccuracy: true});
    
    .. .later на...
    
    navigator.geolocation.clearWatch(watchID);
    

## Position

Содержит `Position` координат и отметок времени, созданная API геопозиционирования.

### Свойства

*   **CoOrds**: набор географических координат. *(Координаты)*

*   **штамп времени**: штамп времени создания для `coords` . *(Дата)*

## Coordinates

A `Coordinates` объект присоединен к `Position` объект, который доступен для обратного вызова функций в запросы для текущей позиции. Он содержит набор свойств, которые описывают географические координаты позиции.

### Свойства

*   **Широта**: Широта в десятичных градусах. *(Число)*

*   **Долгота**: Долгота в десятичных градусах. *(Число)*

*   **Высота**: высота позиции в метрах над эллипсоидом. *(Число)*

*   **точность**: уровень точности координат широты и долготы в метрах. *(Число)*

*   **altitudeAccuracy**: уровень точности координат высоты в метрах. *(Число)*

*   **заголовок**: направление движения, указанный в градусах, считая по часовой стрелке относительно истинного севера. *(Число)*

*   **скорость**: Текущая скорость земли устройства, указанного в метрах в секунду. *(Число)*

### Amazon Fire OS причуды

**altitudeAccuracy**: не поддерживается Android устройств, возвращая`null`.

### Android причуды

**altitudeAccuracy**: не поддерживается Android устройств, возвращая`null`.

## PositionError

`PositionError`Объект передается в `geolocationError` функции обратного вызова при возникновении ошибки с navigator.geolocation.

### Свойства

*   **код**: один из предопределенных кодов, перечисленных ниже.

*   **сообщение**: сообщение об ошибке с подробными сведениями об ошибке.

### Константы

*   `PositionError.PERMISSION_DENIED` 
    *   Возвращается, когда пользователи не позволяют приложению получить сведения о положении. Это зависит от платформы.
*   `PositionError.POSITION_UNAVAILABLE` 
    *   Возвращается, если устройство не удается получить позиции. В общем это означает, что прибор не подключен к сети или не может получить Спутниковое исправить.
*   `PositionError.TIMEOUT` 
    *   Возвращается, если устройство не удается получить позиции в течение времени, заданного параметром `timeout` в `geolocationOptions` . При использовании с `navigator.geolocation.watchPosition` , эта ошибка может быть неоднократно передан `geolocationError` обратного вызова каждый `timeout` миллисекунд.