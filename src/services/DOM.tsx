/**
* 
* @param {string} url URL of external file
* @param location location to insert the <script> element
* @param onLoad code to be called from the file
*/
export function loadAndInjectJS(url: string, location: HTMLElement, onLoad: () => void){
    const scriptTag = document.createElement('script');
    scriptTag.src = url;
    scriptTag.onload = onLoad;

    location.appendChild(scriptTag);
}