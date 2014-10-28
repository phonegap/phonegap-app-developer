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

# org.apache.cordova.media-capture

Questo plugin fornisce l'accesso per il dispositivo audio, immagine e funzionalità di cattura video.

**Avviso**: raccolta e utilizzo delle immagini, video o audio da videocamera o un microfono del dispositivo solleva questioni di privacy importante. Politica sulla privacy dell'app dovrebbe discutere come app utilizza tali sensori e se i dati registrati sono condivisa con altre parti. Inoltre, se uso dell'app della fotocamera o microfono non è evidente nell'interfaccia utente, è necessario fornire un preavviso di just-in-time prima app accede la videocamera o il microfono (se il sistema operativo del dispositivo non farlo già). Tale comunicazione deve fornire le informazioni stesse notate sopra, oltre ad ottenere l'autorizzazione (ad esempio, presentando scelte per **OK** e **No grazie**). Si noti che alcuni mercati app possono richiedere l'app può fornire preavviso just-in-time e ottenere l'autorizzazione dell'utente prima di accedere la videocamera o il microfono. Per ulteriori informazioni, vedere la guida sulla Privacy.

## Installazione

    cordova plugin add org.apache.cordova.media-capture
    

## Piattaforme supportate

*   Amazon fuoco OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 e 8
*   Windows 8

## Oggetti

*   Cattura
*   CaptureAudioOptions
*   CaptureImageOptions
*   CaptureVideoOptions
*   CaptureCallback
*   CaptureErrorCB
*   ConfigurationData
*   MediaFile
*   MediaFileData

## Metodi

*   capture.captureAudio
*   capture.captureImage
*   capture.captureVideo
*   MediaFile.getFormatData

## Proprietà

*   **supportedAudioModes**: la registrazione di formati supportati dal dispositivo audio. (ConfigurationData[])

*   **supportedImageModes**: la registrazione formati immagine e i formati supportati dal dispositivo. (ConfigurationData[])

*   **supportedVideoModes**: I formati supportati dal dispositivo e risoluzioni video registrazione. (ConfigurationData[])

## capture.captureAudio

> Avviare l'applicazione registratore audio e restituire informazioni sui file di clip audio catturato.

    navigator.device.capture.captureAudio(
        CaptureCB captureSuccess, CaptureErrorCB captureError,  [CaptureAudioOptions options]
    );
    

### Descrizione

Avvia un'operazione asincrona per acquisire registrazioni audio utilizzando l'applicazione di registrazione audio predefinita del dispositivo. L'operazione consente all'utente di dispositivo acquisire registrazioni multiple in una singola sessione.

L'operazione di acquisizione termina quando l'utente esce l'audio registrazione applicazione, o il numero massimo di registrazioni specificato da `CaptureAudioOptions.limit` è raggiunto. Se non `limit` valore del parametro è specificato, il valore predefinito è uno (1) e l'operazione di acquisizione termina dopo l'utente registra una singola clip audio.

Quando termina l'operazione di acquisizione, la `CaptureCallback` viene eseguita con una matrice di `MediaFile` oggetti che descrivono ciascuna catturato file clip audio. Se l'utente termina l'operazione prima di un clip audio viene catturato, il `CaptureErrorCallback` viene eseguito con un `CaptureError` oggetto, con il `CaptureError.CAPTURE_NO_MEDIA_FILES` codice di errore.

### Piattaforme supportate

*   Amazon fuoco OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 e 8
*   Windows 8

### Esempio

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start audio capture
    navigator.device.capture.captureAudio(captureSuccess, captureError, {limit:2});
    

### iOS stranezze

*   iOS non ha un'applicazione di registrazione audio predefinita, quindi viene fornita un'interfaccia utente semplice.

### Windows Phone 7 e 8 stranezze

*   Windows Phone 7 non ha un'applicazione di registrazione audio predefinita, quindi viene fornita un'interfaccia utente semplice.

## CaptureAudioOptions

> Incapsula le opzioni di configurazione di acquisizione audio.

### Proprietà

*   **limite**: il numero massimo di clip audio in grado di registrare l'utente del dispositivo in un'operazione di acquisizione di singolo. Il valore deve essere maggiore o uguale a 1 (default 1).

*   **durata**: la durata massima di un clip audio audio, in pochi secondi.

### Esempio

    // limit capture operation to 3 media files, no longer than 10 seconds each
    var options = { limit: 3, duration: 10 };
    
    navigator.device.capture.captureAudio(captureSuccess, captureError, options);
    

