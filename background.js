var getCurrentTab = function(callback){
	chrome.tabs.query({active:true, currentWindow:true}, function(tabs){
		var currTab = tabs[0];
		callback(currTab);
	});
};

chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  if (changeInfo.status == 'complete') {

    chrome.tabs.executeScript(tabId, {file: "remove-popup.js"});

  }
})

chrome.browserAction.onClicked.addListener(function(){
	//chrome.tabs.executeScript({file: "remove-popup.js"});
	getCurrentTab(function(currTab){
		chrome.tabs.sendMessage(currTab.id, {removePopup:true});
	});
})