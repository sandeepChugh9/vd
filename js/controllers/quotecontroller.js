(function (W, events, utils) {
    'use strict';

    var QuoteController = function (options) {

        this.template = require('raw!../../templates/quotes.html');
        this.gradients = [{"name":"Moss","colors":["#134E5E ","#71B280 "]},{"name":"Portrait","colors":["#8e9eab ","#eef2f3 "]},{"name":"Turquoise flow","colors":["#136a8a ","#267871 "]},{"name":"Instagram","colors":["#517fa4 ","#243949 "]},{"name":"Twitch","colors":["#6441A5 ","#2a0845 "]},{"name":"ServQuick","colors":["#485563 ","#29323c "]},{"name":"SoundCloud","colors":["#fe8c00 ","#f83600 "]},{"name":"Facebook Messenger","colors":["#00c6ff ","#0072ff "]},{"name":"Amethyst","colors":["#9D50BB ","#6E48AA "]},{"name":"Dirty Fog","colors":["#B993D6 ","#8CA6DB "]},{"name":"Reef","colors":["#00d2ff ","#3a7bd5 "]},{"name":"A Lost Memory","colors":["#DE6262 ","#FFB88C "]},{"name":"Namn","colors":["#a73737 ","#7a2828 "]},{"name":"Day Tripper","colors":["#f857a6 ","#ff5858 "]},{"name":"Midnight City","colors":["#232526 ","#414345 "]},{"name":"Sea Weed","colors":["#4CB8C4 ","#3CD3AD "]},];
    };

    QuoteController.prototype.destroy = function () {

    };

    QuoteController.prototype.bind = function (App, res) {
        console.log(this.gradients);
        var that = this;
        var color1,color2 = {};
        var mycolor = new Array;
        mycolor = this.gradients[Math.floor(Math.random()*this.gradients.length)].colors;
        color1= mycolor[0];
        color2= mycolor[1];

        var currentY,lastY;

        $(document).bind('touchstart', function (e){
            console.log("Touch start");
            currentY = e.changedTouches[0].screenY;
        });

        $(document).bind('touchend', function (e){
            console.log("Touch End");
            
            console.log(currentY);
            lastY = e.changedTouches[0].screenY;
            
            if((currentY - lastY) > 50 || (currentY - lastY) < -50){
                console.log("Scrolled Up by more than 50");
                if (platformSdk.bridgeEnabled) {
                        App.SantaService.getQuote(function (res) {
                            console.log("here is your quote and author");
                            console.log(res);
                             App.router.navigateTo('/quote',{})
                        });
                    }
                    else {
                        App.SantaService.getQuote(function (res) {
                            console.log(res.content);
                            console.log(res.author.name)
                             App.router.navigateTo('/quote',{quote:res.content, author:res.author.name})
                        });
                }
            }

        });

        var newquote = this.el.getElementsByClassName('newquote');
        console.log(this.el);
        var quoteContainer = document.getElementsByClassName('quoteContainer')[0];
       // console.log("hahaga"+quoteContainer);
        quoteContainer.style.background = "linear-gradient(to bottom right,"+color1+","+color2+")";
        //quoteContainer.style.background = "#fff";

        for(var i=0;i<newquote.length;i++) {
                newquote[i].addEventListener('click', function(ev) {   
                    if (platformSdk.bridgeEnabled) {
                        App.SantaService.getQuote(function (res) {
                            console.log("here is your quote and author");
                            console.log(res);
                             App.router.navigateTo('/quote',{})
                        });
                    }

                    else {
                        App.SantaService.getQuote(function (res) {
                            console.log(res.content);
                            console.log(res.author.name)
                             App.router.navigateTo('/quote',{quote:res.content, author:res.author.name})
                        });
                    }
                
                });
    }
    };

    QuoteController.prototype.render = function (ctr, App, data) {


        this.el = document.createElement('div');
        this.el.className = "quoteContainer animation_fadein noselect";
        this.el.innerHTML = Mustache.render(this.template, {quote:data.quote, author:data.author});
        ctr.appendChild(this.el);
        events.publish('update.loader', {show: false});
        this.bind(App, data);
    };

    module.exports = QuoteController;


})(window, platformSdk.events, platformSdk.utils);