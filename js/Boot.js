/* Boot.js loads in the assets used in the preload screen, 
 * as well as setting up the main window parameters and the physics system.
 * Finally it initates the Preload state.
 */

var Tankk = Tankk || {};
 
Tankk.Boot = function(){};
 
Tankk.Boot.prototype = {
  preload: function() {
  	//assets used in the loading screen
    this.load.image("preloadBar", "assets/preloadBar.png");
    this.load.image("background", "assets/background.png");

  },
  create: function() {
    this.game.stage.backgroundColor = "#fff";
 
    //scaling
	this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	
	//centre game
	this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
 
	//auto adjust screen size
	this.scale.updateLayout(true);
 
	//initialise physics system
	this.game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.state.start("Preload");
  }
};