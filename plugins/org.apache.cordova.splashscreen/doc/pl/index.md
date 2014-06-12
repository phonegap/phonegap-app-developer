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

Ten plugin wyświetla i ukrywa ekran powitalny podczas uruchamiania aplikacji.

## Instalacji

    cordova plugin add org.apache.cordova.splashscreen
    

## Obsługiwane platformy

*   Amazon ogień OS
*   Android
*   Jeżyna 10
*   iOS
*   Windows Phone 7 i 8
*   Windows 8

## Metody

*   splashscreen.show
*   splashscreen.Hide

### Android dziwactwa

W pliku config.xml musisz dodać następujące preferencje

`<preference name="splashscreen" value="foo" />`

Gdzie foo jest nazwą pliku ekranu powitalnego. Najlepiej plik poprawki 9. Upewnij się dodać pliki splashcreen do katalogu res/xml w odpowiednich folderach.

Dla Androida należy edytować plik java głównych projektów. Należy dodać drugi parametr reprezentujących opóźnienie do Twojej super.loadUrl.

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.Hide

Odrzucić ten opryskaæ têcza.

    navigator.splashscreen.hide();
    

### Zrządzenie blackBerry 10

`config.xml`Pliku `AutoHideSplashScreen` ustawienie musi być`false`.

### iOS dziwactwo

`config.xml`Pliku `AutoHideSplashScreen` ustawienie musi być `false` . Opóźnienia, ukrywanie ekranu powitalnego przez dwie sekundy, dodać timer następujących w `deviceready` obsługa zdarzeń:

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.show

Wyświetla ekran powitalny.

    navigator.splashscreen.show();
    

Aplikacja nie może wywołać `navigator.splashscreen.show()` aż aplikacja została uruchomiona i `deviceready` imprezy został zwolniony. Ale ponieważ zazwyczaj opryskać tęcza ma być widoczne przed rozpoczęciem aplikacji, wydaje się sprzeczne z celem ekranu powitalnego. Dostarczanie niektórych konfiguracji w `config.xml` będzie automatycznie `show` ekran powitalny, natychmiast po uruchomienie aplikacji i przed pełni rozpoczął i otrzymał `deviceready` zdarzenie. Aby uzyskać więcej informacji na robienie tej konfiguracji, zobacz [ikony i ekrany powitalne w aplikacjach][1] . Z tego powodu, jest mało prawdopodobne, należy zadzwonić `navigator.splashscreen.show()` Aby wyświetlić ekran powitalny dla uruchamiania aplikacji.

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html