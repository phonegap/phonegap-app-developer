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

Dieses Plugin ist gedacht, um sicherzustellen, dass diese console.log() eignet sich wie es sein kann. Es fügt zusätzliche Funktion für iOS, Ubuntu, Windows Phone 8 und Windows 8 hinzu. Wenn Sie zufrieden sind mit der Funktionsweise von console.log() für Sie, brauchen dann Sie vermutlich dieses Plugin nicht.

## Installation

    cordova plugin add org.apache.cordova.console
    

### Android Macken

Auf einigen Plattformen als Android fungieren console.log() auf mehrere Argumente wie console.log ("1", "2", "3"). Android wird jedoch nur auf das erste Argument fungieren. Nachfolgende Argumente zu console.log() werden ignoriert. Dieses Plugin ist nicht die Verantwortung dafür, es ist eine Einschränkung von Android selbst.