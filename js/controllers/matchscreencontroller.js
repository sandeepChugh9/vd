(function (W, events, utils) {
    'use strict';

    var MatchScreenController = function (options) {

        this.template = require('raw!../../templates/matchscreen.html');
    };

    MatchScreenController.prototype.destroy = function () {

    };

    MatchScreenController.prototype.bind = function (App, res) {
        var that = this; 
        if (platformSdk.bridgeEnabled) {
            App.SantaService.getMatchScreen(function (res) {
                console.log("I am in the homescreen page MF");
                console.log(res);
                //App.router.navigateTo('/matchscreen',{})
            });
        }
        else {
            App.SantaService.getMatchScreen(function (res) {
                console.log(res.content);
                console.log(res.author.name)
                //App.router.navigateTo('/matchscreen',{})
            });
        }


    };


MatchScreenController.prototype.render = function (ctr, App, data) {


    this.el = document.createElement('div');
    this.el.className = "quoteContainer animation_fadein noselect";
    this.el.innerHTML = Mustache.render(this.template, {quote:data.quote, author:data.author});
    ctr.appendChild(this.el);
    events.publish('update.loader', {show: false});
    this.bind(App, data);
};

module.exports = MatchScreenController;


})(window, platformSdk.events, platformSdk.utils);