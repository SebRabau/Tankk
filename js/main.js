var Tankk = Tankk || {}; //Use existing Tankk, or make new object
Tankk.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "");

Tankk.game.state.add("Boot", Tankk.Boot);
Tankk.game.state.add("Preload", Tankk.Preload);
Tankk.game.state.add("MainMenu", Tankk.MainMenu);
Tankk.game.state.add("Game", Tankk.Game);

Tankk.game.state.start("Boot");