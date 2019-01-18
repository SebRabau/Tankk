/* Preload.js loads in all assets used within the game, 
 * including the map, audio, ui, and other main assets.
 * Finally it initiates the MainMenu state.
 */

var Tankk = Tankk || {};

Tankk.Preload = function(){};

Tankk.Preload.prototype = {
    preload: function() {
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, "preloadBar"); 
        this.preloadBar.anchor.setTo(0.5); 
        this.load.setPreloadSprite(this.preloadBar);
        
        //Load Sprites
        
        //terrain
        this.load.tilemap("map", "assets/Tiles/TileMaps/Tankk-Map1.json", null, Phaser.Tilemap.TILED_JSON);
        this.load.image("Base", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/House/TDS04_House02.png");
        this.load.image("Bush_01", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0012_Bush-01.png");
        this.load.image("Bush_02", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0011_Bush-02.png");
        this.load.image("Tree_01", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0019_Tree4.png");
        this.load.image("DirtToRoad", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Tiles/_0008_DirtToRoad.png");
        this.load.image("RoadDecals", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Tiles/_0005_RoadDecals.png");
        
        //Broken Vehicles
        this.load.image("BrokenChopper", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-soldiers-and-vehicles-sprites-2/Helicopter/Broken/BrokenBase.png");
        this.load.image("Humvee_Broken_05", "assets/Tiles/TileAssets/WarZone Assets/tds-pixel-art-modern-soldiers-and-vehicles-sprites/Humvee/Broken/Humvee_Broken_0005.png");

        //Menu & UI
        this.load.image("logo", "assets/Logo.png");
        this.load.image("redo", "assets/redo.png");
        this.load.image("home", "assets/home.png");
        this.load.image("instructButton", "assets/Instructions.png");
        this.load.spritesheet("healthBar", "assets/healthBar.png", 378, 38, 12);
        this.load.image("playButton", "assets/playbutton.png");
        this.load.spritesheet("baseHealth", "assets/BaseHealth.png", 200, 75, 21);
        this.load.image("instructions", "assets/instructions2.png");
        this.load.image("banner", "assets/Banner.png");
        this.load.image("sound", "assets/Sound.png");
        this.load.image("nosound", "assets/NoSound.png");
        
        //Main Game Assets
        this.load.spritesheet("explosion", "assets/Animations/Explosion2/1Single.png", 452, 512, 8);
        this.load.image("player", "assets/Tanks/ACS/Source/ACS_Base.png");
        this.load.image("turret", "assets/Tanks/ACS/Source/ACS_Tower.png");
        this.load.image("enemy", "assets/Tanks/BTR/BTR_BaseC.png");
        this.load.image("eTurret", "assets/Tanks/BTR/BTR_TowerC.png");
        this.load.image("blank", "assets/blank.png");
        this.load.image("bullet", "assets/Bullet.png");
        
        //Load Audio (Formatting shown below)
        this.load.audio("MenuMusic", "assets/Audio/menuMusic.mp3");
        this.load.audio("tankIdle", "assets/Audio/tankIdle.mp3");
        this.load.audio("tankMove", "assets/Audio/tankMove.mp3");
        this.load.audio("enemyExplode", "assets/Audio/EnemyExplosion.mp3");
        this.load.audio("playerExplode", "assets/Audio/PlayerExplosion.mp3");
        this.load.audio("tankFire", "assets/Audio/TankFire.mp3");
        this.load.audio("eFire", "assets/Audio/egun.mp3");
    },
    create: function() {        
        this.state.start("MainMenu");
    }
};