### Amazon fuoco OS stranezze

*   Il `duration` parametro non è supportato. Lunghezze di registrazione non può essere limitato a livello di codice.

### Stranezze Android

*   Il `duration` parametro non è supportato. Lunghezze di registrazione non può essere limitato a livello di codice.

### BlackBerry 10 capricci

*   Il `duration` parametro non è supportato. Lunghezze di registrazione non può essere limitato a livello di codice.
*   Il `limit` parametro non è supportato, quindi solo una registrazione può essere creata per ogni chiamata.

### iOS stranezze

*   Il `limit` parametro non è supportato, quindi solo una registrazione può essere creata per ogni chiamata.

## capture.captureImage

> Avviare l'applicazione fotocamera e restituire informazioni sui file di immagine catturata.

    navigator.device.capture.captureImage(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureImageOptions options]
    );
    

### Descrizione

Avvia un'operazione asincrona per catturare immagini utilizzando l'applicazione della fotocamera del dispositivo. L'operazione consente agli utenti di catturare più immagini in una sola seduta.

L'operazione di acquisizione o termina quando l'utente chiude l'applicazione fotocamera, o il numero massimo di registrazioni specificato da `CaptureAudioOptions.limit` è raggiunto. Se non `limit` valore è specificato, il valore predefinito è uno (1) e l'operazione di acquisizione termina dopo l'utente acquisisce una singola immagine.

Quando termina l'operazione di acquisizione, richiama il `CaptureCB` callback con una matrice di `MediaFile` oggetti che descrivono ogni file immagine catturata. Se l'utente termina l'operazione prima di catturare un'immagine, la `CaptureErrorCB` callback viene eseguita con un `CaptureError` oggetto con un `CaptureError.CAPTURE_NO_MEDIA_FILES` codice di errore.

### Piattaforme supportate

*   Amazon fuoco OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 e 8
*   Windows 8

### Windows Phone 7 capricci

Invocando l'applicazione nativa fotocamera mentre il dispositivo è collegato tramite Zune non funziona, ed esegue il callback di errore.

### Esempio

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start image capture
    navigator.device.capture.captureImage(captureSuccess, captureError, {limit:2});
    

## CaptureImageOptions

> Incapsula le opzioni di configurazione cattura immagine.

### Proprietà

*   **limite**: il numero massimo di immagini che l'utente può catturare in un'operazione di cattura singola. Il valore deve essere maggiore o uguale a 1 (default 1).

### Esempio

    // limit capture operation to 3 images
    var options = { limit: 3 };
    
    navigator.device.capture.captureImage(captureSuccess, captureError, options);
    

### iOS stranezze

*   Il parametro **limite** non è supportato ed è presa solo una immagine per ogni invocazione.

## capture.captureVideo

> Avviare l'applicazione registratore video e restituire informazioni sui file di clip video catturati.

    navigator.device.capture.captureVideo(
        CaptureCB captureSuccess, CaptureErrorCB captureError, [CaptureVideoOptions options]
    );
    

### Descrizione

Avvia un'operazione asincrona per acquisire registrazioni video usando registrazione video applicazione del dispositivo. L'operazione consente all'utente di catturare più registrazioni in una sola seduta.

L'operazione di acquisizione termina quando l'utente chiude l'applicazione di registrazione video, o il numero massimo di registrazioni specificato da `CaptureVideoOptions.limit` è raggiunto. Se non `limit` valore del parametro è specificato, il valore predefinito è uno (1) e l'operazione di acquisizione termina dopo l'utente registra un unico video clip.

Quando termina l'operazione di acquisizione, e la `CaptureCB` callback viene eseguita con una matrice di `MediaFile` oggetti che descrivono ciascuna catturato file videoclip. Se l'utente termina l'operazione prima di catturare un video clip, il `CaptureErrorCB` callback viene eseguita con un `CaptureError` oggetto con un `CaptureError.CAPTURE_NO_MEDIA_FILES` codice di errore.

### Piattaforme supportate

*   Amazon fuoco OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 e 8
*   Windows 8

