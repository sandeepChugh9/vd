(function (W, events, utils) {
    'use strict';

    var GiftCounter = function (options) {
        this.template = require('raw!../../templates/giftsdisabled.html');
    };

    GiftCounter.prototype.destroy = function(){

    };

    GiftCounter.prototype.bind = function(App, res){
        var that = this;
        
    };

    GiftCounter.prototype.timeConversion = function(t){

        var milliseconds = t*1000;
        var diffTime = {};

        function numberEnding (number) {
            return (number > 1) ? 's' : '';
        }

        var temp = Math.floor(milliseconds / 1000);

        var days = Math.floor((temp %= 31536000) / 86400);
        if (days) {
            diffTime.days = days;
        }else{
            diffTime.days = 0;
        }
        var hours = Math.floor((temp %= 86400) / 3600);
        if (hours) {
            diffTime.hours = hours;
        }
        else{
            diffTime.hours = 0;
        }
        var minutes = Math.floor((temp %= 3600) / 60);
        if (minutes) {
            diffTime.minutes = minutes;
        }
        else{
            diffTime.minutes = 0;
        }
        var seconds = temp % 60;
        if (seconds) {
            diffTime.seconds = seconds;
        }
        
        if(diffTime){
            return diffTime;
        }
        else{
            return  0;
        }
    };

    GiftCounter.prototype.render = function(ctr, App, data) {

        this.diffTimeObject = this.timeConversion(data.delta);
        
        this.el = document.createElement('div');
        this.el.className = "panelContainer animation_fadein";

        this.el.innerHTML = Mustache.render(this.template, { timeCounter:this.diffTimeObject });
        ctr.appendChild(this.el);
        events.publish('update.loader', {show:false});
        this.bind(App, data);
    };

    module.exports = GiftCounter;

})(window, platformSdk.events, platformSdk.utils);