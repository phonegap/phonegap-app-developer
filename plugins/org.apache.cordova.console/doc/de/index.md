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

# org.apache.cordova.console

Dieses Plugin stellt sicher, dass der Befehl console.log() so hilfreich ist, wie er sein kann. Es fügt zusätzliche Funktion für iOS, Ubuntu, Windows Phone 8 und Windows 8 hinzu. Teilweise kann es vorkommen, dass der Befehl console.log() nicht korrekt erkannt wird, und es zu Fehlern bzw. zu nicht angezeigten Logs in der Console kommt. Wenn Sie mit der derzeitigen Funktionsweise zufrieden sind, kann es sein, dass Sie dieses Plugin nicht benötigen.

## Installation

    cordova plugin add org.apache.cordova.console
    

### Android Eigenarten

Auf einigen anderen Plattformen als Android reagiert der Befehl console.log ("1", "2", "3") auf mehrere Befehle. In diesem Fall 1, 2 und 3. Android wird jedoch nur auf das erste Argument (1) reagieren. Nachfolgende Argumente zu console.log() (2 und 3) werden ignoriert. Dafür ist aber nicht dieses Plugin verantwortlich! Es ist eine Limitierung die von Android kommt und nicht von diesem Plugin beeinflusst werden kann.