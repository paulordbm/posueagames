var audioMenu;
var style = { font: "30px Arial", fill: "#ffffff" };
//Menu.js
var menuState = { 
	
	
	
	preload: function(){
		game.load.image('logoMenu', 'assets/splash.png');
		game.load.audio('audioMenu', 'assets/dbzOpening.mp3');

	},
    create: function() {
		//Toca audio do menu
		audioMenu = game.add.audio('audioMenu',1,true);
		audioMenu.play('',0,1,true);
		
		var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceBar.onDown.add(this.start,this);
		
				
		var spriteLogoMenu =  game.add.sprite(0, 0, 'logoMenu');
		//Texto do menu
		var text = this.game.add.text(game.world.width/2 - 180, 0, "Pressione barra!", style);
		game.add.tween(text).to( { y: this.game.world.height/2}, 2400, Phaser.Easing.Bounce.In, true);
    },
	
    start: function() {
		audioMenu.stop();
        this.game.state.start('play');
    }
};