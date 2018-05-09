Tankk.Lose = function(){};

Tankk.Lose.prototype = {
    create: function() {
        this.backgroundColor = "#000"; 
        
        var splash = this.add.sprite(window.innerWidth/2, window.innerHeight/2 - 200, "lose"); //new lose screen required
        splash.anchor.setTo(0.5, 0.5);
        
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
        
        /*
        var restartButton = this.add.button(window.innerWidth/2, window.innerHeight/2 + 200, "PlayAgainBTN", function() {
            this.game.sound.stopAll();
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        restartButton.anchor.setTo(0.5);*/
        
        var restartButton = this.add.button(window.innerWidth/2, window.innerHeight/2 + 200, "playButton", function() {
            this.game.sound.stopAll();
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        restartButton.anchor.setTo(0.5);
        restartButton.scale.setTo(0.07);
    }
}