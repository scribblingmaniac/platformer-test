var canvas;
var ctx;
Number.prototype.hexify = function(dg) {
   var str = this.toString(16);
   while (str.length < dg)
   str = '0' + str;
   return str;
};

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
   Developer: {
      enabled: false,
      output: 'DEVELOPER_MODE_HALLOWEEN_2011',
      log: function(str) {
         localStorage[this.output] = str + '<br>' + localStorage[this.output];
         if (document.getElementById(this.output)) document.getElementById(this.output).innerHTML = localStorage[this.output];
      }
   },
   images: {cursor: 'happy_pumpkin_cursor.png'},
   initiated: {
      fonts: false,
      loadedImages: 0,
      totalImages: 0
   },
   initiate: function() {
      var doneImages = 0;
      this.Developer.log('Initiating...');
      loadFonts(['Slackey:latin']);
      //Load images
      this.imgSource = this.images;
      this.images = {};
      var func = function() {
            Game.initiated.loadedImages++;
            Game.Developer.log('Loaded Image');
          };
      for (var i in this.imgSource) {
         if(!this.images[i]) {
            this.images[i] = new Image();
            this.images[i].onload = func;
            this.images[i].src = this.imgSource[i];
            document.body.appendChild(this.images[i]);
            Game.Developer.log('Loading: ' + this.images[i].src);
            Game.initiated.totalImages++;
            return;
         }
      }
   },
   Slideshow: function(slides, u) {
      this.slides = [];
      for (var i in slides)
      this.slides = Game.images[i];
      this.speed = u;
      this.slide = 0;
      this.fade = 0;
      this.draw = function() {
         ctx.fillStyle = '#000000';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.globalAlpha = 1 - this.fade;
         ctx.drawImage(this.slides[this.slide], (canvas.width - this.slides[this.slide].width) / 2, (canvas.height - this.slides[this.slide].height) / 2);
         ctx.globalAlpha = this.fade;
         ctx.drawImage(this.slides[this.slide + 1], (canvas.width - this.slides[this.slide + 1].width) / 2, (canvas.height - this.slides[this.slide + 1].height) / 2);
      };
      this.update = function() {
         this.fade += u / 500;
         if (this.fade > 1 && this.slides.length > this.slide) {
            this.fade = 0;
            this.slide++;
         }
         else return false;
         return true;
      };
   },
   Mouse: {
      x: 0,
      y: 0,
      down: false,
      onClick: null,
      Move: function(e) {
         Game.Mouse.x = e.pageX;
         Game.Mouse.y = e.pageY;
      },
      Up: function(e) {
         Game.Mouse.down = false;
      },
      Down: function(e) {
         Game.Mouse.down = true;
      }
   },
   TitleScreen: function() {
      this.TITLE = 'Halloween Wut?';
      this.draw = function() {
         ctx.drawImage(Game.images.cursor, Game.Mouse.x-Game.images.cursor.width/2, Game.Mouse.y-Game.images.cursor.height/2);
      };
   },
   StartUp: function() {
      this.TEXT = 'A Scribbling Maniac Production';
      this.opacity = 0;
      this.speed = 2;
      this.step = 2 / (256 / this.speed);
      this.shown = false;
      this.redness = 0;
      this.draw = function() {
         ctx.fillStyle = '#' + this.redness.hexify(2) + '0000';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.globalAlpha = this.opacity;
         ctx.font = canvas.height / 10 + 'px Verdana';
         ctx.textBaseline = 'middle';
         ctx.fillStyle = '#ddddff';
         ctx.fillText(this.TEXT, (canvas.width - ctx.measureText(this.TEXT).width) / 2, canvas.height / 2);
      };
      this.update = function() {
         this.opacity += this.shown ? -this.step : this.step;
         if (this.redness < 255) this.redness += this.speed;
         if (this.shown && this.opacity <= 0) Game.switchState(new Game.TitleScreen());
         else if (!this.shown && this.opacity >= 1) this.shown = true;
      };
   },
   Loading: function() {
      Game.Developer.log('Loading');
      Game.initiate();
      this.TEXT = 'Loading...';
      this.loaded = false;
      this.fade = 1;
      this.fadeStep = 0.075;
      this.getProgress = function() {
         return Game.initiated.loadedImages / Game.initiated.totalImages;
      };
      this.draw = function() {
         ctx.fillStyle = '#000000';
         ctx.fillRect(0, 0, canvas.width, canvas.height);
         ctx.globalAlpha = this.fade;
         ctx.font = canvas.height / 10 + 'px Verdana';
         ctx.strokeStyle = '#ffffff';
         ctx.strokeText(this.TEXT, (canvas.width - ctx.measureText(this.TEXT).width) / 2, canvas.height / 3);
         ctx.strokeRect(canvas.width / 3, canvas.height / 2, canvas.width / 3, canvas.height / 9);
         ctx.fillStyle = ctx.strokeStyle;
         ctx.fillRect(canvas.width / 3, canvas.height / 2, canvas.width / 3 * this.getProgress(), canvas.height / 9);
      };
      this.update = function() {
         this.loaded = Game.initiated.loadedImages >= Game.initiated.totalImages;
         if (this.loaded) this.fade -= this.fadeStep;
         if (this.loaded && this.fade <= 0) Game.switchState(new Game.StartUp());
      };
   },
   start: function() {
      this.Developer.log('Starting...');
      //Attach events
      canvas.addEventListener('mousemove', Game.MouseMove);
      canvas.addEventListener('mouseup', Game.MouseUp);
      canvas.addEventListener('mousedown', Game.MouseDown);
      this.switchState(new this.Loading());
      setInterval(function() {
         canvas.width = window.innerWidth;
         canvas.height = window.innerHeight;
         Game.gameState.draw();
         if ('update' in Game.gameState) Game.gameState.update();
      }, 70);
   },
   switchState: function(state) {
      this.gameState = state;
   }
};

function loaded() {
   if (Game.Developer.enabled) {
      var output = document.createElement('blockquote');
      output.style = "width:90%;margin-left:auto;margin-right:auto;height:300;background-color:grey;color:black;border-color:black;border-width:3px;";
      output.id = Game.Developer.output;
      document.body.appendChild(output);
      Game.Developer.log(new Date() + ':::   Development mode enabled');
   }
   canvas = document.getElementById('game');
   ctx = canvas.getContext('2d');
   Game.start();
}