// Copyright (c) 2015. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function updateUI(tabId) {
  chrome.tabs.sendMessage(tabId, 'RENDER_CSLINK', function(show) {
    if (show) {
      chrome.pageAction.show(tabId);
    } else {
      chrome.pageAction.hide(tabId);
    }
  });
}

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message == 'REFRESH_TAB') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.reload(tabs[0].id);
        });
    }
});

chrome.tabs.onUpdated.addListener(function(tabId, change, tab) {
  if (change.status == "complete") {
    updateUI(tabId);
  }
});

// Ensure the current selected tab is set up.
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  updateUI(tabs[0].id);
});
