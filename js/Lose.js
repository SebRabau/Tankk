Tankk.Lose = function(){};

Tankk.Lose.prototype = {
    create: function() {
        this.backgroundColor = "#000"; 
        
        var splash = this.add.sprite(window.innerWidth/2, window.innerHeight/2 - 200, "logo"); //new lose screen required
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
        
        /*
        var restartButton = this.add.button(window.innerWidth/2, window.innerHeight/2 + 200, "PlayAgainBTN", function() {
            this.game.sound.stopAll();
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        restartButton.anchor.setTo(0.5);*/
        
        var homeButton = this.add.button(window.innerWidth/2 - 100, window.innerHeight/2 + 200, "home", function() {
            this.game.sound.stopAll();
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        homeButton.anchor.setTo(0.3);
        homeButton.scale.setTo(0.3);
        
        var redoButton = this.add.button(window.innerWidth/2 + 50, window.innerHeight/2 + 200, "redo", function() {
            this.game.sound.stopAll();
            this.state.start("MainMenu", true, false, score);            
        }, this, 1, 0, 2, 0);
        redoButton.anchor.setTo(0.3);
        redoButton.scale.setTo(0.3);
    }
}