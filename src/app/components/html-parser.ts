import { Injectable } from '@angular/core';

@Injectable()
export class HtmlParser {

    extractText(html: string): string {
        const doc = (new DOMParser).parseFromString(html, 'text/html').documentElement;

        const elements = doc.querySelectorAll('style, script');

        console.log(elements);

        let i = 0;
        let element: Element;
        while (element = elements[i]) {
            if (!element.parentNode) {
                console.log(element);
                i++;
                continue;
            }
            element.parentNode.removeChild(element);
        }

        return doc.textContent.replace(/[\n\r\s]{2,}/g, '');
    }
}
