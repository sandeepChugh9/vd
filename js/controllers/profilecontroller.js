(function( W, events, utils ) {
    'use strict';

    var ProfileController = function( options ) {

        this.template = require( 'raw!../../templates/profile.html' );
    };

    ProfileController.prototype.destroy = function() {

    };

    ProfileController.prototype.bind = function( App, res ) {
        var that = this;

    };

    ProfileController.prototype.render = function( ctr, App, data ) {

    this.el = document.createElement( 'div' );
    this.el.className = 'quoteContainer animation_fadein noselect';
    this.el.innerHTML = Mustache.render( this.template, { quote:data.quote, author:data.author });
    ctr.appendChild( this.el );
    events.publish( 'update.loader', { show: false });
    this.bind( App, data );
};

module.exports = ProfileController;

})( window, platformSdk.events, platformSdk.utils );
