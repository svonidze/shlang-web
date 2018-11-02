import { arrayBufferToString } from "src/services/Encoding";

const boundary = '-------314159265358979323846';
const delimiter = "\r\n--" + boundary + "\r\n";
const close_delim = "\r\n--" + boundary + "--";

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
        console.log(e, xhr, xhr.response);
        let response: string = '';
        switch (xhr.responseType) {
            case "arraybuffer":
                response = arrayBufferToString(xhr.response);
                break;
            case "json":
                response = xhr.response;
            default:
                console.error(`Response type ${xhr.responseType} is not supported`, xhr.response);
                break;

        }

        if (xhr.status === 403) {
            /* TODO parse the error response
                        content {
             "error": {
              "errors": [
               {
                "domain": "global",
                "reason": "fileNotDownloadable",
                "message": "Only files with binary content can be downloaded. Use Export with Google Docs files.",
                "locationType": "parameter",
                "location": "alt"
               }
              ],
              "code": 403,
              "message": "Only files with binary content can be downloaded. Use Export with Google Docs files."
             }
            }
            */
            console.error(response);
            return;
        }
        var data = arrayBufferToString(xhr.response);
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