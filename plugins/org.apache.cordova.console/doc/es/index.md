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

Este plugin es para asegurarse de que console.log() es tan útil como puede ser. Añade función adicional para iOS, Windows Phone 8, Ubuntu y Windows 8. Si estás contento con cómo funciona console.log() para ti, entonces probablemente no necesitas este plugin.

## Instalación

    cordova plugin add org.apache.cordova.console
    

### Rarezas Android

En algunas plataformas que no sean Android, console.log() actuará en varios argumentos, como console.log ("1", "2", "3"). Sin embargo, Android actuará sólo en el primer argumento. Se omitirá posteriores argumentos para console.log(). Este plugin no es la causa de eso, es una limitación propia de Android.