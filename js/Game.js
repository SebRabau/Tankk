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

Tankk.Game.prototype = {
    create: function() {
        /*this.map = this.game.add.tilemap("map");
        this.map.addTilesetImage("Floor", "tiles");      
        this.floor = this.map.createLayer("Floor");
        this.walls = this.map.createLayer("Walls");

        this.map.setCollisionBetween(5, 6, true, "Walls");

        this.floor.resizeWorld();

        if(this.game.width > 1450) { //Compatibility for larger monitors
            this.game.width = 1450;
        }

        enemyCount = waveE;
        score = 0;

        this.createObjects();*/
        this.createBullets();
        this.createPlayer();        
        /*this.createEnemies(waveE); 

        //UI
        healthBar = this.game.add.sprite(this.game.width/2, this.game.height - 70, "healthBar");
        healthBar.anchor.setTo(0.5);
        healthBar.scale.setTo(3, 1);
        healthBar.fixedToCamera = true;  

        scoreText = this.game.add.text(this.game.width/6, 30, "Score = " + score, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        scoreText.anchor.setTo(0.5);
        scoreText.fixedToCamera = true;

        waveText = this.game.add.text(this.game.width/2, 30, "Wave " + waveN, {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        waveText.anchor.setTo(0.5);
        waveText.fixedToCamera = true;

        enemyText = this.game.add.text(this.game.width - this.game.width/6, 30, enemyCount+" enemies left", {        
            font: "30px Arial",
            fill: "#fff",
            align: "center"
        });
        enemyText.anchor.setTo(0.5);
        enemyText.fixedToCamera = true;*/

        //create local variables
        myGame = this.game; 
        /*myBullets = this.bullets;*/

        //Audio
        tankIdle = myGame.add.audio("tankIdle");
        tankIdle.play("", 0, 0.1, true);
        tankMove = myGame.add.audio("tankMove");
        tankFire = myGame.add.audio("tankFire");
        playerExplode = myGame.add.audio("playerExplode");
        enemyExplode = myGame.add.audio("enemyExplode");
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
        /*myEnemies = this.enemies;
        myPills = this.pills;
        myGame.world.bringToTop(healthBar);*/  

        //reset player movement
        myPlayer.body.velocity.y = 0;
        myPlayer.body.velocity.x = 0;

        //Face pointer direction 
        myTurret.rotation = myGame.physics.arcade.angleToPointer(myPlayer) + 1.571 - myPlayer.rotation; //Pi/2  

        //Mouse/Touch input
        if((myGame.input.mousePointer.isDown || myGame.input.activePointer.isDown) && (myGame.physics.arcade.distanceBetween(myGame.input.activePointer, myPlayer) > 120)) {   
            this.fire();
        }

        //Keyboard input
        if(this.cursors.up.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.W)) {
            myGame.physics.arcade.velocityFromRotation(myPlayer.rotation + 1.571 , 200, myPlayer.body.velocity);
            ismoving = true
        }        
        if(this.cursors.down.isDown || myGame.input.keyboard.isDown(Phaser.Keyboard.S)) {
            myGame.physics.arcade.velocityFromRotation(myPlayer.rotation + 1.571 , -130, myPlayer.body.velocity);
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

        //Enemy movement
        /*myEnemies.forEach(function(enemy) {
            myGame.physics.arcade.moveToObject(enemy, myPlayer, enemy.speed);
            enemy.rotation = myGame.physics.arcade.angleToXY(enemy, myPlayer.x, myPlayer.y) + 1.571; // Pi/2
        });

        //Collisions
        myGame.physics.arcade.collide(myPlayer, this.walls);
        myGame.physics.arcade.collide(myPlayer, this.world);
        myGame.physics.arcade.collide(myEnemies, this.walls);
        myGame.physics.arcade.collide(myEnemies, myEnemies);
        myGame.physics.arcade.collide(myPlayer, myEnemies, this.enemyCollide, null, this);
        myGame.physics.arcade.collide(myBullets, myEnemies, this.killEnemy, null, this);
        myGame.physics.arcade.collide(myBullets, this.walls, this.killBullet, null, this);
        myGame.physics.arcade.overlap(myPlayer, myPills, this.collectPill, null, this);*/
        
        
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
        /*player.health -= 10;
        score -= 10;

        //check for loss
        if(myPlayer.health <= 0) {
            loseLife.play("", 0, 0.7);
            this.state.start("Lose", [score, waveN]);
        }

        explode.play("", 0, 0.7);
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
        }*/
    },
    killEnemy: function(bullet, enemy) {        
        /*enemy.health -= 20;

        if(enemy.health <= 0) {
            splat.play("", 0, 0.7);
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
        bullet.kill();*/
    },
    killBullet: function(bullet, wall) {       
        /*bullet.kill();*/
    },
    createPlayer: function() {
        this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, "player");
        this.player.frame = 0;
        this.game.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        this.player.anchor.setTo(0.5);
        this.player.body.allowRotation = false;

        this.player.health = 100;

        this.game.camera.follow(this.player); 

        this.cursors = this.game.input.keyboard.createCursorKeys();
        
        this.turret = this.game.make.sprite(0, -13, "turret");
        this.turret.anchor.setTo(0.5);
        this.player.addChild(this.turret);
        
        blank = this.game.make.sprite(0, -95, "blank"); //Spawn location for bullets
        blank.anchor.setTo(0.5);
        this.turret.addChild(blank);
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
        /*this.enemies = this.game.add.group();
        var randX;
        var randY;
        var eMaker;
        for(var i=0; i<n; i++) {
            randX = Math.floor(Math.random() * 1450) + 100;
            randY = Math.floor(Math.random() * 1450) + 100;
            eMaker = this.game.add.sprite(randX, randY, "enemy");
            this.game.physics.arcade.enable(eMaker);
            this.enemies.add(eMaker);
        }

        this.enemies.forEach(function(enemy) {
            enemy.health = 60;
            enemy.speed = 120;
            enemy.anchor.setTo(0.5, 0.5);  
        });*/
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
        /*var emitter = this.game.add.emitter(target.x, target.y, 100);
        emitter.makeParticles("particle");
        emitter.minParticleSpeed.setTo(-200, -200);
        emitter.maxParticleSpeed.setTo(200, 200);
        emitter.gravity = 0;
        emitter.start(true, 250, null, 100);
        myGame.time.events.add(250, function() {
            emitter.destroy();
        });*/
    },
    updateScore: function() {
        /*scoreText.setText("Score = "+score);*/
    },
    updateWaveN: function() {
        /*waveText.setText("Wave "+waveN);*/
    },
    updateWaveE: function() {
        /*enemyText.setText(enemyCount+" enemies left");*/
    },
    updateHealth: function() {        
        /*if(myPlayer.health == 100) {
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
        } */
    }
};