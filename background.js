chrome.browserAction.onClicked.addListener(function(){
	chrome.tabs.executeScript({file: "remove-popup.js"});
})