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

このプラグインが表示され、アプリケーションの起動中にスプラッシュ スクリーンを非表示にします。

## インストール

    cordova plugin add org.apache.cordova.splashscreen
    

## サポートされているプラットフォーム

*   アマゾン火 OS
*   アンドロイド
*   ブラックベリー 10
*   iOS
*   Windows Phone 7 と 8
*   Windows 8

## メソッド

*   splashscreen.show
*   splashscreen.hide

### Android の癖

あなた config.xml で、以下の設定を追加する必要があります。

`<preference name="splashscreen" value="foo" />`

Foo は splashscreen ファイルの名前です。できれば 9 パッチ ファイルです。解像度/xml ディレクトリの適切なフォルダーの下に splashcreen ファイルを追加することを確認します。

アンドロイドのためまた、プロジェクトの主要な java ファイルを編集する必要があります。あなたの super.loadUrl への遅延時間を表す 2 番目のパラメーターを追加する必要があります。

`super.loadUrl(Config.getStartUrl(), 10000);`

## splashscreen.hide

スプラッシュ スクリーンを閉じます。

    navigator.splashscreen.hide();
    

### ブラックベリー 10 気まぐれ

`config.xml`ファイルの `AutoHideSplashScreen` 設定する必要があります`false`.

### iOS の気まぐれ

`config.xml`ファイルの `AutoHideSplashScreen` 設定する必要があります `false` 。 遅延を 2 秒間スプラッシュ スクリーンを非表示、する、タイマーを追加しますで次のように `deviceready` イベント ハンドラー。

        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 2000);
    

## splashscreen.show

スプラッシュ画面が表示されます。

    navigator.splashscreen.show();
    

アプリケーションを呼び出すことはできません `navigator.splashscreen.show()` 、アプリが開始されるまで、 `deviceready` イベントが発生します。 しかし、以来、通常スプラッシュ画面アプリ開始前に表示するものですと思われる、スプラッシュ スクリーンの目的の敗北します。 いくつかの構成を提供する `config.xml` は自動的に `show` スプラッシュ画面、アプリを起動後すぐに、それが完全に起動し、受信する前に、 `deviceready` イベント。 詳細についてはこの構成を行うには、[アイコンとスプラッシュ画面][1]を参照してください。 このような理由から、それは可能性を呼び出す必要があります `navigator.splashscreen.show()` アプリ起動時のスプラッシュ画面を見やすくします。

 [1]: http://cordova.apache.org/docs/en/edge/config_ref_images.md.html