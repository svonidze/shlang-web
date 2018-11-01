const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";

/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
export function insertFile(fileData: File, callback: Function) {
    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = (e) => {
        var contentType = fileData.type;

        var base64Data = btoa(reader.result as string);
        newFile(fileData.name, contentType, base64Data, callback);
    };
}

export function newFile(
    fileName: string, 
    contentType: string, 
    base64Data: string, 
    callback: Function) {
    contentType = contentType || 'application/octet-stream';
    var metadata = {
        'title': fileName,
        'mimeType': contentType
    };

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': { 'uploadType': 'multipart' },
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });

    request.execute((file: gapi.client.Response<gapi.client.drive.File>) => {
        callback = callback || responseCallback;
        if (file) {
            console.log('File created', file);
        }
        else {
            console.warn('Could not createt a new file');
        }
        callback(file);
    });

}

function updateDriveFile(fileId: string, contentType: string, base64Data: string, callback = null) {
    if (!fileId) {
        throw 'Missed fileId';
    }

    contentType = contentType || 'application/octet-stream';

    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        // JSON.stringify({}) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': `/upload/drive/v2/files/${fileId}`,
        'method': 'PUT',
        'params': { 'uploadType': 'multipart', 'alt': 'json' },
        'headers': {
            'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody
    });

    request.execute(callback || responseCallback);
}

function readDriveFile(fileId: string, callback: (response: gapi.client.Response<any>) => void) {
    var request = gapi.client.request({
        'path': `/drive/v2/files/${fileId}`,
        'method': 'GET',
        'params': { 'alt': 'media' },
        // 'headers': {
        //     'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        // }
    });

    request.execute(callback || responseCallback);
}

function downloadDriveFile1(fileId: string, callback: Function) {
    /*callback = callback || responseCallback;

    var request = gapi.client.drive.files.get({
        'fileId': fileId,
        //'alt': 'media'
    });
    var requestExecuteResult = request.execute((response) => {

        console.log(response, request, response.body);
        console.log('Title: ' + response.title);
        console.log('Description: ' + response.description);
        console.log('MIME type: ' + response.mimeType);

        if (response.downloadUrl) {
            var accessToken = gapi.auth.getToken().access_token;
            var xhr = new XMLHttpRequest();
            xhr.open('GET', response.downloadUrl);
            xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
            xhr.onload = function () {
                callback(xhr.responseText);
            };
            xhr.onerror = function () {
                callback(null);
            };
            xhr.send();
        } else {
            callback(null);
        }
    });
    //.then(result => console.log('requestExecuteResult', result) );
    */
}

export function downloadDriveFile(fileId: string, accessToken: string, callback: (data: any) => void) {
    callback = callback || responseCallback;

    // var accessToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token;
    //var accessToken = gapi.auth.getToken().access_token;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://www.googleapis.com/drive/v3/files/" + fileId + '?alt=media', true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
    xhr.responseType = 'arraybuffer'
    xhr.onload = (e) => {
        console.log(xhr, xhr.response);
        //base64ArrayBuffer from https://gist.github.com/jonleighton/958841
        var data = _arrayBufferToString(xhr.response);
        // var base64 = _arrayBufferToString(xhr.response);
        callback(data);
    };
    // xhr.onreadystatechange = function () {
    //     if(xhr.readyState === 4 && xhr.status === 200) {
    //       console.log(xhr.responseText);
    //     }
    //   };
    xhr.onerror = (e) =>
        alert("Error Status: " + e.target/*.status*/);
    xhr.send();
}

function responseCallback(response: any) { // gapi.client.Response<T>
    if (!response || response.error) {
        alert('File could not be handled, see console log');
        console.log(response)
    }

    return response;
}

function _arrayBufferToString(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}

function _arrayBufferToBase64(buffer: ArrayBuffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// https://gist.github.com/jonleighton/958841
function base64ArrayBuffer(arrayBuffer: ArrayBuffer) {
    var base64 = ''
    var encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    var bytes = new Uint8Array(arrayBuffer)
    var byteLength = bytes.byteLength
    var byteRemainder = byteLength % 3
    var mainLength = byteLength - byteRemainder

    var a, b, c, d
    var chunk

    // Main loop deals with bytes in chunks of 3
    for (var i = 0; i < mainLength; i = i + 3) {
        // Combine the three bytes into a single integer
        chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

        // Use bitmasks to extract 6-bit segments from the triplet
        a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
        b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
        c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
        d = chunk & 63               // 63       = 2^6 - 1

        // Convert the raw binary segments to the appropriate ASCII encoding
        base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
    }

    // Deal with the remaining bytes and padding
    if (byteRemainder == 1) {
        chunk = bytes[mainLength]

        a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

        // Set the 4 least significant bits to zero
        b = (chunk & 3) << 4 // 3   = 2^2 - 1

        base64 += encodings[a] + encodings[b] + '=='
    } else if (byteRemainder == 2) {
        chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

        a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
        b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

        // Set the 2 least significant bits to zero
        c = (chunk & 15) << 2 // 15    = 2^4 - 1

        base64 += encodings[a] + encodings[b] + encodings[c] + '='
    }

    return base64
}