### Esempio

    // capture callback
    var captureSuccess = function(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    
    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    
    // start video capture
    navigator.device.capture.captureVideo(captureSuccess, captureError, {limit:2});
    

### BlackBerry 10 capricci

*   Cordova per BlackBerry 10 tenta di lanciare l'applicazione **Registratore Video** , fornito da RIM, per catturare le registrazioni video. L'applicazione riceve un `CaptureError.CAPTURE_NOT_SUPPORTED` codice di errore se l'applicazione non è installata sul dispositivo.

## CaptureVideoOptions

> Incapsula le opzioni di configurazione di cattura video.

### Proprietà

*   **limite**: il numero massimo di video clip utente del dispositivo in grado di catturare in un'operazione di cattura singola. Il valore deve essere maggiore o uguale a 1 (default 1).

*   **durata**: la durata massima di un clip video, in pochi secondi.

### Esempio

    // limit capture operation to 3 video clips
    var options = { limit: 3 };
    
    navigator.device.capture.captureVideo(captureSuccess, captureError, options);
    

### BlackBerry 10 capricci

*   Il parametro di **durata** non è supportato, quindi la lunghezza delle registrazioni non può essere limitata a livello di codice.

### iOS stranezze

*   Il parametro **limite** non è supportato. Solo un video viene registrato per ogni invocazione.

## CaptureCB

> Richiamato su di un'operazione di acquisizione di mezzi di successo.

    function captureSuccess( MediaFile[] mediaFiles ) { ... };
    

### Descrizione

Questa funzione viene eseguita al termine di un'operazione di acquisizione di successo. A questo punto che è stato catturato un file multimediale e neanche l'utente è stato terminato l'applicazione di cattura di media, o è stato raggiunto il limite di cattura.

Ogni `MediaFile` oggetto descrive un file multimediali catturati.

### Esempio

    // capture callback
    function captureSuccess(mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            path = mediaFiles[i].fullPath;
            // do something interesting with the file
        }
    };
    

## CaptureError

> Incapsula il codice di errore derivanti da un'operazione di acquisizione di mezzi falliti.

### Proprietà

*   **codice**: uno dei codici di errore predefiniti elencati di seguito.

### Costanti

*   `CaptureError.CAPTURE_INTERNAL_ERR`: La videocamera o il microfono non è riuscito a catturare l'immagine o il suono.

*   `CaptureError.CAPTURE_APPLICATION_BUSY`: L'applicazione di cattura audio o fotocamera sta attualmente scontando un'altra richiesta di cattura.

*   `CaptureError.CAPTURE_INVALID_ARGUMENT`: Utilizzo non valido dell'API (per esempio, il valore di `limit` è minore di uno).

*   `CaptureError.CAPTURE_NO_MEDIA_FILES`: L'utente chiude l'applicazione di cattura audio o fotocamera prima di catturare qualcosa.

*   `CaptureError.CAPTURE_NOT_SUPPORTED`: L'operazione di acquisizione richiesto non è supportato.

## CaptureErrorCB

> Richiamato se si verifica un errore durante un'operazione di acquisizione di mezzi di comunicazione.

    function captureError( CaptureError error ) { ... };
    

### Descrizione

Questa funzione viene eseguita se si verifica un errore quando si tenta di lanciare un media catturare operazione. Fallimento scenari includono quando l'applicazione di cattura è occupato, un'operazione di acquisizione è già in atto, o l'utente annulla l'operazione prima che tutti i file multimediali vengono catturati.

Questa funzione viene eseguita con un `CaptureError` oggetto contenente un errore appropriato`code`.

### Esempio

    // capture error callback
    var captureError = function(error) {
        navigator.notification.alert('Error code: ' + error.code, null, 'Capture Error');
    };
    

## ConfigurationData

> Incapsula un insieme di parametri di acquisizione multimediale che supporta un dispositivo.

### Descrizione

Descrive le modalità di cattura media supportato dal dispositivo. I dati di configurazione includono il tipo MIME e quote di cattura per l'acquisizione video o immagine.

I tipi MIME devono rispettare [RFC2046][1]. Esempi:

 [1]: http://www.ietf.org/rfc/rfc2046.txt

*   `video/3gpp`
*   `video/quicktime`
*   `image/jpeg`
*   `audio/amr`
*   `audio/wav`

### Proprietà

*   **tipo**: stringa di caratteri minuscoli con codifica ASCII il che rappresenta il tipo di supporto. (DOMString)

*   **altezza**: l'altezza dell'immagine o del video in pixel. Il valore è zero per clip audio. (Numero)

*   **larghezza**: la larghezza dell'immagine o del video in pixel. Il valore è zero per clip audio. (Numero)

### Esempio

    // retrieve supported image modes
    var imageModes = navigator.device.capture.supportedImageModes;
    
    // Select mode that has the highest horizontal resolution
    var width = 0;
    var selectedmode;
    for each (var mode in imageModes) {
        if (mode.width > width) {
            width = mode.width;
            selectedmode = mode;
        }
    }
    

