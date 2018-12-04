// https://github.com/matheuss/google-translate-token/blob/master/index.js
/**
 * Last update: 2016/06/26
 * https://translate.google.com/translate/releases/twsfe_w_20160620_RC00/r/js/desktop_module_main.js
 *
 */

export interface IGoogleToken {
  name: string;
  value: string;
}

export class GoogleTokenApi {
  yr = null;

  readonly window = {
    TKK: localStorage.getItem('TKK') || '0'
  };

  readonly wr = function (a: any) {
    return function () {
      return a;
    };
  };

  private xr(a: any, b: any) {
    for (let c = 0; c < b.length - 2; c += 3) {
      const d1 = b.charAt(c + 2);
      let d = 'a' <= d1 ? d1.charCodeAt(0) - 87 : Number(d1);
      d = '+' === b.charAt(c + 1) ? a >>> d : a << d;
      a = '+' === b.charAt(c) ? a + d & 4294967295 : a ^ d;
    }
    return a;
  }

  private sM(a: any) {
    let b;
    if (null !== this.yr) {
      b = this.yr;
    } else {
      b = this.wr(String.fromCharCode(84));
      const c = this.wr(String.fromCharCode(75));
      b = [b(), b()];
      b[1] = c();
      b = (this.yr = this.window[b.join(c())] || '') || '';
    }
    const d1 = this.wr(String.fromCharCode(116));
    const c1 = this.wr(String.fromCharCode(107));
    let d = [d1(), d1()];

    d[1] = c1();
    const c = '&' + d.join('') + '=';
    d = b.split('.');
    b = Number(d[0]) || 0;
    const e = [];
    for (let f = 0, g = 0; g < a.length; g++) {
      let l = a.charCodeAt(g);
      128 > l
        ? e[f++] = l
        : (
          2048 > l
            ? e[f++] = l >> 6 | 192
            : (
              55296 === (l & 64512) && g + 1 < a.length && 56320 === (a.charCodeAt(g + 1) & 64512)
                ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                  e[f++] = l >> 18 | 240,
                  e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
              e[f++] = l >> 6 & 63 | 128),
          e[f++] = l & 63 | 128);
    }
    a = b;
    for (let f = 0; f < e.length; f++) {
      a += e[f],
        a = this.xr(a, '+-a^+6');
    }
    a = this.xr(a, '+-3^+b+-f');
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + '.' + (a ^ b));
  }

  private updateTKK() {
    console.log('window', this.window);
    return new Promise((resolve, reject) => {
      // skipped since
      // Cross-Origin Read Blocking (CORB) blocked cross-origin response https://translate.google.com/ with MIME type text/html. See https://www.chromestatus.com/feature/5629709824032768 for more details.
      resolve();
      return;

      const now = Math.floor(Date.now() / 3600000);

      console.log('window', this.window);
      if (Number(this.window.TKK.split('.')[0]) === now) {
        resolve();
      } else {
        fetch('https://translate.google.com', { method: 'GET', mode: 'no-cors' })
          .then((body) => {
            console.log('window', this.window);

            const regex = /(.*?)\(\)\)'\);/g;

            const regexResults = regex.exec(body.toString());

            if (regexResults && regexResults.length > 0) {
              const TKK = regexResults[0];
              /* eslint-disable no-undef */
              if (typeof TKK !== 'undefined') {
                this.window.TKK = TKK;
                localStorage.set('TKK', TKK);
              }
              /* eslint-enable no-undef */
            }

            /**
             * Note: If the regex or the eval fail, there is no need to worry. The server will accept
             * relatively old seeds.
             */

            resolve();
          }).catch((err) => {
            console.error(err);
            // const e = new Error();
            // e.name = 'BAD_NETWORK';
            // e.message = err.message;
            // reject(e);
            resolve();
          });
      }
    });
  }

  get(text: string): Promise<IGoogleToken> {
    return this.updateTKK().then(() => {
      let tk = this.sM(text);
      tk = tk.replace('&tk=', '');
      return { name: 'tk', value: tk };
    }).catch(function (err) {
      throw err;
    });
  }
}
