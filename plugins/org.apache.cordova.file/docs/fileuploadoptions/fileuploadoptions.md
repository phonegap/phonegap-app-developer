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

FileUploadOptions
========

A `FileUploadOptions` object can be passed to the `FileTransfer`
object's `upload()` method to specify additional parameters to the
upload script.

Properties
----------

- __fileKey__: The name of the form element.  Defaults to `file`. (DOMString)
- __fileName__: The file name to use when saving the file on the server.  Defaults to `image.jpg`. (DOMString)
- __mimeType__: The mime type of the data to upload.  Defaults to `image/jpeg`. (DOMString)
- __params__: A set of optional key/value pairs to pass in the HTTP request. (Object)
- __chunkedMode__: Whether to upload the data in chunked streaming mode. Defaults to `true`. (Boolean)
- __headers__: A map of header name/header values. Use an array to specify more than one value. (Object)

Description
-----------

A `FileUploadOptions` object can be passed to the `FileTransfer`
object's `upload()` method to specify additional parameters to the
upload script.

WP7 Quirk
---------

- __chunkedMode:__: Ignored on WP7.
