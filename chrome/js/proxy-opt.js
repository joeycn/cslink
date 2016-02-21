function restore_options(options) {
	var inst = document.getElementById('cslink-inst');
    inst.innerHTML = '';
	for(var i=0; i<options.length; ++i) {
		var opt = options[i];
		var elm_opt = document.createElement('option');
		elm_opt.value = opt.short + '-' + opt.proxy;
		elm_opt.textContent = opt.name;
		inst.appendChild(elm_opt);
	}
	chrome.storage.sync.get({proxy: "", server_name: ""}, function(item) {
		inst.value = item.server_name + '-' + item.proxy;
	});
}

function save_options() {
	var name_proxy = document.getElementById('cslink-inst').value;
	var pos = name_proxy.indexOf('-');
	var server_name = name_proxy.substr(0, pos);
	var proxy = name_proxy.substr(pos+1);
	chrome.storage.sync.set({proxy: proxy, server_name: server_name}, function() {
		var status = document.getElementById('status');
        if(status) {
            status.textContent = 'Options saved.';
            setTimeout(function() {
                status.textContent = '';
            }, 750);
        }
	});
}

function get_proxy(callback) {
	var list_url = "https://raw.githubusercontent.com/joeycn/cslink/master/data/supported.json";
	chrome.storage.sync.get({access: 0}, function(item) {
		if(new Date().getTime() - item.access < 86400 * 1000) {
			chrome.storage.sync.get({proxies: []}, function(item) {
				callback(item.proxies);
			});
		} else {
			var xhr = new XMLHttpRequest();
			xhr.open("GET", list_url, true);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				var proxies = JSON.parse(xhr.responseText);
				chrome.storage.sync.set({proxies: proxies, access: new Date().getTime()}, function() {
					callback(proxies);
				});
			  }
			}
			xhr.send();
		}
	});
}

function load_opt_form(ui_id, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", chrome.extension.getURL('pages/option-dialog.html'), true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        $('#' + ui_id + ' .modal-content').html(xhr.responseText);
        get_proxy(restore_options);
        $('#cslink-inst').on('change', save_options);
        if(callback) callback();
      }
    }
    xhr.send();
}