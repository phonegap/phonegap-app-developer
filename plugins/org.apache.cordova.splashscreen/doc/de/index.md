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

# org.apache.cordova.splashscreen

Dieses Plugin zeigt und verbirgt einen Splash-Screen beim Start der Anwendung.

## Installation

    cordova plugin add org.apache.cordova.splashscreen
    

## Unterstützte Plattformen

*   Amazon Fire OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 und 8
*   Windows 8

## Methoden

*   SplashScreen.Show
*   SplashScreen.Hide

### Android Macken

In Ihrem "config.xml" müssen Sie die folgende Einstellung hinzufügen

`<preference name="splashscreen" value="foo" />`

Wo Foo ist der Name der Datei Splashscreen. Vorzugsweise eine 9-Patch-Datei. Stellen Sie sicher, Splashcreen Dateien zu Ihrem Res/Xml-Verzeichnis unter den entsprechenden Ordnern hinzuzufügen.

Für Android müssen Sie auch Ihre wichtigsten Java-Projekte-Datei bearbeiten. Sie müssen hinzufügen, einen zweiten Parameter, die eine zeitliche Verzögerung zu Ihren super.loadUrl darstellt.

`super.loadUrl(Config.getStartUrl(), 10000);`

## SplashScreen.Hide

Schließen Sie den Splash-Screen.

    navigator.splashscreen.hide();
    

### BlackBerry 10 Quirk

Die `config.xml` der Datei `AutoHideSplashScreen` muss`false`.

### iOS Quirk

Die `config.xml` Datei `AutoHideSplashScreen` muss `false` . Verstecken den Splash-Screen für zwei Sekunden Verzögerung, fügen Sie einen Timer wie die folgende in der `deviceready` -Ereignishandler:

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## SplashScreen.Show

Zeigt den Begrüßungsbildschirm.

    navigator.splashscreen.show();
    

Ihre Anwendung kann nicht aufgerufen werden `navigator.splashscreen.show()` bis die app gestartet hat und das `deviceready` -Ereignis ausgelöst hat. Aber da in der Regel der Splash-Screen soll sichtbar sein, bevor die Anwendung gestartet wurde, scheint die Niederlage der Zweck des Begrüßungsbildschirms. Somit einige Konfiguration in `config.xml` wird automatisch `show` den Splash-Screen unmittelbar nach Ihrer app starten und bevor es voll gestartet und hat das `deviceready` Ereignis. Weitere Informationen zu dieser Konfiguration finden Sie unter [Symbole und Splash-Screens][1] . Aus diesem Grund ist es unwahrscheinlich, dass Sie aufrufen müssen `navigator.splashscreen.show()` den Splash-Screen beim Starten der app sichtbar zu machen.

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html