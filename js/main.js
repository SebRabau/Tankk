/* main.js initialises all of the states used in the game, 
 * as well as creating the first instance on the game. 
 * Finally it initiates the Boot state.
 */

var Tankk = Tankk || {}; //Use existing Tankk, or make new object
Tankk.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, "");

Tankk.game.state.add("Boot", Tankk.Boot);
Tankk.game.state.add("Preload", Tankk.Preload);
Tankk.game.state.add("MainMenu", Tankk.MainMenu);
Tankk.game.state.add("Game", Tankk.Game);
Tankk.game.state.add("Lose", Tankk.Lose);

Tankk.game.state.start("Boot");
