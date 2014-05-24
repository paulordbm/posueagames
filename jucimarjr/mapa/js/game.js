
var dino, layer, group, map;
var game = new Phaser.Game(960, 600, Phaser.AUTO, 'phaser-game', { preload: preload, create: create, update: update });

function preload () {
	//game.stage.backgroundColor = "#ffffff";
	game.load.tilemap('mapa','assets/mapa.json',null,Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('dino', 'assets/dinossauro_40-32-6.png', 40,32,6); // 200x160 eh o tamanho do frame da sprite
	game.load.image('coxa', 'assets/coxa.png');
	game.load.image('fundo', 'assets/fundo_1920-600.jpg');
   	game.load.image('tileset','assets/tileset.png');
}

function create () {
	//fundo
	//game.add.sprite(0, 0, 'fundo');
    
    game.physics.startSystem(Phaser.Game.ARCADE);
	game.physics.arcade.gravity.y = 800;
    
    var bg = game.add.tileSprite(0,0,1920,600,'fundo');
    bg.fixedToCamera = true;

	
    map = game.add.tilemap('mapa');
	map.addTilesetImage('tileset','tileset');
	
	layer = map.createLayer('Camada de Tiles 1');
	layer.resizeWorld(); //seta o mundo com as alterações feitas
	map.setCollisionBetween(0,10, true,'Camada de Tiles 1'); // basta por de 0 a 17 (até onde vai os nossos gids)

	// Adicionando objetos do mapa ao grupo
	group = game.add.group();
	group.enableBody = true;
	map.createFromObjects('Camada de Objetos 1',4, 'coxa', 0,true,false, group);
	group.forEach(function (coxa){ coxa.body.allowGravity = false}, this); // faz com que as coxas nao caiam

    dino = game.add.sprite(10,1000 ,'dino', 3);
	dino.anchor.setTo(.5, 1);
	game.physics.enable(dino);
    
    // CREATE A dino:
	dino = game.add.sprite(200, 0, 'dino');
	dino.animations.add('walk',[1,2],6,true);
	dino.animations.add('jump',[3,4,5],4,true);
	game.physics.enable(dino, Phaser.Physics.ARCADE); // permite que a sprite tenha um corpo fisico
   
    dino.body.acceleration.y = 100;
 
    dino.body.collideWorldBounds = true; // para no limite inferio da tela
    dino.body.drag.x = 100; //desloca 100 e para, só desloca de novo se clicada alguma tecla e quanto maior for seu valor, menos desloca
    dino.anchor.setTo(.5,.5); // diminui o espaco do deslocamento do espelhamento 
    dino.body.gravity.y = 150;
    game.camera.follow(dino);

}


function update () {
    
    game.physics.arcade.collide(layer, dino);
    game.physics.arcade.overlap(group, dino, eatCoxa, null,this);
    
    // PEGA A ENTRADA (tecla pressionada):	
	if ( game.input.keyboard.isDown (Phaser.Keyboard.LEFT) ) { // vai para esquerda
		dino.body.velocity.x = -100;
		dino.animations.play('walk');
		dino.scale.x = -1; // espelha se antes -1
	}
	else if ( game.input.keyboard.isDown (Phaser.Keyboard.RIGHT) ) { // vai para direita
		dino.body.velocity.x = 100;
		dino.scale.x = +1;  // espelha se antes 1
		dino.animations.play('walk');
	}
	else if ( game.input.keyboard.isDown (Phaser.Keyboard.UP) ) { // vai para cima

		dino.body.velocity.y = -100;
		dino.animations.play('jump');
	}
	else{
	    	dino.animations.stop();
			dino.frame = 0;
		}	
	
	
}

function eatCoxa (dino, coxa){
	coxa.kill();
}


