import { unicodeToBase64, base64ToUnicode } from './Encoding';

// https://stackoverflow.com/questions/30106476/using-javascripts-atob-to-decode-base64-doesnt-properly-decode-utf-8-strings
it('Unicode converting to Base64 and vice versa', () => {
    const pairs = [
        {u: 'english w00rds', b: 'ZW5nbGlzaCB3MDByZHM=' },
        {u: '✓ à la mode', b: '4pyTIMOgIGxhIG1vZGU=' },
        {u: 'руззкая мова', b: '0YDRg9C30LfQutCw0Y8g0LzQvtCy0LA=' },
    ];

    pairs.forEach(pair => {
        const b = unicodeToBase64(pair.u);
        expect(b).toEqual(pair.b);

        const u = base64ToUnicode(pair.b);
        expect(u).toEqual(pair.u);
    });
    
});
