// var contexts = ["page", "selection", "link", "editable", "image", "video",    "audio"];
// "type": ["checkbox", "radio"]

function onClickHandler(info, tab) {
    console.log(JSON.stringify(info));
  
    if(!info || !info.menuItemId){
      console.log('no info about contextMenu');
    }
    else if (info.menuItemId.startsWith("selection")) {
      console.log(info.selectionText);
      if (info.selectionText) {
        var encodedText = encodeURI(info.selectionText);
        chrome.tabs.create({ 
          // documentUrlPatterns: [ "chrome-extension://*/index.html" + "?text=" + encodedText],
          url: "/index.html?text=" + encodedText 
        });
        // TODO open index.html and pass selection
      }
    } else if (info.menuItemId.startsWith("page")) {
      console.log(info.pageUrl);
      if (info.pageUrl) {
        var encodedPageUrl = encodeURI(info.pageUrl);
        
        chrome.tabs.create({ 
          url: "/index.html?url=" + encodedPageUrl 
        });
      }
    } else {
      console.log("item " + info.menuItemId + " was clicked");
      console.log("info: " + JSON.stringify(info));
      console.log("tab: " + JSON.stringify(tab));
    }
  };
  
  chrome.contextMenus.onClicked.addListener(onClickHandler);
  
  // Set up context menu tree at install time.
  chrome.runtime.onInstalled.addListener(function () {
    var appName = "shlang";
  
    chrome.contextMenus.create({
      "id": `selection-${appName}`,
      "title": `Send text to ${appName}`,
      "contexts": ["selection"]
    });
  
    chrome.contextMenus.create({
      "id": `page-${appName}`,
      "title": `Send page to ${appName}`,
      "contexts": ["page"]
    });
  
  
    // var contexts = ["page", "selection", "link", "editable", "image", "video",
    //   "audio"];
    // for (var i = 0; i < contexts.length; i++) {
    //   var context = contexts[i];
    //   var title = "shlang '" + context + "' menu item";
    //   var id = chrome.contextMenus.create({
    //     "title": title, 
    //     "contexts": [context],
    //     "id": "shlang-" + context
    //   });
    //   console.log("'" + context + "' item:" + id);
    // }
  
    // chrome.contextMenus.create({"title": "Oops", "id": "child1"}, function() {
    //   if (chrome.extension.lastError) {
    //     console.log("Got expected error: " + chrome.extension.lastError.message);
    //   }
    // });
  });