qstr	= require('querystring');
http 	= require('http');
function NEM(cfg) {
	var _http = http;
	var _qstr = qstr;
	// default configuration values
	var _cfg = {
		nis: {address: '127.0.0.1', port: 7890, web_context:'/' },
		ncc: {address: '127.0.0.1', port: 8989, web_context:'/ncc/api/' }
	};
	this.setOptions = function(opts) {
		if (! opts) return;
		for(var key in opts) {
			var val = opts[key];
			var arr = key.split('_');
			if (arr.length != 2) continue;
			_cfg[arr[0]][arr[1]] = val;
		}
	};
	if (! cfg) {
		;; // do nothing
	}
	else {	// set the configuration values
		this.setOptions(cfg);
	}
	// self object reference
	var _self = this;

	var _send = function(req_type,call,params,error,callback) {

		var rqdata = JSON.stringify(params);
		call['method'] = req_type;
		call['headers'] = {
			'Content-Type': 'application/json',
			'Content-Length': params == null ? 0 : rqdata.length
		};
		if (req_type == "GET" && params != null) {
			var pos = call['path'].indexOf('?');
			if (pos != -1) {
				call['path'] = call['path'].substring(0,pos);
			}
			rqdata = _qstr.stringify(params);
			call['path'] += '?' + rqdata;
			//delete call['headers'];
		}
		var req = _http.request(call, function(res) {
			res.setEncoding('utf-8');
			var restxt = '';
			res.on('data', function(data) { restxt += data; });
			res.on('end', function() {
				var obj = JSON.parse(restxt);
				return callback(obj);
			});
		});
		//console.log(rqdata);
		req.on('error', function(e) { error(e); });
		req.write(rqdata);
		req.end();
	};
	var _get_valid_call = function(type,uri) {
		if (! _cfg[type]) return null;
		if (uri.length == 0) return null;
		if (uri.substring(0,1) == '/')
		var options = {
			host: _cfg[type].address,
			port: _cfg[type].port,
			path: _cfg[type].web_context + (uri.substring(0,1) == '/' ? uri.substring(1) : uri)
		};
		console.log(options);
		return options;
	};
	this.getOptions = function() {
		// return a object with key values pairs
		if (arguments.length == 0) {
			var opts = new Object();

			for(var svc in _cfg) {
				var service = _cfg[svc];
				for (var key in service)
					opts[svc + '_' + key] = service[key];
			}
			return opts;
		}
		// return a single value if the key is found
		else if (arguments.length == 1) {

			var keys = arguments[0].split('_');
			if (! _cfg[keys[0]]) return null;
			if (! _cfg[keys[0]][keys[1]]) return null;

			return _cfg[keys[0]][keys[1]];
		}

		return null;
	}

	this.nisPost = function(uri,data,error,callback) {

		var opts = _get_valid_call('nis',uri);
		_send('POST',opts,data,error,callback);
	};

	this.nisGet = function(uri,data,error,callback) {

		var opts = _get_valid_call('nis',uri);
		_send('GET',opts,data,error,callback);
	};

	this.nccPost = function(uri,data,error,callback) {

		var opts = _get_valid_call('ncc',uri);
		_send('POST',opts,data,error,callback);
	};

	this.nccGet = function(uri,data,error,callback) {

		var opts = _get_valid_call('ncc',uri);
		_send('GET',opts,data,error,callback);
	};
}

module.exports = NEM;
