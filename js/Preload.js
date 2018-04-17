var Tankk = Tankk || {};

Tankk.Preload = function(){};

Tankk.Preload.prototype = {
    preload: function() {
        this.splash = this.add.sprite(this.game.world.centerX, 50, "logo");
        this.splash.anchor.setTo(0.5);
        
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, "preloadBar"); 
        this.preloadBar.anchor.setTo(0.5); 
        this.load.setPreloadSprite(this.preloadBar);
        
        //Load Sprites (Formatting shown below)
        //this.load.tilemap("map", "maps/DeltaZone.json", null, Phaser.Tilemap.TILED_JSON);
        //this.load.image("tiles", "maps/tiles.png");
        //this.load.spritesheet("objectTiles", "maps/tiles.png", 32, 32, 48);
        this.load.spritesheet("menuButtons", "assets/menuButtons.png", 200, 50, 12);
        this.load.spritesheet("explosion", "assets/Animations/Explosion2/1Single.png", 452, 512, 8);
        
        
        //Load Audio (Formatting shown below)
        //this.load.audio("MenuMusic", "assets/Chiptune_Throne_Room.mp3");
    },
    create: function() {        
        this.state.start("MainMenu");
    }
};