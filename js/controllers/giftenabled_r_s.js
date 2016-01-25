(function (W, events, utils) {
    'use strict';

    var GiftEnabled_nr = function (options) {
        this.template = require('raw!../../templates/giftenabled_r_s.html');
    };

    GiftEnabled_nr.prototype.destroy = function(){

    };

    GiftEnabled_nr.prototype.bind = function(App, res){
        var that = this;

        console.log(res);

        var rGiftButton = this.el.getElementsByClassName('rGiftButton')[0];
        
        rGiftButton.addEventListener('click', function(ev){
            events.publish('update.loader', {show:true});
            App.SantaService.revealGift(function(res){
                console.log(res);
                if(res.stat == "success"){
                    App.router.navigateTo('/giftdetails', res);    
                }
            }); 
        });

        var offerIcon = this.el.getElementsByClassName('offerIcon');

        for(var j=0;j<offerIcon.length;j++){
            if(offerIcon[j]){
                offerIcon[j].style.background = "url('"+res.coupons[j].offericon.medium+"')";
            }    
            else{
                offerIcon[j].style.background = "url('images/giftclosed.png')";
            } 
            offerIcon[j].style.backgroundSize = "contain";
            offerIcon[j].style.backgroundRepeat = "no-repeat";
            offerIcon[j].style.backgroundPosition = "center";
        }

    };

    GiftEnabled_nr.prototype.render = function(ctr, App, data) {

        console.log(data);

        this.el = document.createElement('div');
        this.el.className = "giftResultContainer animation_fadein";

        if(data && data.coupons){
            this.ssoffers = data.coupons;
        }

        // for(var i=0;i<this.ssoffers.length; i++){
        //     this.ssoffers[i].offericon = this.ssoffers[i].offericon.medium;
        //     if(this.ssoffers[i].offer_sent){
        //         this.ssoffers.offerstatus = 'osent';
        //     }
        // }

        this.el.innerHTML = Mustache.render(this.template, { secretsantaoffers:this.ssoffers, giftRHeading:'', giftRButton:'' });
        ctr.appendChild(this.el);
        events.publish('update.loader', {show:false});
        this.bind(App, data);
    };

    module.exports = GiftEnabled_nr;

})(window, platformSdk.events, platformSdk.utils);