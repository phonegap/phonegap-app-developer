---
license: Licensed to the Apache Software Foundation (ASF) under one
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
---

FileUploadResult
========

A `FileUploadResult` object is passed to the success callback of the
`FileTransfer` object's `upload()` method.

Properties
----------

- __bytesSent__: The number of bytes sent to the server as part of the upload. (long)
- __responseCode__: The HTTP response code returned by the server. (long)
- __response__: The HTTP response returned by the server. (DOMString)

Description
-----------

The `FileUploadResult` object is returned via the success callback of
the `FileTransfer` object's `upload()` method.

iOS Quirks
----------

- Does not support `responseCode` or `bytesSent`.
