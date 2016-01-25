(function () {
    'use strict';

    module.exports = {
        DEV_ENV: 'dev',
        STAGING_ENV: 'staging',
        PROD_ENV:    'prod',

        ConnectionTypes: {
            NO_NETWORK: '-1',
            UNKNOWN: '0',
            WIFI: '1',
            TWO_G: '2',
            THREE_G: '3',
            FOUR_G: '4'
        },

        Events: {
            NAVIGATE_APP: 'app.navigate',
            TOGGLE_BLOCK: 'app.menu.om.block',
            RESET_APP: 'app.reset'
        },
    };

})();