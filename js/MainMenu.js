Tankk.MainMenu = function(){};

/*var music;
var instructions;
var insButton;
var EButton;
var MButton;
var HButton;*/

Tankk.MainMenu.prototype = {
    create: function() {
        this.game.world.width = window.innerWidth;
        this.game.world.height = window.innerHeight;
                
        var background = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, "background");
        background.anchor.setTo(0.5);
        //background.scale.setTo(0.8);

        //var logo = this.add.sprite(this.game.world.centerX, 100, "logo");
        //logo.anchor.setTo(0.5);        
        
        //Menu Music
        music = this.game.add.audio("MenuMusic");
        music.play("", 0, 0.7, true);
        
        //Instructions
        instructions = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, "instructions");
        instructions.anchor.setTo(0.5);
        instructions.scale.setTo(0.6);
        instructions.visible = 0; 
        
        //Buttons
        EButton = this.add.button(this.game.world.centerX + 70 , this.game.world.centerY + 162, "playButton", function() {
            music.stop();
            this.game.state.start("Game", [waveN = 1, waveE = 5]);
        }, this, 0, 2, 1, 0);
        EButton.anchor.setTo(0.5);
        EButton.scale.setTo(0.07);
        
        /*
        MButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 75, "menuButtons", function() {
            music.stop();
            this.game.state.start("Game", [waveN = 5, waveE = 15]);
        }, this, 9, 11, 10, 9);
        MButton.anchor.setTo(0.5);
        
        HButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 150, "menuButtons", function() {
            music.stop();
            this.game.state.start("Game", [waveN = 10, waveE = 30]);
        }, this, 3, 5, 4, 3);
        HButton.anchor.setTo(0.5);
        
        insButton = this.add.button(this.game.world.centerX, this.game.world.centerY - 100, "menuButtons", function() {
            instructions.visible = 1;
            this.game.world.bringToTop(instructions);
            insButton.inputEnabled = false;
            EButton.inputEnabled = false;
            MButton.inputEnabled = false;
            HButton.inputEnabled = false;
        }, this, 6, 8, 7, 6);
        insButton.anchor.setTo(0.5);
*/
        //highest score
        var text = "Highest score: "+this.highestScore+" set by "+this.HighscoreName;
        var style = { font: "24px Arial", fill: "#000", align: "center" };

        var h = this.game.add.text(this.game.world.centerX +80, this.game.world.centerY + 280, text, style);
        h.anchor.set(0.5);
        
    },
    init: function(score) {
        var score = score || 0;
        //this.highestScore = this.highestScore || 0;
        
        this.highestScore = localStorage.getItem("Highscore") || 0;
        
        if(score > this.highestScore) {
            this.HighscoreName = prompt("You got a new High Score! Enter your name here: ");
            this.highestScore = Math.max(score, this.highestScore);
            localStorage.setItem("Highscore", this.highestScore);
            localStorage.setItem("HighscoreName", this.HighscoreName);
        }        
    },
    update: function() {
        if(this.game.input.activePointer.justPressed()) {
            //instructions.visible = 0;
            //insButton.inputEnabled = true;
            EButton.inputEnabled = true;
            //MButton.inputEnabled = true;
            //HButton.inputEnabled = true;
        }
    }
}