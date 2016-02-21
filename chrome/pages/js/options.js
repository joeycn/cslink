$(document).ready(function() {
  get_proxy(restore_options);
  $('#cslink-inst').on('change', function(){
      save_options();
      // refresh the current tab
      chrome.runtime.sendMessage('REFRESH_TAB');
  });
});