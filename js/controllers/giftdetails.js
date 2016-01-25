(function (W, events, utils) {
    'use strict';

    var GiftDetails = function (options) {
        this.template = require('raw!../../templates/giftdetails.html');
    };

    GiftDetails.prototype.destroy = function(){

    };

    GiftDetails.prototype.bind = function(App, res){
        var that = this;
        
        console.log(res);

        var giftConfirmSend = this.el.getElementsByClassName('giftConfirmSend')[0];
        var giftCodeValue = this.el.getElementsByClassName('giftCodeValue')[0];
        var offerIcon = this.el.getElementsByClassName('offerIcon')[0];

        if(offerIcon){
            offerIcon.style.background = "url('"+res.offericon.medium+"')";
            offerIcon.style.backgroundSize = "contain";
            offerIcon.style.backgroundRepeat = "no-repeat";
            offerIcon.style.backgroundPosition = "center";
        }    
        else{
            offerIcon.style.background = "url('images/giftclosed.png')";
            offerIcon.style.backgroundSize = "contain";
            offerIcon.style.backgroundRepeat = "no-repeat";
            offerIcon.style.backgroundPosition = "center";
        } 
        
        //Remove The Gift Code For Confirm and Send
        if(res && res.giftStatus == 'sGift'){
            //giftCodeValue.remove();
            giftCodeValue.parentNode.removeChild(giftCodeValue);
        }

        giftConfirmSend.addEventListener('click', function(ev){
            
            // See More Coupons
            if(this.classList.contains('rGift')){
                if (platformSdk.bridgeEnabled && PlatformBridge.openNonMessagingBot){
                    platformSdk.nativeReq({
                        fn: 'openNonMessagingBot',
                        ctx: this,
                        data: "+hikecoupons+",
                        success: function(response){
                            if(response == 'Failure'){
                                platformSdk.ui.showToast("We’re unable to open Coupons due to a technical issue. Please try again later.");
                            }
                        }
                    }); 
                } else {
                    platformSdk.ui.showToast("We’re unable to open Coupons due to a technical issue. Please try again later.");
                }
            }
            // Confirm and Send
            else if(this.classList.contains('sGift')){
                events.publish('update.loader', {show:true});
                var data = {'coupon_id': res.offer_id };
                if(platformSdk.bridgeEnabled){
                    App.SantaService.sendGift(data, function(res){
                        console.log(res);
                        if(res.stat == 'success'){
                            platformSdk.ui.showToast("Gift successfully sent"); 
                            App.router.navigateTo('/');
                        }
                        else if(res.stat == "fail" && res.reason == "santa_unassigned"){
                            events.publish('update.loader', {show:false});
                            platformSdk.ui.showToast("You’re not Santa for someone yet! Please wait for some time before gifting!"); 
                        }
                        else if(res.stat == "fail" && res.reason == "santi_deleted"){
                            events.publish('update.loader', {show:false});
                            platformSdk.ui.showToast("Your giftee is not there in Secret Santa. No worries, we'll make sure you get your gift.");
                        }
                        else{
                            events.publish('update.loader', {show:false});
                            platformSdk.ui.showToast("Some Error Occured");   
                        }   
                        // Handle state deleted 
                    });    
                }
                else{
                    App.router.navigateTo('/',{santa:true, santi:false});
                }
            }
            else{
                if (platformSdk.bridgeEnabled) {
                    platformSdk.ui.showToast("Some Error Occured");
                }
                else console.log("Some Error Occured");
                return;
            }
            //App.router.navigateTo('/giftenabled', res);
        });

    };

    GiftDetails.prototype.render = function(ctr, App, data) {

        this.giftDetailsPage = {};

        this.el = document.createElement('div');
        this.el.className = "giftDetailsContainer animation_fadein";

        if(data && data.received_coupon){
            this.giftDetailsPage = data.received_coupon;
            this.giftDetailsPage.buttonHeading = 'See More Coupons';
            this.giftDetailsPage.hikeCouponCode = data.received_coupon['code'];
            this.giftDetailsPage.giftStatus ='rGift';
        }
        else{
            this.giftDetailsPage = JSON.parse(JSON.stringify(data)); // Clone object
            this.giftDetailsPage.buttonHeading = 'Confirm and Send';
            this.giftDetailsPage.giftStatus ='sGift';
        }

        this.giftDetailsPage.offerterms = this.giftDetailsPage.offerterms.split('\n');

        this.el.innerHTML = Mustache.render(this.template, {giftDetailsPage:this.giftDetailsPage});
        ctr.appendChild(this.el);
        events.publish('update.loader', {show:false});
        this.bind(App, this.giftDetailsPage);
    };

    module.exports = GiftDetails;

})(window, platformSdk.events, platformSdk.utils);