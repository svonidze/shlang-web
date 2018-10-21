export function extractTextFromHtml(html: string): string {
    const doc = (new DOMParser).parseFromString(html, 'text/html').documentElement;

    const elements = doc.querySelectorAll('style, script');

    let i = 0;
    let element: Element;
    while (element = elements[i]) {
        if (!element.parentNode) {
            i++;
            continue;
        }
        element.parentNode.removeChild(element);
    }

    return doc.textContent!
        .replace(/(\r?\n)+(\s)+/g, '\r\n')
        .replace(/(\s){2,}/g, '$1');
}