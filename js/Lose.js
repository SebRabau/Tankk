/* Lose.js shows a lose screen to the player upon a loss condition being met. 
*  It shows the logo, replay and home buttons, and runs a function (checkHighScore) 
*  that checks if a new high score has been achieved, and saves the new high-score to local storage.
 */

Tankk.Lose = function(){};

Tankk.Lose.prototype = {
    create: function() {
        this.backgroundColor = "#000";
        
        score = score || 0;        
        
        this.highestScore = localStorage.getItem("Highscore") || 0;
        
        var splash = this.add.sprite(window.innerWidth/2, window.innerHeight/2 - 200, "logo"); 
        splash.anchor.setTo(0.5, 0.5);
        splash.scale.setTo(0.25, 0.25);
        
        var loseText = this.add.text(window.innerWidth/2, window.innerHeight/2, "Your final score: "+score, {
            font: "30px Arial",
            fill: "#000",
            align: "center"
        });
        loseText.anchor.setTo(0.5);
        
        var waveText = this.add.text(window.innerWidth/2, window.innerHeight/2 + 100, "You reached Wave: "+waveN, {
            font: "30px Arial",
            fill: "#000",
            align: "center"
        });
        waveText.anchor.setTo(0.5);
        
        var homeButton = this.add.button(window.innerWidth/2 - 100, window.innerHeight/2 + 200, "home", function() {
            this.game.sound.stopAll();
            this.checkHighScore(score);
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        homeButton.anchor.setTo(0.3);
        homeButton.scale.setTo(0.3);
        
        var redoButton = this.add.button(window.innerWidth/2 + 50, window.innerHeight/2 + 200, "redo", function() {
            this.game.sound.stopAll();
            this.checkHighScore(score);
            this.state.start("Game", true, false, waveN = 1);            
        }, this, 1, 0, 2, 0);
        redoButton.anchor.setTo(0.3);
        redoButton.scale.setTo(0.3);
    },
    checkHighScore: function(score) {
        this.highestScore = localStorage.getItem("Highscore") || 0;
        this.HighscoreName = localStorage.getItem("HighscoreName") || "undefined";
        
        if(score > this.highestScore) {
            this.HighscoreName = prompt("You got a new High Score! Enter your name here: ");
            this.highestScore = Math.max(score, this.highestScore);
            localStorage.setItem("Highscore", this.highestScore);
            localStorage.setItem("HighscoreName", this.HighscoreName);
        }   
    }
}