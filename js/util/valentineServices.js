(function( W, platformSdk ) {
    'use strict';

    var utils = require( './utils.js' );
    var checkTimeout = null;

    var ValentineServices = function( service ) {
        this.ValentineServices = service;
    };

    var URL = {
        location: appConfig.API_URL
    };

    ValentineServices.prototype = {

        subscribeToValentine: function( fn, x ) {
            var params = {
                'url': URL.location + '/subscribe',
                'type': 'POST'
            };
            if ( typeof fn === 'function' ) return this.ValentineServices.communicate( params, fn, x );
            else this.ValentineServices.communicate( params );
        },

};

module.exports = ValentineServices;

})( window, platformSdk );
