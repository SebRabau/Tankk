/* For Game.js, the functions are as follows:
 * Create:             Spawns and loads in the Tiled map data, creates layers and sets relevant collisions; 
 *                     Creates our bullets, player and enemies via unction calls;
 *                     Initialises and spawns our UI elements, including text, banner, health bars;
 *                     Creates local variables for use within the script;
 *                     Initialises Audio, Pathfinding and Base Attributes.
 * 
 * Update:             Updates local variables;
 *                     Resets and controls player movement and rotation;
 *                     Controls enemy tanks;
 *                     Controls player audio;
 *                     Handles all collisions.
 *
 * playerHit:          Handles collision between enemy bullets and the player by decreasing health,
 *                     updating health bar, checking for player death and killing bullets from the screen.
 *
 * enemyCollide:       Handles collision between the player and an enemy, by deacreasing player health,
 *                     detroying the enemy, checking for game loss condition, updating UI and initialises waves.
 *
 * updateEnemies:      Handles enemy movement for when the enemy is far from their target and the player, 
 *                     close to the player and far from their target, and close to both target and player.
 *                     The movement paths are generated using A* pathfinding algorithms (Easystar.js), and 
 *                     movement is then controlled by comparing tile IDs between the enemies and their paths.
 *
 * enemyOnEnemy:       Generates a new Easystar path upon collision between enemies.
 *
 * killEnemy:          Handles collision between player bullets and enemies, updating their health, 
 *                     handles animations and destroying the enemy, updates text, handles new wave 
 *                     creation and kills the bullet.
 *
 * killBullet:         Handles collision between a bullet and an obstacle, killing the bullet.
 *
 * baseHit:            Handles collision between enemy bullets and the base, killing the bullet, 
 *                     updating health variables and UI, and checks for loss condition.
 *
 * playerHitBase:      Handles collision between player bullets and the base, killing the bullet, 
 *                     updating health variables and UI, and checks for loss condition.
 * 
 * createPlayer:       Adds the player to the world, creating and setting all player attributes, 
 *                     and appending the player turret and bullet spawn location as children to the player.
 *
 * createBullets:      Creates the player bullet group and sets all bullet attributes.
 *
 * createEnemyBullets: Creates the enemy bullet group and sets all bullet attributes.
 *
 * createEnemies:      Creates some local variables, creates the 5 spawn points for in game, 
 *                     then runs an iterative loop to create the right amount of enemies for each wave, 
 *                     spawning the enemies at a random spawn point, enabling physics, generating their 
 *                     individual A* paths, setting all attributes and appending their turrets and bullet 
 *                     spawn points as children to the enemy, all with an 800 millisecond delay.
 *
 * fire:               Handles the firing of the player's bullets, controlling the player's fire rate, 
 *                     audio and bullet spawn and target.
 *
 * enemyFire:          Handles the firing of the player's bullets, controlling the player's fire rate, 
 *                     audio and bullet spawn and target, whilst also applying gravity to the bullets.
 *
 * explode:            Handles the animation for exploding obejcts within the game, 
 *                     inclduing the player, enemies and base.
 *
 * updateScore:        Updates the score UI.
 *
 * updateWaveN:        Updates the wave number UI.
 *
 * updateWaveE:        Updates the enemy count UI.
 *
 * updateHealth:       Updates the UI for the player's health.
 *
 * updateBaseHealth:   Updates the UI for the base's health.
 *
 * findPathFrom:       Generates an Easystar path given enemy location parameters.
 *
 * processPath:        Processes the product of Eaststar.js.
 */

var Tankk = Tankk || {};

Tankk.Game = function(){};

var fireRate = 650;
var nextFire = 0;
var bullet;
var enemyBullet;

var tankIdle;
var tankMove;
var tankFire;
var enemyExplode;
var playerExplode;
var ismoving;
var blank;
var healthBar;
var score;
var scoreText;
var waveN;
var waveE;
var enemyCount;
var healthBar;
var eblank;
var baseHealth;
var explosion;

var pathfinder;
var walkables;
var path_ary;

