//Enemy
var Enemy = function(game){
	this.game = game;
	this.tipo;
	this.path = ['assets/images/hero/hero.png'];
	this.LITTLE_TYPE = 0 // inimigo grande;
	this.MIDLE_TYPE = 1 //inimigo pequeno;
	this.BIG_TYPE = 2 //inimigo que voa;
	this.enemies;
	this.map;
	this.inimigos = 'inimigos';

	//Properties
	this.width = 50;
    this.height  = 50;
    this.animationsQtd = 6;
};

Enemy.prototype = {
	preload : function(){
		this.game.load.spritesheet('enemy', this.path[0], this.width, this.height, this.animationsQtd);
	},
	create : function(map){
		this.map = map;
		this.enemies =  this.game.add.group();
		this.enemies.enableBody = true;
		this.map.createFromObjects(this.inimigos, 6, 'enemy', 0, true, false, this.enemies);
		this.enemies.forEach(this.setupEnemies,this);
	},
	update : function(){
		//Faz inimigo 3 ficar voando
		this.enemies.forEach(function(enemy){
			if (enemy.body.onFloor() && enemy.TYPE == this.BIG_TYPE) {
				enemy.body.velocity.y = -150 + Math.random() * - 100;
			}
		},this);
		
	},
	setupEnemies : function(enemy){
	    if (enemy.key == 'enemy'){
	    	this.game.physics.enable(enemy, Phaser.Physics.P2);
	    	enemy.body.collideWorldBounds = true;
	        enemy.scale.setTo(0.5,0.5);
	        enemy.animations.add('walk', [0,1,2,3,4,3,2,1], 10, true);
	        enemy.animations.add('attack',[0,1],2,true);
			enemy.animations.play('walk');
	        enemy.health = 100;
			enemy.TYPE = Math.round(Math.random()*2);
	    }
	}
};