export function extractTextFromHtml(html: string): string | undefined {
    const doc = new DOMParser().parseFromString(html, 'text/html').documentElement;

    if(!doc){
        console.warn('The following HTML could not parsed', html)
        return undefined;
    }

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