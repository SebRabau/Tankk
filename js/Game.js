var Tankk = Tankk || {};

Tankk.Game = function(){};

var fireRate = 800;
var nextFire = 0;
/*var healthBar;
var waveN;
var waveE;
var enemyCount;
var score;
var scoreText;
var music;
var collect;
var loseLife;
var shoot;
var splat;
var explode;
var blank;*/
var bullet;

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

var pathfinder;
var walkables;

Tankk.Game.prototype = {
    create: function() {
        this.map = this.game.add.tilemap("map");         
        this.map.addTilesetImage("DirtToRoad", "DirtToRoad");
        this.map.addTilesetImage("Bush_02", "Bush_02");
        this.map.addTilesetImage("Tree_01", "Tree_01");
        this.map.addTilesetImage("RoadDecals", "RoadDecals");
        this.map.addTilesetImage("Bush_01", "Bush_01");
        this.map.addTilesetImage("BrokenChopper", "BrokenChopper");
        this.map.addTilesetImage("Humvee_Broken_05", "Humvee_Broken_05");    
        this.map.addTilesetImage("Base", "Base");    

        
        this.dirt = this.map.createLayer("Dirt");
        this.track = this.map.createLayer("Roads");
        this.base = this.map.createLayer("Base");
        this.obstacle = this.map.createLayer("Obstacle");


        this.map.setCollisionBetween(216, 300, true, "Obstacle");
        this.map.setCollisionBetween(300, 335, true, "Base");
        
        /*this.dirt.scale.setTo(0.7);
        this.track.scale.setTo(0.7);
        this.base.scale.setTo(0.7);
        this.trees.scale.setTo(0.7);
        this.obstacle.scale.setTo(0.7);*/
        this.dirt.resizeWorld();  //Find alternative?? 
        //this.world.setBounds(0, 0, 1270, 1270);
        
        

        /*if(this.game.width > 1450) { //Compatibility for larger monitors
            this.game.width = 1450;
        }*/

        enemyCount = waveE;
        score = 0;/*

        this.createObjects();*/
        this.createBullets();
        this.createPlayer();        
        this.createEnemies(waveE);

        //UI
        healthBar = this.game.add.sprite(this.game.world.width/2, this.game.world.height - 50, "healthBar");
        healthBar.anchor.setTo(0.5);
        healthBar.scale.setTo(3, 1);
        healthBar.fixedToCamera = true;  

        scoreText = this.game.add.text(this.game.world.width/6, 30, "Score = " + score, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        scoreText.anchor.setTo(0.5);
        scoreText.fixedToCamera = true;

        waveText = this.game.add.text(this.game.world.width/2, 30, "Wave " + waveN, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        waveText.anchor.setTo(0.5);
        waveText.fixedToCamera = true;

        enemyText = this.game.add.text(this.game.world.width - this.game.world.width/6, 30, enemyCount+" enemies left", {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        enemyText.anchor.setTo(0.5);
        enemyText.fixedToCamera = true;

        //create local variables
        myGame = this.game; 
        myBullets = this.bullets;

        //Audio
        tankIdle = myGame.add.audio("tankIdle");
        tankIdle.play("", 0, 0.1, true);
        tankMove = myGame.add.audio("tankMove");
        tankFire = myGame.add.audio("tankFire");
        playerExplode = myGame.add.audio("playerExplode");
        enemyExplode = myGame.add.audio("enemyExplode");
        
        //Pathfinding
        pathfinder = myGame.plugins.add(Phaser.Plugin.PathFinderPlugin);
        walkables = Array.from(new Array(231), (x,i) => i + 1);
        console.log(walkables);
        pathfinder.setGrid(this.map.layers[1].data, walkables);
        this.findPathFrom(0, 0);

        /*
        music = myGame.add.audio("GameMusic");
        music.play("", 0, 0.7, true);

        collect = myGame.add.audio("collect");
        loseLife = myGame.add.audio("loseLife");
        shoot = myGame.add.audio("shoot");
        splat = myGame.add.audio("splat");
        explode = myGame.add.audio("explode");*/
    },
    update: function() {
        //Update local variables
        myPlayer = this.player;
        myTurret = this.turret;
        myEnemies = this.enemies;
        //myPills = this.pills;
        myGame.world.bringToTop(healthBar);  
        
        //console.log(myGame.physics.arcade.distanceBetween(myGame.input.activePointer, myPlayer));

        //reset player movement
        myPlayer.body.velocity.y = 0;
        myPlayer.body.velocity.x = 0;

        //Face pointer direction 
        myTurret.rotation = myGame.physics.arcade.angleToPointer(myPlayer) + 1.571 - myPlayer.rotation; //Pi/2  

        //Mouse/Touch input
        if((myGame.input.mousePointer.isDown || myGame.input.activePointer.isDown) && (myGame.physics.arcade.distanceBetween(myGame.input.activePointer, myPlayer) > 130)) {   
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
        
        //stop movement
        if(myPlayer.body.velocity.x == 0) { 
           ismoving = false;
        }
        
        //play tank sounds
        if(ismoving) { 
            tankMove.play("", 0, 0.5, true, false);
        } else {
            tankMove.stop();
        }
        /*
        //Enemy movement
        myEnemies.forEach(function(enemy) {
            myGame.physics.arcade.moveToObject(enemy, myPlayer, enemy.speed);
            enemy.rotation = myGame.physics.arcade.angleToXY(enemy, myPlayer.x, myPlayer.y) + 4.713; // 3Pi/2
        });*/

        //Collisions
        myGame.physics.arcade.collide(myPlayer, this.obstacle);        
        myGame.physics.arcade.collide(myEnemies, this.obstacle);
        myGame.physics.arcade.collide(myPlayer, this.base);
        myGame.physics.arcade.collide(myEnemies, this.base);
        myGame.physics.arcade.collide(myEnemies, myEnemies);
        myGame.physics.arcade.collide(myPlayer, myEnemies, this.enemyCollide, null, this);
        myGame.physics.arcade.collide(myBullets, myEnemies, this.killEnemy, null, this);
        myGame.physics.arcade.collide(myBullets, this.base, this.killBullet, null, this);
        //myGame.physics.arcade.overlap(myPlayer, myPills, this.collectPill, null, this);
        
        
    },
    createObjects: function() {
        /*this.pills = this.game.add.physicsGroup();    

        var one = this.game.add.sprite(255, 670, "pill");
        var two = this.game.add.sprite(1230, 105, "pill");
        var three = this.game.add.sprite(1357, 1228, "pill");

        this.pills.add(one);
        this.pills.add(two);
        this.pills.add(three);*/
    },
    collectPill: function(player, pill) {
        /*player.health = 100;
        this.updateHealth();
        collect.play("", 0, 0.7);
        pill.kill();*/
    },
    enemyCollide: function(player, enemy) {
        player.health -= 10;
        score -= 10;

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
        }
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
                    this.enemies.forEach(function(enemy) {enemy.health = 80; if(waveN >= 15) {enemy.speed = 140}});
                }
                this.updateWaveE();
            }
        }        
        bullet.kill();
    },
    killBullet: function(bullet, wall) {       
        bullet.kill();
    },
    createPlayer: function() {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "player");
        this.player.frame = 0;
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.player.anchor.setTo(0.5);
        this.player.body.allowRotation = false;

        this.player.health = 100;

        //this.game.camera.follow(this.player); 

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

        this.bullets.createMultiple(50, "bullet");
        this.bullets.setAll("checkWorldBounds", true);
        this.bullets.setAll("outOfBoundsKill", true);
        this.bullets.setAll("anchor.x", 0.5);
        this.bullets.setAll("anchor.y", 0.5);
    },
    createEnemies: function(n) {
        var egame = this.game;
        this.enemies = this.game.add.group();
        var locX = [0, egame.world.width, 70, 255, egame.world.width - 100];
        var locY = [90, 40, egame.world.height, egame.world.height, egame.world.height];        
        var eMaker;
        var eTurret;
        var eE = this.enemies;
        
        for(var i=0; i<n; i++) {  
            (function(i){

                window.setTimeout(function(){
                var rand = Math.round(Math.floor(Math.random() * 5));
                console.log(rand);
                eMaker = egame.add.sprite(locX[rand], locY[rand], "enemy");
                egame.physics.arcade.enable(eMaker);
                eE.add(eMaker);
                }, i * 500);

            }(i));            
        }

        this.enemies.forEach(function(enemy) {
            enemy.health = 60;
            enemy.speed = 80;
            enemy.anchor.setTo(0.5, 0.5);
            enemy.scale.setTo(0.8);
            
            eTurret = egame.make.sprite(-64, -70, "eTurret"); //Spawn location for bullets
            blank.anchor.setTo(0.5);
            enemy.addChild(eTurret);
            //enemy.body.collideWorldBounds = true;
        });
    },
    fire:  function() {           
        if(myGame.time.now > nextFire) {
            tankFire.play("", 0, 0.3);
            nextFire = myGame.time.now + fireRate;

            bullet = this.bullets.getFirstDead();

            bullet.reset(blank.world.x, blank.world.y);
            bullet.rotation = myGame.physics.arcade.angleToPointer(bullet) + 1.571; //Pi/2
            myGame.physics.arcade.moveToPointer(bullet, 1500);
        }
    },
    explode: function(target) {
        var emitter = this.game.add.emitter(target.x, target.y, 100);
        emitter.makeParticles("player");
        //emitter.makeParticles("particle");
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 250, null, 100);
        myGame.time.events.add(250, function() {
            emitter.destroy();
        });
    },
    updateScore: function() {
        scoreText.setText("Score = "+score);
    },
    updateWaveN: function() {
        waveText.setText("Wave "+waveN);
    },
    updateWaveE: function() {
        enemyText.setText(enemyCount+" enemies left");
    },
    updateHealth: function() {        
        if(myPlayer.health == 100) {
            healthBar.frame = 0;
        } else if(myPlayer.health == 90) {
            healthBar.frame = 1;
        } else if(myPlayer.health == 80) {
            healthBar.frame = 2;
        } else if(myPlayer.health == 70) {
            healthBar.frame = 3;
        } else if(myPlayer.health == 60) {
            healthBar.frame = 4;
        } else if(myPlayer.health == 50) {
            healthBar.frame = 5;
        } else if(myPlayer.health == 40) {
            healthBar.frame = 6;
        } else if(myPlayer.health == 30) {
            healthBar.frame = 7;
        } else if(myPlayer.health == 20) {
            healthBar.frame = 8;
        } else if(myPlayer.health == 10) {
            healthBar.frame = 9;
        } 
    },
    findPathFrom: function(tilex, tiley) {
        pathfinder.setCallbackFunction(this.processPath);
        pathfinder.preparePathCalculation([tilex, tiley], [1, 1]);
        pathfinder.calculatePath();
    },
    processPath: function(path) {
        path_ary = path || [];
        for (var i = 0, ilen = path_ary.length; i < ilen; i++) {
            console.log(">>>" + path_ary[i].x + " " + path_ary[i].y);
        }
    }
};