Tankk.Game.prototype = {
    create: function() {
        
        //Map and Layers
        this.map = this.game.add.tilemap("map");         
        this.map.addTilesetImage("DirtToRoad", "DirtToRoad");
        this.map.addTilesetImage("Bush_02", "Bush_02");
        this.map.addTilesetImage("Tree_01", "Tree_01");
        this.map.addTilesetImage("RoadDecals", "RoadDecals");
        this.map.addTilesetImage("Bush_01", "Bush_01");
        this.map.addTilesetImage("BrokenChopper", "BrokenChopper");
        this.map.addTilesetImage("Humvee_Broken_05", "Humvee_Broken_05");    
        this.map.addTilesetImage("Base", "Base");   
        
        this.enemyWalkArea = this.map.createLayer("EnemyWalkArea");
        this.walkArea = this.map.createLayer("WalkArea");
        this.dirt = this.map.createLayer("Dirt");
        this.track = this.map.createLayer("Roads");
        this.base = this.map.createLayer("Base");
        this.obstacle = this.map.createLayer("Obstacle");
        
        this.map.setCollisionBetween(101, 101, true, "WalkArea");
        this.map.setCollisionBetween(300, 335, true, "Base");
        
        this.dirt.resizeWorld();  

        //Create Objects
        enemyCount = waveE;
        score = 0;
        this.createBullets();
        this.createEnemyBullets();
        this.createPlayer();        
        this.createEnemies(waveE);

        //UI
        var banner = this.game.add.sprite(this.game.world.width/2, 44, "banner"); 
        banner.anchor.setTo(0.5);
        banner.scale.setTo(0.2);
        
        healthBar = this.game.make.sprite(0, -50, "healthBar");
        healthBar.anchor.setTo(0.5);
        healthBar.scale.setTo(0.3, 0.2);
        this.player.addChild(healthBar);

        scoreText = this.game.add.text(this.game.world.width/3.2 - 10, 30, + score, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        scoreText.anchor.setTo(0.5);
        scoreText.fixedToCamera = true;

        waveText = this.game.add.text(this.game.world.width/2+40, 65, + waveN, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        waveText.anchor.setTo(0.5);
        waveText.fixedToCamera = true;

        enemyText = this.game.add.text(this.game.world.width - this.game.world.width/8, 30, enemyCount+"", {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        enemyText.anchor.setTo(0.5);
        enemyText.fixedToCamera = true;

        //Create local variables
        myGame = this.game; 
        myBullets = this.bullets;
        enemyBullets = this.enemyBullets;

        //Audio
        tankIdle = myGame.add.audio("tankIdle");
        tankIdle.play("", 0, 0.1, true);
        tankMove = myGame.add.audio("tankMove");
        tankFire = myGame.add.audio("tankFire");
        eFire = myGame.add.audio("eFire");
        playerExplode = myGame.add.audio("playerExplode");
        enemyExplode = myGame.add.audio("enemyExplode");
        
        //Pathfinding
        pathfinder = myGame.plugins.add(Phaser.Plugin.PathFinderPlugin);
        walkables = [45, 46];
        pathfinder.setGrid(this.map.layers[1].data, walkables);
        
        //Base
        this.baseXY = this.game.add.sprite(this.game.world.width/2 - 10, this.game.world.height/2 + 110, "blank"); //enemy target for base
        this.baseXY.anchor.setTo(0.5);
        
        baseHealth = this.game.add.sprite(this.baseXY.x + 10, this.baseXY.y + 20, "baseHealth"); //enemy target for base
        baseHealth.anchor.setTo(0.5);
        baseHealth.scale.setTo(0.6);
        baseHealth.health = 100;
        baseHealth.frame = 0;
    },    
    update: function() {
        //Update local variables
        myPlayer = this.player;
        myTurret = this.turret;
        myEnemies = this.enemies;
        this.updateHealth();
        myGame.world.bringToTop(healthBar);  

        //Reset player movement
        myPlayer.body.velocity.y = 0;
        myPlayer.body.velocity.x = 0;

        //Face pointer direction 
        myTurret.rotation = myGame.physics.arcade.angleToPointer(myPlayer) + 1.571 - myPlayer.rotation; //Pi/2  

        //Mouse/Touch input
        if((myGame.input.mousePointer.isDown || myGame.input.activePointer.isDown) && (myGame.physics.arcade.distanceBetween(myGame.input.activePointer, myPlayer) > 110)) {   
            this.fire();
        }

        //Keyboard input
        if(this.cursors.up.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.W)) {
            myGame.physics.arcade.velocityFromRotation(myPlayer.rotation + 1.571 , 130, myPlayer.body.velocity);
            ismoving = true
        }        
        if(this.cursors.down.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.S)) {
            myGame.physics.arcade.velocityFromRotation(myPlayer.rotation + 1.571 , -70, myPlayer.body.velocity);
            ismoving = true
        }
        if(this.cursors.left.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.A)) {
            myPlayer.rotation -= 0.05;
        }
        else if(this.cursors.right.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.D)) {
            myPlayer.rotation += 0.05;
        }
        
        //Stop movement
        if(myPlayer.body.velocity.x == 0) { 
           ismoving = false;
        }
        
        //Play tank sounds
        if(ismoving) { 
            tankMove.play("", 0, 0.5, true, false);
        } else {
            tankMove.stop();
        }
        
        //Update Enemies
        this.updateEnemies(myEnemies);
        

        //Collisions
        myGame.physics.arcade.collide(myPlayer, this.walkArea);    
        myGame.physics.arcade.collide(myEnemies, myEnemies, this.enemyOnEnemy, null, this);
        myGame.physics.arcade.collide(myPlayer, myEnemies, this.enemyCollide, null, this);
        myGame.physics.arcade.collide(myBullets, myEnemies, this.killEnemy, null, this);
        myGame.physics.arcade.collide(myBullets, this.base, this.playerHitBase, null, this);
        myGame.physics.arcade.collide(enemyBullets, this.base, this.baseHit, null, this);
        myGame.physics.arcade.overlap(myPlayer, enemyBullets, this.playerHit, null, this);
    },
    playerHit: function(player, bullet) {
        player.health -= 1;
        
        setTimeout(function () {
            healthBar.frame = 11;
            myGame.world.bringToTop(healthBar);
        }), 5000;  
                   
        this.updateHealth();
        
        //check for loss
        if(myPlayer.health <= 0) {
            playerExplode.play("", 0, 0.7);
            this.state.start("Lose", [score, waveN]);
        }
        bullet.kill();
    },
    enemyCollide: function(player, enemy) {
        player.health -= 10;
        score -= 10;
        
        setTimeout(function () {
            healthBar.frame = 11; 
            myGame.world.bringToTop(healthBar);
        }), 5000;        
        
        //check for loss
        if(myPlayer.health <= 0) {
            playerExplode.play("", 0, 0.7);
            this.state.start("Lose", [score, waveN]);
        }

        enemyExplode.play("", 0, 0.7);
        this.explode(enemy);

        enemy.destroy();
        enemyCount--;   

        this.updateScore();
        this.updateWaveE();
        this.updateHealth();

        //Check for wave end
        if(enemyCount == 0) {
            waveN++;
            if(waveN <= 10) {
                waveE = waveN * 3;
            } else {
                waveE = waveN * 2; 
            }           
            enemyCount = waveE;
            score += 500;
            this.updateWaveN();            
            this.createEnemies(waveE);
            if(waveN >= 10) {
                this.enemies.forEach(function(enemy) {enemy.health = 80; if(waveN >= 15) {enemy.speed = 140}});
            }
            this.updateWaveE();
            this.updateScore();
        }
    },    
    updateEnemies: function(enemyGrp) {
        var A = this;

        enemyGrp.forEach(function(enemy) {
            if(myGame.physics.arcade.distanceBetween(enemy, myPlayer) < 200 && myGame.physics.arcade.distanceBetween(enemy, A.baseXY) > 240) { //if far from base, close to player
                enemy.rotation = myGame.physics.arcade.angleToXY(enemy, myPlayer.x, myPlayer.y) + 4.713; // 3Pi/2
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
                A.enemyFire(enemy, -50, -50, myPlayer);
                A.enemyFire(enemy, 50, 50, myPlayer);
            } 
            else if(myGame.physics.arcade.distanceBetween(enemy, A.baseXY) < 230) { //if close to base
                enemy.rotation = myGame.physics.arcade.angleToXY(enemy, A.baseXY.x, A.baseXY.y) + 4.713; // 3Pi/2
                enemy.body.velocity.x = 0;
                enemy.body.velocity.y = 0;
                A.enemyFire(enemy, -50, -50, A.baseXY);
                A.enemyFire(enemy, 50, 50, A.baseXY);
            } 
            else { //if far from player and base, move normally
                enemy.tileX = Math.floor(enemy.x/32) - 1;
                enemy.tileY = Math.floor(enemy.y/32) - 1;
                if (enemy.pathToBase.length !== 0) {
                    if (enemy.tileX === enemy.pathToBase[0].x && enemy.tileY === enemy.pathToBase[0].y) {
                        //check whether there are any more tiles in path
                        if (enemy.pathToBase.length > 1) {
                            //Get NextTile
                            enemy.pathToBase.shift();
                            enemy.xDir = enemy.pathToBase[0].x - enemy.tileX;//Left or right
                            enemy.yDir = enemy.pathToBase[0].y - enemy.tileY;//Up or down
                        } else {
                            enemy.pathToBase = [];
                            enemy.xDir = 0;
                            enemy.yDir = 0;
                        }
                    }
                }
                //Face in correct direction
                if (enemy.xDir === 1) {
                    enemy.angle = -90;
                }
                else if (enemy.xDir === -1) {
                    enemy.angle = 90;
                }
                else if (enemy.yDir === 1) {
                    enemy.angle = 0;
                }
                else if (enemy.yDir === -1) {
                    enemy.angle = 180;
                }
                enemy.body.velocity.x = enemy.xDir * enemy.speed;
                enemy.body.velocity.y = enemy.yDir * enemy.speed;
            }
        }); 
    },
    enemyOnEnemy: function(enemy1, enemy2) {
        //If enemies collide, get new path for both models
        var A = this;
        A.findPathFrom(enemy1.tileX, enemy1.tileY);
        enemy1.pathToBase = path_ary;
        A.findPathFrom(enemy2.tileX, enemy2.tileY);
        enemy2.pathToBase = path_ary;
    },
    killEnemy: function(bullet, enemy) {        
        enemy.health -= 100;

        if(enemy.health <= 0) {
            enemyExplode.play("", 0, 0.7);
            this.explode(enemy);
            enemy.destroy();
            enemyCount--;
            score += 100;
            this.updateScore();
            this.updateWaveE();

            //Check for wave end
            if(enemyCount == 0) {
                waveN++;
                if(waveN <= 10) {
                    waveE = waveN * 3;
                } else {
                    waveE = waveN * 2; 
                }           
                enemyCount = waveE;
                score += 500;
                this.updateWaveN();            
                this.createEnemies(waveE);
                if(waveN >= 10) {
                    this.enemies.forEach(function(enemy) {enemy.health = 180; if(waveN >= 15) {enemy.speed = 140}});
                }
                this.updateWaveE();
            }
        }        
        bullet.kill();
    },
    killBullet: function(bullet, wall) {       
        bullet.kill();
    },
    baseHit: function(bullet, base) {       
        bullet.kill();        
        baseHealth.health -= 0.1;
        this.updateBaseHealth();
        
        if(baseHealth.health <= 0) {
            playerExplode.play("", 0, 0.7);
            this.explode(this.baseXY);
            this.state.start("Lose", [score, waveN]);       
        }
    },    
    playerHitBase: function(bullet, base) { 
        bullet.kill();        
        baseHealth.health -= 5;
        this.updateBaseHealth();
        
        if(baseHealth.health <= 0) {
            playerExplode.play("", 0, 0.7);
            this.explode(this.baseXY);
            this.state.start("Lose", [score, waveN]);
        }
    },
    createPlayer: function() {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "player");
        this.player.frame = 0;
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.player.anchor.setTo(0.5);
        this.player.body.allowRotation = false;

        this.player.health = 100;

        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.turret = this.game.make.sprite(0, -13, "turret");
        this.turret.anchor.setTo(0.5);
        this.player.addChild(this.turret);
        
        blank = this.game.make.sprite(0, -95, "blank"); //Spawn location for bullets
        blank.anchor.setTo(0.5);
        this.turret.addChild(blank);
        
        this.player.scale.setTo(0.75);
    },
    createBullets: function() {
        this.bullets = this.game.add.physicsGroup();
        this.bullets.enableBody = true;
        this.bullets.physicsbodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(150, "bullet");
        this.bullets.setAll("checkWorldBounds", true);
        this.bullets.setAll("outOfBoundsKill", true);
        this.bullets.setAll("anchor.x", 0.5);
        this.bullets.setAll("anchor.y", 0.5);
    },
    createEnemyBullets: function() {
        this.enemyBullets = this.game.add.physicsGroup();
        this.enemyBullets.enableBody = true;
        this.enemyBullets.physicsbodyType = Phaser.Physics.ARCADE;

        this.enemyBullets.createMultiple(50, "bullet");
        this.enemyBullets.setAll("checkWorldBounds", true);
        this.enemyBullets.setAll("outOfBoundsKill", true);
        this.enemyBullets.setAll("anchor.x", 0.5);
        this.enemyBullets.setAll("anchor.y", 0.5);
    },
    createEnemies: function(n) {
        var egame = this.game;
        this.enemies = this.game.add.group();
        //Pairs of coordinates representing the 5 spawn points
        var locX = [32, egame.world.width - 50, 70, 285, egame.world.width - 90];
        var locY = [128, 96, egame.world.height - 50, egame.world.height - 50, egame.world.height - 50];       
        var eMaker;
        var eTurret;
        var A = this;
        
        for(var i=0; i<n; i++) {  
            (function(i){
                window.setTimeout(function(){
                    var rand = Math.round(Math.floor(Math.random() * 5));
                    //Randomly select spawn point
                    eMaker = egame.add.sprite(locX[rand], locY[rand], "enemy");
                    egame.physics.arcade.enable(eMaker);                    
                    eMaker.tileX = Math.floor(locX[rand]/32) - 1; //Calculate start tile from spawn point
                    eMaker.tileY = Math.floor(locY[rand]/32) - 1;                    
                    A.findPathFrom(eMaker.tileX, eMaker.tileY); //Generate path from spawn point
                    eMaker.pathToBase = path_ary;
                    eMaker.health = 60;
                    eMaker.speed = 90;
                    eMaker.enemyFireRate = 150;
                    eMaker.enemyNextFire = 0;
                    eMaker.anchor.setTo(0.5, 0.5);
                    eMaker.scale.setTo(0.7);
                    eTurret = egame.make.sprite(-64, -70, "eTurret"); //Spawn location for turret                
                    eMaker.addChild(eTurret);
                    A.enemies.add(eMaker);
                    eMaker.eblank = egame.make.sprite(65, 160, "blank"); //Spawn location for bullets
                    eMaker.eblank.anchor.setTo(0.5);
                    eTurret.addChild(eMaker.eblank);
                }, i * 800);

            }(i));            
        }
    },
    fire: function() {           
        if(myGame.time.now > nextFire) {
            tankFire.play("", 0, 0.3);
            nextFire = myGame.time.now + fireRate;

            bullet = this.bullets.getFirstDead();

            bullet.reset(blank.world.x, blank.world.y);
            bullet.rotation = myGame.physics.arcade.angleToPointer(bullet) + 1.571; //Pi/2
            myGame.physics.arcade.moveToPointer(bullet, 1500);
        }
    },
    enemyFire:  function(enemy, gx, gy, target) {           
        if(myGame.time.now > enemy.enemyNextFire) {
            gx = gx || 0;
            gy = gy || 0;
            
            eFire.play("", 0, 0.1);
            enemy.enemyNextFire = myGame.time.now + enemy.enemyFireRate;

            enemyBullet = this.enemyBullets.getFirstDead();
            
            enemyBullet.scale.setTo(0.4);
            enemyBullet.body.gravity.set(gx, gy);
            enemyBullet.reset(enemy.eblank.world.x, enemy.eblank.world.y + this.game.rnd.between(-15, 15));
            enemyBullet.rotation = myGame.physics.arcade.angleToXY(enemyBullet, target.x, target.y) + 1.57; //Pi/2
            myGame.physics.arcade.moveToXY(enemyBullet, target.x, target.y, 400);
        }
    },
    explode: function(target) {        
        //Animation
        explosion = this.game.add.sprite(target.x, target.y, "explosion");
        explosion.anchor.setTo(0.5);
        explosion.scale.setTo(0.4);
        explosion.animations.add("boom");
        explosion.animations.play("boom", 30, false, true);
    },
    updateScore: function() {
        scoreText.setText(""+score);
    },
    updateWaveN: function() {
        waveText.setText(""+waveN);
    },
    updateWaveE: function() {
        enemyText.setText(enemyCount+"");
    },
    updateHealth: function() {        
        if(myPlayer.health <= 100 && myPlayer.health > 90) {
            healthBar.frame = 10;
        } else if(myPlayer.health <= 90 && myPlayer.health > 80) {
            healthBar.frame = 9;
        } else if(myPlayer.health <= 80 && myPlayer.health > 70) {
            healthBar.frame = 8;
        } else if(myPlayer.health <= 70 && myPlayer.health > 60) {
            healthBar.frame = 7;
        } else if(myPlayer.health <= 60 && myPlayer.health > 50) {
            healthBar.frame = 6;
        } else if(myPlayer.health <= 50 && myPlayer.health > 40) {
            healthBar.frame = 5;
        } else if(myPlayer.health <= 40 && myPlayer.health > 30) {
            healthBar.frame = 4;
        } else if(myPlayer.health <= 30 && myPlayer.health > 20) {
            healthBar.frame = 3;
        } else if(myPlayer.health <= 20 && myPlayer.health > 10) {
            healthBar.frame = 2;
        } else if(myPlayer.health <= 10 && myPlayer.health > 0) {
            healthBar.frame = 1;
        }
    },
    updateBaseHealth: function() {        
        if(baseHealth.health <= 100 && baseHealth.health > 95) {
            baseHealth.frame = 0;
        } else if(baseHealth.health <= 95 && baseHealth.health > 90) {
            baseHealth.frame = 1;
        } else if(baseHealth.health <= 90 && baseHealth.health > 85) {
            baseHealth.frame = 2;
        } else if(baseHealth.health <= 85 && baseHealth.health > 80) {
            baseHealth.frame = 3;
        } else if(baseHealth.health <= 80 && baseHealth.health > 75) {
            baseHealth.frame = 4;
        } else if(baseHealth.health <= 75 && baseHealth.health > 70) {
            baseHealth.frame = 5;
        } else if(baseHealth.health <= 70 && baseHealth.health > 65) {
            baseHealth.frame = 6;
        } else if(baseHealth.health <= 65 && baseHealth.health > 60) {
            baseHealth.frame = 7;
        } else if(baseHealth.health <= 60 && baseHealth.health > 55) {
            baseHealth.frame = 8;
        } else if(baseHealth.health <= 55 && baseHealth.health > 50) {
            baseHealth.frame = 9;
        } else if(baseHealth.health <= 50 && baseHealth.health > 45) {
            baseHealth.frame = 10;
        } else if(baseHealth.health <= 45 && baseHealth.health > 40) {
            baseHealth.frame = 11;
        } else if(baseHealth.health <= 40 && baseHealth.health > 35) {
            baseHealth.frame = 12;
        } else if(baseHealth.health <= 35 && baseHealth.health > 30) {
            baseHealth.frame = 13;
        } else if(baseHealth.health <= 30 && baseHealth.health > 25) {
            baseHealth.frame = 14;
        } else if(baseHealth.health <= 25 && baseHealth.health > 20) {
            baseHealth.frame = 15;
        } else if(baseHealth.health <= 20 && baseHealth.health > 15) {
            baseHealth.frame = 16;
        } else if(baseHealth.health <= 15 && baseHealth.health > 10) {
            baseHealth.frame = 17;
        } else if(baseHealth.health <= 10 && baseHealth.health > 5) {
            baseHealth.frame = 18;
        } else if(baseHealth.health <= 5 && baseHealth.health > 0) {
            baseHealth.frame = 19;
        } else if(baseHealth.health == 0) {
            baseHealth.frame = 20;
        }
    },
    findPathFrom: function(tilex, tiley) {
        //Pairs of destination coordinates for around base
        var destX = [11, 18, 11, 18];
        var destY = [14, 15, 21, 21];
        //Randomly select destination tile
        var rand = Math.round(Math.floor(Math.random() * 4));
        pathfinder.setCallbackFunction(this.processPath);
        pathfinder.preparePathCalculation([tilex, tiley], [destX[rand], destY[rand]]); //Path from enemy location to base
        path = pathfinder.calculatePath();
    },
    processPath: function(path) {
        var mymap = this.map;
        path_ary = path || [];
        return path_ary;
    }
};
