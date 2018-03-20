///<reference path='./../scripts/chrome/chrome.d.ts' />

import { Injectable } from '@angular/core';

@Injectable()
export class ContextMenu {
    constructor() {
        console.log('here are we go');

        const appName = 'shlang';
        chrome.contextMenus.create({
            'id': 'selection' + '-' + appName,
            'title': appName + '\'selection\' menu item',
            'contexts': ['selection']
        });

        chrome.contextMenus.create({
            'id': 'page' + '-' + appName,
            'title': appName + '\'page\' menu item',
            'contexts': ['page']
        });

        chrome.contextMenus.onClicked.addListener(
            (info, tab) => {
                console.log(JSON.stringify(info));

                if (!info || !info.menuItemId) {
                    console.log('no info about contextMenu');
                }
                if (info.menuItemId.startsWith('selection')) {
                    let text = info.selectionText;
                    console.log(text);
                    if (text) {
                        text = encodeURI(text);
                        chrome.tabs.create({
                            url: '/index.html' + '?text=' + text
                        });
                        // TODO open index.html and pass selection
                    }
                } else if (info.menuItemId.startsWith('page')) {
                    let pageUrl = info.pageUrl;
                    console.log(pageUrl);
                    if (pageUrl) {
                        pageUrl = encodeURI(pageUrl);
                        chrome.tabs.create({
                            url: '/index.html' + '?pageUrl=' + pageUrl
                        });
                    }
                } else {
                    console.log('item ' + info.menuItemId + ' was clicked');
                    console.log('info: ' + JSON.stringify(info));
                    console.log('tab: ' + JSON.stringify(tab));
                }
            });
    }
}