Non supportato da qualsiasi piattaforma. Tutte le matrici di dati di configurazione sono vuote.

## MediaFile.getFormatData

> Recupera il formato informazioni su cattura file multimediale.

    mediaFile.getFormatData (MediaFileDataSuccessCB successCallback, [MediaFileDataErrorCB errorCallback]);
    

### Descrizione

Questa funzione in modo asincrono tenta di recuperare le informazioni sul formato del file multimediale. Se riuscito, richiama il `MediaFileDataSuccessCB` callback con un `MediaFileData` oggetto. Se il tentativo fallisce, questa funzione richiama il `MediaFileDataErrorCB` callback.

### Piattaforme supportate

*   Amazon fuoco OS
*   Android
*   BlackBerry 10
*   iOS
*   Windows Phone 7 e 8
*   Windows 8

### Amazon fuoco OS stranezze

L'API per informazioni sul formato dei file multimediali accesso è limitato, quindi non tutti `MediaFileData` proprietà supportate.

### BlackBerry 10 capricci

Non fornisce un'API per informazioni sui file multimediali, quindi tutti `MediaFileData` oggetti restituiscono con valori predefiniti.

### Stranezze Android

L'API per informazioni sul formato dei file multimediali accesso è limitato, quindi non tutti `MediaFileData` proprietà supportate.

### iOS stranezze

L'API per informazioni sul formato dei file multimediali accesso è limitato, quindi non tutti `MediaFileData` proprietà supportate.

## MediaFile

> Incapsula le proprietà di un file di acquisizione di mezzi di comunicazione.

### Proprietà

*   **nome**: il nome del file, senza informazioni sul percorso. (DOMString)

*   **fullPath**: il percorso completo del file, tra cui il nome. (DOMString)

*   **tipo**: tipo mime del file (DOMString)

*   **lastModifiedDate**: la data e l'ora quando il file è stato modificato. (Data)

*   **dimensioni**: le dimensioni del file in byte. (Numero)

### Metodi

*   **MediaFile.getFormatData**: recupera le informazioni sul formato del file multimediale.

## MediaFileData

> Incapsula le informazioni sul formato di un file multimediale.

### Proprietà

*   **codec**: il formato reale del contenuto audio e video. (DOMString)

*   **bitrate**: il bitrate medio del contenuto. Il valore è zero per le immagini. (Numero)

*   **altezza**: l'altezza dell'immagine o del video in pixel. Il valore è zero per clip audio. (Numero)

*   **larghezza**: la larghezza dell'immagine o del video in pixel. Il valore è zero per clip audio. (Numero)

*   **durata**: la lunghezza del clip video o audio in secondi. Il valore è zero per le immagini. (Numero)

### BlackBerry 10 capricci

Nessuna API fornisce informazioni sul formato dei file multimediali, quindi il `MediaFileData` oggetto restituito da `MediaFile.getFormatData` presenta i seguenti valori predefiniti:

*   **codec**: non supportato e restituisce`null`.

*   **bitrate**: non supportato e restituisce zero.

*   **altezza**: non supportato e restituisce zero.

*   **larghezza**: non supportato e restituisce zero.

*   **durata**: non supportato e restituisce zero.

### Amazon fuoco OS stranezze

Supporta i seguenti `MediaFileData` proprietà:

*   **codec**: non supportato e restituisce`null`.

*   **bitrate**: non supportato e restituisce zero.

*   **altezza**: supportati: solo i file immagine e video.

*   **larghezza**: supportati: solo i file immagine e video.

*   **durata**: supportati: audio e video file solo

### Stranezze Android

Supporta i seguenti `MediaFileData` proprietà:

*   **codec**: non supportato e restituisce`null`.

*   **bitrate**: non supportato e restituisce zero.

*   **altezza**: supportati: solo i file immagine e video.

*   **larghezza**: supportati: solo i file immagine e video.

*   **durata**: supportati: audio e video file solo.

### iOS stranezze

Supporta i seguenti `MediaFileData` proprietà:

*   **codec**: non supportato e restituisce`null`.

*   **bitrate**: supportato sui dispositivi iOS4 per solo audio. Restituisce zero per immagini e video.

*   **altezza**: supportati: solo i file immagine e video.

*   **larghezza**: supportati: solo i file immagine e video.

*   **durata**: supportati: audio e video file solo.