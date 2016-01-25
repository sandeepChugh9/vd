(function (W, events, utils) {
    'use strict';

    var Faq = function (options) {
        this.template = require('raw!../../templates/faq.html');
    };

    Faq.prototype.destroy = function () {

    };

    Faq.prototype.bind = function (App, res) {
        var that = this;

        var faqConfirm = this.el.getElementsByClassName('faqConfirm')[0];
        var faqConfirmInner = this.el.getElementsByClassName('faqConfirmInner')[0];


        faqConfirmInner.style.transition = "opacity 0.2s ease-in";
        faqConfirmInner.style.transitionDelay = "2s";

        setTimeout(function () {
            faqConfirmInner.style.opacity = 1;
        }, 10);


        faqConfirm.addEventListener('click', function (ev) {
            events.publish('update.loader', {show: true});

            if (platformSdk.bridgeEnabled) {
                App.SantaService.getAssignmentStatus(function (res) {
                    console.log(res);
                    if (res.stat == "success") {
                        if(res.showLegal){
                            console.log("Show Legal Screen Here :: With The Terms Key");
                            App.router.navigateTo('/legal', res);
                        }
                        else {
                            console.log("Show Normal Panel Screen");
                            App.router.navigateTo('/', res);
                        }
                    }
                    else if (res.stat == "fail"){
                        events.publish('update.loader', {show: false});
                        platformSdk.ui.showToast("Something Went Wrong. Please try after some time");
                    }
                });
            }
            else {
                // Take To Santa Panel
                App.router.navigateTo('/', res);
            }
        });

    };

    Faq.prototype.render = function (ctr, App, data) {

        this.el = document.createElement('div');
        this.el.className = "faqContainer animation_fadein";

        this.HowToUseList = [
            {'itemCount':1,'item':'You will be matched randomly with a Santa from the hike user base.'},
            {'itemCount':2,'item':'You will receive a gift from your Santa on Christmas and you will be able to send a gift for FREE on Dec 24th from the Gift Basket!'},
            {'itemCount':3,'item':'Start chatting with your Santa now. Be nice and get a gift from them.'},
            {'itemCount':4,'item':'Chat and find more about your match/giftee and give them a nice gift.'},
            {'itemCount':5,'item':'All Secret Santa chats are fully anonymous and your number will not be revealed.'}
        ];

        this.el.innerHTML = Mustache.render(this.template, {HowToUseList:this.HowToUseList});
        ctr.appendChild(this.el);
        events.publish('update.loader', {show: false});
        this.bind(App, data);
    };

    module.exports = Faq;

})(window, platformSdk.events, platformSdk.utils);