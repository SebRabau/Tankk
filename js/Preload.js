var Tankk = Tankk || {};

Tankk.Preload = function(){};

Tankk.Preload.prototype = {
    preload: function() {
        this.logo = this.add.sprite(this.game.world.centerX, 250, "logo");
        this.logo.anchor.setTo(0.5);
        this.logo.scale.setTo(0.3);
        
        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 128, "preloadBar"); 
        this.preloadBar.anchor.setTo(0.5); 
        this.load.setPreloadSprite(this.preloadBar);
        
        //Load Sprites (Formatting shown below)
        //this.load.tilemap("map", "maps/DeltaZone.json", null, Phaser.Tilemap.TILED_JSON);
        //this.load.image("tiles", "maps/tiles.png");
        //this.load.spritesheet("objectTiles", "maps/tiles.png", 32, 32, 48);
        
        //terrain
        this.load.tilemap("map", "assets/Tiles/TileMaps/Tankk-Map1.json", null, Phaser.Tilemap.TILED_JSON);
        this.load.image("Base", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/House/TDS04_House02.png");
        this.load.image("Bush_01", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0012_Bush-01.png");
        this.load.image("Bush_02", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0011_Bush-02.png");
        this.load.image("Tree_01", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Trees Bushes/TDS04_0019_Tree4.png");
        this.load.image("DirtToRoad", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Tiles/_0008_DirtToRoad.png");
        this.load.image("RoadDecals", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-tilesets-environment/PNG/Tiles/_0005_RoadDecals.png");
        
        //vehicles
        this.load.image("BrokenChopper", "assets/Tiles/TileAssets/WarZone Assets/tds-modern-soldiers-and-vehicles-sprites-2/Helicopter/Broken/BrokenBase.png");
        this.load.image("Humvee_Broken_05", "assets/Tiles/TileAssets/WarZone Assets/tds-pixel-art-modern-soldiers-and-vehicles-sprites/Humvee/Broken/Humvee_Broken_0005.png");

        //other
        this.load.image("logo", "assets/logo.png");
        this.load.image("redo", "assets/redo.png");
        this.load.image("home", "assets/home.png");
        this.load.spritesheet("healthBar", "assets/healthBar.png", 378, 38, 12);
        this.load.image("playButton", "assets/playbutton.png");
        //this.load.spritesheet("menuButtons", "assets/menuButtons.png", 200, 50, 12);
        this.load.spritesheet("explosion", "assets/Animations/Explosion2/1Single.png", 452, 512, 8);
        this.load.image("player", "assets/Tanks/ACS/Source/ACS_Base.png");
        this.load.image("turret", "assets/Tanks/ACS/Source/ACS_Tower.png");
        this.load.image("enemy", "assets/Tanks/BTR/BTR_BaseC.png");
        this.load.image("eTurret", "assets/Tanks/BTR/BTR_TowerC.png");
        this.load.image("blank", "assets/blank.png");
        this.load.image("bullet", "assets/Bullet.png");
        this.load.spritesheet("baseHealth", "assets/BaseHealth.png", 200, 75, 21);
        
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