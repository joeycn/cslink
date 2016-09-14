// Copyright (c) 2016. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var proxy_server = null;
var server_name = null;

if (window == top) {
  chrome.storage.sync.get({proxy: null, server_name: null}, function(item) {
    proxy_server = item.proxy;
    server_name = item.server_name;
  });
  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if(message == 'RENDER_CSLINK') {
        sendResponse(findAddress());
    }
  });
}

var prox_addr = function(url) {
	if(url && proxy_server) {
		var slash = url.indexOf('/',10);
		return url.substr(0, slash) + '.' + proxy_server +  url.substr(slash);
	} else if(!proxy_server) {
        var dialog = $('#cslink-dialog-container');
        if(dialog.length == 0) {
            var dialog = $('<div id="cslink-dialog-container" class="modal fade" tabindex="-1" role="dialog">');
            $(document.body).append(dialog);
            $('<div class="modal-dialog"><div class="modal-content"></div></div>').appendTo(dialog);
        }

        load_opt_form('cslink-dialog-container', 
            function() {
                $('#cslink-icon').attr('src', chrome.extension.getURL('icons/ico-39.png'));
                $('#cslink-dialog-container').modal();
                $('#cslink-dialog-container').on('hide.bs.modal', function (e) {
                    // refresh the current tab
                    chrome.runtime.sendMessage('REFRESH_TAB');
                });
            });
    }
}

var findAddress = function() {
    var found = false;
    
	$('div.gs_r').each(function(index) {
		var url = prox_addr($(this).find('h3.gs_rt a').attr('href'));
		var link_text = 'Access via ' + server_name;
		if(!url) return;
		
		var link_a = $('<a class="cslink" alt="' + link_text + '">')
						.attr('href', url)
						.css('color', '#f58025')
						.text(link_text);
    var link_item = $('<div class="gs_ggsd">');
    var link_container = $('<div class="gs_ggsm"></div>');
    
    link_item.append(link_a);
    link_container.append(link_item);

		var link_box = $(this).find('div.gs_ggs.gs_fl');
		if(link_box.length == 0) {
			link_box = $('<div class="gs_ggs gs_fl"></div>');
			link_box.append(link_container);
			$(this).prepend(link_box);
		} else {
			link_box.append(link_container);
		}
		found = true;
	});

    return found;
}
