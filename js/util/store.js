(function(W, events){
	'use strict';

	var vault = {};

	var Store = function(){
		this.init();
	};

	Store.prototype.bind = function(){
		var that = this;

		events.subscribe('app.store.set', function(obj){
			that.set(obj);
		});

		events.subscribe('app.store.get', function(obj){
			that.get(obj);
		});
	};

	Store.prototype.set = function(obj){

		vault[obj.key] = vault[obj.key] || {};
		vault[obj.key] = obj.value;

		var str = JSON.stringify(vault);

		if (platformSdk.bridgeEnabled) PlatformBridge.putInCache('hikepay', str);
		else localStorage['hikepay'] = str;

		if (typeof obj.cb === "function"){
			var res = { status: 1 };
			obj.cb.call(obj.ctx, res);
		}
	};

	Store.prototype.get = function(obj){
		if (vault[obj.key]){
			if (typeof obj.cb === "function"){
				var res = {
					status: 1,
					results: vault[obj.key]
				};
				obj.cb.call(obj.ctx, res);
			}
		} else {
			if (typeof obj.cb === "function"){
				var res = { status: 0 };
				obj.cb.call(obj.ctx, res);
			}
		}
	};

	Store.prototype.init = function() {
		if (platformSdk.bridgeEnabled) {
			platformSdk.nativeReq({
				fn: 'getFromCache',
				ctx: this,
				data: "hikepay",
				success: function(response){
					if (response === "") vault = {};
					else {
						response = decodeURIComponent(response);
						try {
							vault = JSON.parse(response);
						} catch (e){
							// raise alarm. we got no data.
						}
					}
				}
			});	
		} else if (localStorage['hikepay']) vault = JSON.parse(localStorage['hikepay']);
		
		this.bind();
	};

	module.exports = new Store();

})(window, platformSdk.events);