var game = new Phaser.Game(960, 600, Phaser.AUTO, 'game_div');

//variavel global
var score = 0;
var label_score;

var playerSprite, deathSprite, bossSprite;
var playersGroup; //for multiply Power up
var plataformas;
var porwerUps;
var space_key;
var sound_flag = true;
var jump_sound;
var countHeadButts = 0;
var bossDirection;
//text
var text_sound;

//parallax
var background1;
var background2;
var background3;
var background4;
var background5;
var bossBackground;

// Define all the states
game.state.add('credits', credits_state);  
game.state.add('load', load_state);  
game.state.add('menu', menu_state);  
game.state.add('play', play_state);  
game.state.add('score', score_state);  

// Start with the 'load' state
game.state.start('load');