(function (W, events, utils) {
    'use strict';

    var HomeScreenController = function (options) {

        this.template = require('raw!../../templates/homescreen.html');
    };

    HomeScreenController.prototype.destroy = function () {

    };

    HomeScreenController.prototype.bind = function (App, res) {
        var that = this; 

        var continuebutton = this.el.getElementsByClassName('continue')[0];
        continuebutton.addEventListener('click', function(ev) {
            console.log("i clicked the button");
            App.router.navigateTo('/profile',{})
        });

        if (platformSdk.bridgeEnabled) {
            App.SantaService.getHomeScreen(function (res) {
                console.log("I am in the homescreen page MF");
                console.log(res);
                //App.router.navigateTo('/homescreen',{})
            });
        }
        else {
            App.SantaService.getHomeScreen(function (res) {
                console.log(res.content);
                console.log(res.author.name)
                //App.router.navigateTo('/homescreen',{})
            });
        }

    };


// console.log("hahaga"+quoteContainer);

//quoteContainer.style.background = "#fff";


HomeScreenController.prototype.render = function (ctr, App, data) {


    this.el = document.createElement('div');
    this.el.className = "quoteContainer animation_fadein noselect";
    this.el.innerHTML = Mustache.render(this.template, {quote:data.quote, author:data.author});
    ctr.appendChild(this.el);
    events.publish('update.loader', {show: false});
    this.bind(App, data);
};

module.exports = HomeScreenController;


})(window, platformSdk.events, platformSdk.utils);