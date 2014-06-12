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

Este plugin muestra y esconde una pantalla de bienvenida durante el inicio de la aplicación.

## Instalación

    cordova plugin add org.apache.cordova.splashscreen
    

## Plataformas soportadas

*   Amazon fuego OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 y 8
*   Windows 8

## Métodos

*   splashscreen.show
*   splashscreen.hide

### Rarezas Android

En el archivo config.xml, tienes que añadir la siguiente preferencia

`<preference name="splashscreen" value="foo" />`

Donde foo es el nombre del archivo splashscreen. Preferiblemente un archivo de 9 parche. Asegúrese de agregar tus archivos splashcreen en tu directorio res/xml bajo las carpetas apropiadas.

Para Android, también tienes que editar el archivo java principales proyectos. Debe agregar un segundo parámetro que representa un intervalo de tiempo para su super.loadUrl.

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.hide

Despedir a la pantalla de bienvenida.

    navigator.splashscreen.hide();
    

### BlackBerry 10 chanfle

El `config.xml` del archivo `AutoHideSplashScreen` ajuste debe ser`false`.

### iOS Quirk

El `config.xml` del archivo `AutoHideSplashScreen` la configuración debe ser `false` . Para retrasar oculta la pantalla splash durante dos segundos, agregue un temporizador como la siguiente en el `deviceready` controlador de eventos:

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.show

Muestra la pantalla de bienvenida.

    navigator.splashscreen.show();
    

La aplicación no se puede llamar `navigator.splashscreen.show()` hasta que haya iniciado la aplicación y el `deviceready` evento ha despedido. Pero puesto que normalmente la pantalla está destinada a ser visible antes de que comience su aplicación, que parecería que el propósito de la pantalla de bienvenida. Proporcionar cierta configuración en `config.xml` automáticamente `show` la pantalla de presentación inmediatamente después de su lanzamiento de la aplicación y antes de ser completamente ha iniciado y recibió el `deviceready` evento. Ver [los iconos y salpicadura pantallas][1] para obtener más información sobre haciendo esta configuración. Por esta razón, es poco probable que necesitas llamar a `navigator.splashscreen.show()` para hacer la pantalla visible para el inicio de la aplicación.

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html