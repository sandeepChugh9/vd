(function( W, events, utils ) {
    'use strict';

    var ProfileController = function( options ) {

        this.template = require( 'raw!../../templates/profile.html' );
    };

    ProfileController.prototype.destroy = function() {

    };

    ProfileController.prototype.bind = function( App, res ) {
        var that = this;
        var profile_pic_select = this.el.getElementsByClassName('profile_pic_select');
        var continueAction = document.getElementById("profileSubmit");
        console.log(continueAction);

        //console.log(profile_pic_select);
         profile_pic_select[0].addEventListener('click', function(ev) {
                this.classList.add('selected');
                profile_pic_select[1].classList.remove('selected');
         });
         profile_pic_select[1].addEventListener('click', function(ev) {
                this.classList.add('selected');
                profile_pic_select[0].classList.remove('selected');
         });

         

         var form = document.getElementById("profileForm");
         //console.log(form);

         continueAction.addEventListener("click", function (ev) {

                console.log(document.getElementById("profileName").value);
                console.log(document.getElementById("profileStatus").value);
                console.log(document.getElementById("profileGender").value);
                App.router.navigateTo('/matchscreen',{});
                //form.submit();
                
         });   

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
