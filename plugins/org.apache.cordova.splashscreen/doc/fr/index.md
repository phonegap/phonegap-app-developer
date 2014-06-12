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

Ce plugin affiche et masque un écran de démarrage lors du lancement de l'application.

## Installation

    cordova plugin add org.apache.cordova.splashscreen
    

## Plates-formes prises en charge

*   Amazon Fire OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 et 8
*   Windows 8

## Méthodes

*   splashscreen.Show
*   splashscreen.Hide

### Quirks Android

Dans votre fichier config.xml, vous devez ajouter la préférence suivante

`<preference name="splashscreen" value="foo" />`

Où foo est le nom du fichier splashscreen. Préférence un fichier de 9 correctif. Assurez-vous d'ajouter vos fichiers splashcreen dans votre répertoire res/xml dans les dossiers appropriés.

Pour Android, vous devez également modifier votre fichier java principal de projets. Vous devez ajouter un deuxième paramètre, ce qui représente un temps de retard à votre super.loadUrl.

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.Hide

Fait disparaître l'écran de démarrage.

    navigator.splashscreen.hide();
    

### BlackBerry 10 Quirk

La `config.xml` du fichier `AutoHideSplashScreen` doit être`false`.

### iOS Quirk

Le paramètre `AutoHideSplashScreen</code du fichier <code>config.xml` doit être réglé à `false` . Pour retarder la disparition de l'écran de démarrage de deux secondes, ajoute un minuteur comme ci-dessous dans le gestionnaire d'événements `deviceready` :

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.Show

Affiche l'écran de démarrage.

    navigator.splashscreen.show();
    

Votre application ne peut pas appeler `navigator.splashscreen.show()` jusqu'à ce que l'application a commencé et le `deviceready` événement a été déclenché. Mais puisqu'en général, l'écran de démarrage est destiné à être visible avant que votre application a commencé, qui semblerait à l'encontre des objectifs de l'écran de démarrage. Fournir une configuration en `config.xml` sera automatiquement `show` l'écran de démarrage immédiatement après votre lancement de l'app et avant qu'il a complètement démarré et a reçu le `deviceready` événement. Voir les [icônes et les écrans de démarrage][1] pour plus d'informations sur la conduite de cette configuration. Pour cette raison, il est peu probable que vous devez appeler `navigator.splashscreen.show()` pour rendre l'écran de démarrage visible pour le démarrage de l'application.

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html