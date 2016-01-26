(function (W, events) {
    'use strict';

    var WorkspaceController = require('./controllers/workspace'),
    ProfileController = require('./controllers/profilecontroller'),
    MatchScreenController = require('./controllers/matchscreencontroller'),
    HomeScreenController = require('./controllers/homescreencontroller'),

    Router = require('./util/router'),
    utils = require('./util/utils'),

    TxService = require('./util/txServices'),
    SantaServices = require('./util/santaServices');

// Full Screen Loader 
var loader = document.getElementById('loader');
var loadObject = events.subscribe('update.loader', function (params) {
    loader.toggleClass('loading', params.show);
});

// Tap State Events :: Touch Start And Touch End

document.addEventListener('touchstart', function (e) {
    e = e || window.event;
    var target = e.target;
    if (target.classList.contains('buttonTap')) {
        target.classList.add('tapState');
    }
    else if (target.classList.contains('buttonTapRed')) {
        target.classList.add('tapStateRed');
    }
    else if (target.classList.contains('buttonTapOffer')) {
        target.classList.add('tapStateOffer');
    }
    else {
        return;
    }
}, false);

document.addEventListener('touchend', function (e) {
    e = e || window.event;
    var target = e.target;
    if (target.classList.contains('buttonTap')) {
        target.classList.remove('tapState');
    }
    else if (target.classList.contains('buttonTapRed')) {
        target.classList.remove('tapStateRed');
    }
    else if (target.classList.contains('buttonTapOffer')) {
        target.classList.remove('tapStateOffer');
    }
    else {
        return;
    }
}, false);

document.querySelector('.unblockButton').addEventListener('click', function () {
    unBlockApp();
}, false);

// No Internet Connection Tab 
var noInternet = document.getElementById('nointernet');
var noInternetObject = events.subscribe('app/offline', function (params) {
    noInternet.toggleClass('no-internet-msg', params.show);
});

// Block Connection Tab 
var isBlock = document.getElementById('blockScreen');
var isBlockObject = events.subscribe('app/block', function (params) {
    isBlock.toggleClass('block-msg', params.show);
});

var unBlockApp = function () {
    var self = this;
    var id = '' + platformSdk.retrieveId('app.menu.om.block');

    platformSdk.appData.block = "false";
    if (platformSdk.bridgeEnabled) platformSdk.unblockChatThread();
    platformSdk.events.publish('app.state.block.hide');
    platformSdk.updateOverflowMenu(id, {
        "title": "Block"
    });

    utils.toggleBackNavigation(false);        
    events.publish('update.loader', {show: false});
    events.publish('app/block', {show: false});
};

var Application = function (options) {
    this.container = options.container;
    this.routeIntent = options.route;

    this.router = new Router();

    this.workspaceController = new WorkspaceController();
    this.ProfileController = new ProfileController();
    this.HomeController = new HomeScreenController();
    this.MatchScreenController = new MatchScreenController();

    this.TxService = new TxService();
this.SantaService = new SantaServices(this.TxService); //communication layer
};

Application.prototype = {

// Setting Up The Three Dot Menu
initOverflowMenu: function () {
    var omList = [{
        "title": platformSdk.appData.block === "true" ? "Unblock" : "Block",
        "en": "true",
        "eventName": "app.menu.om.block"
    },
    {
        "title": "Notifications",
        "en": "true",
        "eventName": "app.menu.om.mute",
        "is_checked": platformSdk.appData.mute === "true" ? "false" : "true"
    }];

// Notifications
platformSdk.events.subscribe('app.menu.om.mute', function (id) {
    id = "" + platformSdk.retrieveId('app.menu.om.mute');
    if (platformSdk.appData.mute == "true") {
        platformSdk.appData.mute = "false";
        platformSdk.muteChatThread();
        platformSdk.updateOverflowMenu(id, {
            "is_checked": "true"
        });
    } else {
        platformSdk.appData.mute = "true";
        platformSdk.muteChatThread();
        platformSdk.updateOverflowMenu(id, {
            "is_checked": "false"
        });
    }
});
// Block
platformSdk.events.subscribe('app.menu.om.block', function (id) {
    id = "" + platformSdk.retrieveId('app.menu.om.block');
    if (platformSdk.appData.block === "true") {
        unBlockApp();
    } else {
        platformSdk.appData.block = "true";
        platformSdk.blockChatThread();
        platformSdk.events.publish('app.state.block.show');
        platformSdk.updateOverflowMenu(id, {
            "title": "Unblock"
        });
        utils.toggleBackNavigation(false);
        events.publish('app/block', {show: true});
        events.publish('app/offline', {show: false});
    }
});

platformSdk.setOverflowMenu(omList);
},

backPressTrigger: function () {
    this.router.back();
},

getRoute: function () {
    var that = this;

// ToDo: Remvove tihs if block from here?
if (this.routeIntent !== undefined) {

} else {
    events.publish('app.store.get', {
        key: '_routerCache',
        ctx: this,
        cb: function (r) {
            if (r.status === 1 && platformSdk.bridgeEnabled) {
                try {
                    that.router.navigateTo(r.results.route, r.results.cache);
                } catch (e) {
                    that.router.navigateTo('/');
                }
            } else {
                that.router.navigateTo('/');
            }
        }
    });
}
},

start: function () {

    var self = this;
    self.$el = $(this.container);
    self.initOverflowMenu();

    utils.toggleBackNavigation(false);

    platformSdk.events.subscribe('onBackPressed', function () {
        self.backPressTrigger();
    });

    platformSdk.events.subscribe('onUpPressed', function () {
        self.backPressTrigger();
    });

// Subscribe :: Workspace
this.router.route('/', function (data) {
    self.container.innerHTML = "";
    self.workspaceController.render(self.container, self, data);
    utils.toggleBackNavigation(false);
});

this.router.route('/homescreen', function (data) {
    self.container.innerHTML = "";
    self.HomeController.render(self.container, self, data);
    utils.toggleBackNavigation(true);
});

this.router.route('/profile', function (data) {
    self.container.innerHTML = "";
    self.ProfileController.render(self.container, self, data);
    utils.toggleBackNavigation(true);
});

this.router.route('/matchscreen', function (data) {
    self.container.innerHTML = "";
    self.MatchScreenController.render(self.container, self, data);
    utils.toggleBackNavigation(true);
});

// First Time User
if (platformSdk.appData.block === "true") {
    console.log("User has blocked the Application");
    events.publish('app/block', {show: true});  
} else if (!platformSdk.appData.helperData.FtueDone) {
    console.log("First Time User");
    self.router.navigateTo('/');
} else {
    console.log("Regular User");
    self.router.navigateTo('/quote', {});
}
}
};

module.exports = Application;

})(window, platformSdk.events);