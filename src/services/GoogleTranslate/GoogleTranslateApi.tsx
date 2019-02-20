import { GoogleTokenApi } from './GoogleTokenApi';
import { Languages } from '../../constants/Languages';

export interface ITransaleOption {
    from?: string;
    to?: string;
    raw?: boolean;
}

export class GoogleTranslateApi {

    safeEval = require('safe-eval');

    translate(text: string, opts: ITransaleOption) {
        opts = opts || {};

        for (const lang of [opts.from, opts.to]) {
            if (lang && !Languages.isSupported(lang)) {
                const e = new Error();
                e.name = '400';
                e.message = `The language '${lang}' is not supported`;
                return new Promise((resolve, reject) => reject(e));
            }
        }

        opts.from = opts.from || 'auto';
        opts.to = opts.to || 'en';
        opts.from = Languages.getCode(opts.from);
        opts.to = Languages.getCode(opts.to);
        console.log(text, opts);

        const googleToken = new GoogleTokenApi();

        return googleToken.get(text).then((token) => {
            console.log('got token', token);
            // https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&hl=en-US&dt=t&dt=bd&dj=1&source=icon&tk=514871.514871&q=strings
            const url = new URL('https://translate.googleapis.com/translate_a/single');
            const data = {
                client: 'gtx',
                sl: opts.from,
                tl: opts.to,
                hl: opts.to,
                dt: ['at', 'bd', 'ex', 'ld', 'md', 'qca', 'rw', 'rm', 'ss', 't'],
                ie: 'UTF-8',
                oe: 'UTF-8',
                otf: 1,
                ssel: 0,
                tsel: 0,
                kc: 7,
                tk: token.value,
                q: encodeURI(text)
            };
            // data[token.name] = token.value;
            for (const key in data) {
                if (data.hasOwnProperty(key)) {
                    if (data[key] instanceof Array) {
                        data[key].forEach((value: any) => {
                            url.searchParams.append(key, value);
                        });
                    } else {
                        url.searchParams.set(key, data[key]);
                    }
                }
            }
            console.log(url);
            console.log(encodeURI(url.toString()));
            return url.toString();
        }).then((url) => {
            return this.callAndParse(opts, url);
        });
    }

    private callAndParse(opts: ITransaleOption, url: string) {
        return fetch(url, { method: 'GET', mode: 'cors' })
            .then((response) => response.text())
            .then(rawBody => {
                const result = {
                    text: '',
                    from: {
                        language: {
                            didYouMean: false,
                            iso: ''
                        },
                        text: {
                            autoCorrected: false,
                            value: '',
                            didYouMean: false
                        }
                    },
                    raw: ''
                };
                if (opts.raw) {
                    result.raw = rawBody;
                }
                const body = this.safeEval(rawBody);
                console.log(body);
                body[0].forEach((obj: any) => {
                    if (obj[0]) {
                        result.text += obj[0];
                    }
                });
                if (body[2] === body[8][0][0]) {
                    result.from.language.iso = body[2];
                } else {
                    result.from.language.didYouMean = true;
                    result.from.language.iso = body[8][0][0];
                }
                if (body[7] && body[7][0]) {
                    let str = body[7][0];
                    str = str.replace(/<b><i>/g, '[');
                    str = str.replace(/<\/i><\/b>/g, ']');
                    result.from.text.value = str;
                    if (body[7][5] === true) {
                        result.from.text.autoCorrected = true;
                    } else {
                        result.from.text.didYouMean = true;
                    }
                }
                console.log(result);
                return result;
            }).catch(function (err) {
                console.log('error', err);
                const ex = new Error();
                if (err.statusCode !== undefined && err.statusCode !== 200) {
                    ex.name = 'BAD_REQUEST';
                } else {
                    ex.name = 'BAD_NETWORK';
                }
                throw ex;
            });
    }
}