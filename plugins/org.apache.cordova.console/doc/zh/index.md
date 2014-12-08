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

這個外掛程式是為了確保該 console.log() 是一樣有用，它可以是。 它將添加附加功能的 iOS、 Ubuntu，Windows Phone 8 和 Windows 8。 如果你是快樂與 console.log() 是如何為你工作，那麼可能不需要這個外掛程式。

## 安裝

    cordova plugin add org.apache.cordova.console
    

### Android 的怪癖

在一些非 Android 平臺上，console.log() 將作用於多個參數，如 console.log ("1"、"2"、"3"）。 然而，Android 將僅在第一個參數上採取行動。 對 console.log() 的後續參數將被忽略。 這個外掛程式不是的原因，，它是安卓系統本身的限制。