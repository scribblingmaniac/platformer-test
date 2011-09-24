var canvas;
var ctx;

function loadFonts(fs) {
    WebFontConfig = {
        google: {
            families: fs
        }
    };
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
}
var Game = {
    images: {
        logo: 'logo.gif'
    },
    initiated: {
        fonts: false,
        loadedImages: 0,
        totalImages: 0
    },
    initiate: function() {
        loadFonts(['Slackey:latin']);
        //Load images
        this.imgSource = this.images;
        this.images = {};
        var func = function(){initiated.loadedImages++;};
        for (var i in this.imgSource) {
            this.images[i] = document.createElement('image');
            this.images[i].src = this.imgSource[i];
            this.images[i].addEventListener('load', func);
            document.appendChild(this.images[i]);
            initiated.totalImages++;
        }
    },
    Loading: function() {
        Game.initiate();
        this.TEXT = 'Loading...';
        this.loaded = false;
        this.fade = 1;
        this.fadeStep = 0.075;
        this.getProgress = function() {
         return Game.initiated.loadedImages / Game.initiated.totalImages;
        };
        this.draw = function() {
            ctx.globalAlpha = fade;
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = canvas.height / 10 + 'px Slackey, Verdana';
            ctx.strokeStyle = '#ffffff';
            ctx.strokeText(this.TEXT, (canvas.width-ctx.measureText(this.TEXT).width)/2, canvas.height/3);
            ctx.strokeRect(canvas.width/3, canvas.height/2, canvas.width/3, canvas.height/9);
            ctx.fillStyle = ctx.strokeStyle;
            ctx.fillRect(canvas.width/3, canvas.height/2, canvas.width/3 * this.getProgress(), canvas.height/9);
        };
        this.update = function() {
            if (this.loaded) this.fade -= this.fadeStep;
            if (this.loaded && this.fade <= 0) Game.switchState(new Game.startUp());
        };
    },
    start: function() {
        alert('Starting...');
        Game.switchState(new Game.Loading());
    },
    switchState: function(state) {
        this.gameState = state;
    }
};

function loaded() {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    Game.start();
}