(function (W, events, utils) {
    'use strict';

    var GiftEnabled_nr = function (options) {
        this.template = require('raw!../../templates/giftenabled_nr_s.html');
    };

    GiftEnabled_nr.prototype.destroy = function(){

    };

    GiftEnabled_nr.prototype.bind = function(App, res){
        var that = this;
        var santaChatButton = this.el.getElementsByClassName('santaChatButton')[0];

        console.log(res);

        if(platformSdk.appData.helperData.userSanta){
            santaChatButton.classList.add('assigned');
        }

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
        
        // Talk To Santa Button

        santaChatButton.addEventListener('click', function(ev){
            if (this.classList.contains('assigned')) {
                if (platformSdk.bridgeEnabled && platformSdk.appData.helperData.santa_msisdn)
                {    
                    var data = {'msisdn': platformSdk.appData.helperData.santa_msisdn};
                    App.SantaService.invokeChat(data, function (res) {
                        if(res.stat == "success"){
                            platformSdk.ui.showToast("We’ve wished Merry Christmas to your Santa and opened a chat for you!");
                        }
                        else if(res.stat == "fail"){
                            platformSdk.ui.showToast("Failed to Invoke Chat. Please Try Again Later");
                        }
                    });
                }
                else{
                    console.log("Check Device");
                }
            } else {
                if (platformSdk.bridgeEnabled) {
                    platformSdk.ui.showToast("We are working to find you a Santa. Please try again after some time.");
                }
                else {
                    console.log("We are working to find you a Santa. Please try again after some time.");
                }
            }
        });        
    };

    GiftEnabled_nr.prototype.render = function(ctr, App, data) {

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

        this.el.innerHTML = Mustache.render(this.template, { secretsantaoffers:this.ssoffers });
        ctr.appendChild(this.el);
        events.publish('update.loader', {show:false});
        this.bind(App, data);
    };

    module.exports = GiftEnabled_nr;

})(window, platformSdk.events, platformSdk.utils);