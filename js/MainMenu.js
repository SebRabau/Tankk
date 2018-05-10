/* MainMenu.js creates all the user interactive buttons to play the game, 
 * including a play button, mute button and instruction button.
 * Also includes highscores stored via localstorage. 
 * The update function is used to listen for clicks on the menu to hide the instructions
 * if they have been displayed. Finally, if the play button is clicked, the Game state is initialised.
 */

Tankk.MainMenu = function(){};

var music;
var instructions;
var insButton;
var PButton;
var muteButton;
var unmuteButton;

Tankk.MainMenu.prototype = {
    create: function() {
        this.game.world.width = window.innerWidth;
        this.game.world.height = window.innerHeight;
                
        var background = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, "background");
        background.anchor.setTo(0.5);       
        
        //Menu Music
        music = this.game.add.audio("MenuMusic");
        music.play("", 0, 0.7, true);
        
        //Instructions
        instructions = this.add.sprite(this.game.world.centerX, this.game.world.centerY + 50, "instructions");
        instructions.anchor.setTo(0.5);
        instructions.visible = 0; 
        
        //Buttons
        PButton = this.add.button(this.game.world.centerX, this.game.world.centerY + 162, "playButton", function() {
            music.stop();
            this.game.state.start("Game", [waveN = 1, waveE = 5]);
        }, this, 0, 2, 1, 0);
        PButton.anchor.setTo(0.5);
        PButton.scale.setTo(0.3);
        
        unmuteButton = this.add.button(this.game.world.centerX + 200 , this.game.world.centerY + 162, "nosound", function() {
            this.game.sound.mute = false;
            muteButton.visible = 1;
            muteButton.inputEnabled = true;
            unmuteButton.visible = 0;
            unmuteButton.inputEnabled = false;
        }, this, 0, 2, 1, 0);
        unmuteButton.anchor.setTo(0.5);
        unmuteButton.scale.setTo(0.3);
        unmuteButton.visible = 0;
        
        muteButton = this.add.button(this.game.world.centerX + 200 , this.game.world.centerY + 162, "sound", function() {
            this.game.sound.mute = true;
            unmuteButton.visible = 1;
            unmuteButton.inputEnabled = true;
            muteButton.visible = 0;
            muteButton.inputEnabled = false;
        }, this, 0, 2, 1, 0);
        muteButton.anchor.setTo(0.5);
        muteButton.scale.setTo(0.3);       
        
        insButton = this.add.button(this.game.world.centerX + 100, this.game.world.centerY + 162, "instructButton", function() {
            instructions.visible = 1;
            this.game.world.bringToTop(instructions);
            insButton.inputEnabled = false;
            PButton.inputEnabled = false;
            muteButton.inputEnabled = false;
        }, this, 6, 8, 7, 6);
        insButton.anchor.setTo(0.5);
        insButton.scale.setTo(0.3);

        //highest score
        var text = "Highest score: "+this.highestScore+" set by "+this.HighscoreName;
        var style = { font: "24px Arial", fill: "#000", align: "center" };

        var h = this.game.add.text(this.game.world.centerX +80, this.game.world.centerY + 280, text, style);
        h.anchor.set(0.5);
        
    },
    init: function(score) {
        var score = score || 0;
        this.highestScore = localStorage.getItem("Highscore") || 0;
        this.HighscoreName = localStorage.getItem("HighscoreName") || "undefined";
    },
    update: function() {
        if(this.game.input.activePointer.justPressed()) {
            instructions.visible = 0;
            insButton.inputEnabled = true;
            PButton.inputEnabled = true;
            muteButton.inputEnabled = true;
        }
    }
}