export function unicodeToBase64(unicode: string) {
    return btoa(encodeURIComponent(unicode).replace(/%([0-9A-F]{2})/g, function (match, p1) {
        return String.fromCharCode(parseInt(p1, 16))
    }))
}

export function base64ToUnicode(base64: string) {
    return decodeURIComponent(Array.prototype.map.call(atob(base64), function (c: string) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
}

// https://stackoverflow.com/questions/6965107/converting-between-strings-and-arraybuffers
export function arrayBufferToString(buffer: ArrayBuffer, encoding = 'utf-8') {
    // var uint8array = new TextEncoder().encode(string);
    // var string = new TextDecoder(encoding).decode(uint8array);

    return new TextDecoder(encoding).decode(buffer);
}
