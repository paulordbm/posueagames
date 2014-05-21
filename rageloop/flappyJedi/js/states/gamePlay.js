(function (app_container) {
    
    function Gameplay() {
        this.isStarted = false;
        this.score = 0;
        this.player = null;
        this.bg = null;
        this.fg = null;
        this.enemies = null;
        this.timer = null;
        this.weapon = null;
        this.weaponFactory = null;
    };

    Gameplay.prototype = {

        create: function () {

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.bg = this.game.add.tileSprite(0, 0, this.game.stage.bounds.width, 600, 'bg');
            this.fg = this.game.add.tileSprite(0, this.game.height -224, this.game.stage.bounds.width, 224, 'fg');

            this.player = this.game.add.sprite(100, this.game.height/2, 'player');
            this.game.physics.enable(this.player, Phaser.Physics.ARCADE);

            this.player.body.collideWorldBounds = true;

            this.player_tween = this.game.add.tween(this.player).to( { y: 200 }, 1000, Phaser.Easing.Linear.None, true, 0, 1000, true);

            this.enemies = this.game.add.group();
            this.enemies.createMultiple(20, 'enemy');            

            this.powerUps = new PowerUps(this.game);
            this.powerUps.init();

            this.weaponFactory = new WeaponFactory(this.game, this.player);
            this.weaponFactory.create();

            this.weapon = this.weaponFactory.nextWeapon();

            this.timer = this.game.time.events.loop(700, this.addElement, this);

            var style = { font: "40px Arial", fill: "#000000", align: "center" };
            this.score_text = this.game.add.text(this.game.world.centerX, 0, "Score: " + this.score, style);
            this.score_text.anchor.set(0.5, 0);
        },

        update: function() {

            if (!this.player.exists) {
                return;
            }


            this.game.physics.arcade.overlap(this.player, this.enemies, this.restart, null, this);
            this.game.physics.arcade.overlap(this.player, this.powerUps.group, this.getPowerUp, null, this);
            this.game.physics.arcade.overlap(this.weapon.group, this.enemies, this.killEnemy, null, this);

            if (this.player.y == 0 || this.player.y == (this.game.height - this.player.height)) {
                this.restart();
            }

            this.handleKeyDown();

            this.bg.tilePosition.x -= 15;
            this.fg.tilePosition.x -= 20;
        },

        update_score: function() {

            if (this.score_text) {
                this.score_text.setText("Score: " + this.score);
            }

            //FIXME: Choose a way to update weapons
            /*if (this.score % 10 == 0) {
                if (this.weaponFactory.hasWeapon()) {
                    this.weapon = this.weaponFactory.nextWeapon();
                }
            }*/
        },

        start: function() {


            // /this.player_tween.pause();
            this.player_tween.stop();

            this.isStarted = true;
            this.player.body.gravity.y = 1000;

        },

        addElement: function() {

            var x, y, value;

            if (!this.isStarted) {
                return;
            }

            x = this.game.width; 
            y = Math.round(Math.random() * (this.game.height - 94));

            value = Utils.randomIntFromInterval(0, 10);

            if (value <= 5) {
                this.addEnemy(x, y);
            } else {
                this.powerUps.spawnNew(x, y);
            }

        },

        addEnemy: function (x, y) {

            var enemy = this.enemies.getFirstDead();

            this.game.physics.enable(enemy, Phaser.Physics.ARCADE);

            enemy.reset(x, y);
            enemy.body.velocity.x = -700;
            enemy.checkWorldBounds = true;
            enemy.outOfBoundsKill = true;
        },

        killEnemy: function (bullet, enemy) {

            this.score += 1;
            this.update_score();

            bullet.kill();
            enemy.kill();
        },

        getPowerUp: function(player, powerUp) {

            this.weapon = this.weaponFactory.getWeapon(powerUp.type);
            powerUp.kill();

        },

        restart: function () {

            this.isStarted = false;

            this.game.time.events.remove(this.timer);

            this.player.kill();
            this.player_tween.stop();

            var self = this;

            // store the last score to access it in game over view.
            app_container.last_score = this.score;     
            
            // player current position
            app_container.player_posX = this.player.x; 
            app_container.player_posY = this.player.y;

            //reset score.
            this.score = 0;

            // call game over view
            this.game.state.start('Gameover');
        },

        handleKeyDown: function() {
            if (this.game.input.keyboard.isDown (Phaser.Keyboard.SPACEBAR)) {
                
                if (!this.isStarted) {
                    this.start();
                } else {
                    this.player.body.velocity.y = -400;
                }
            }

            if (this.game.input.keyboard.isDown (Phaser.Keyboard.ENTER)) {
                if(this.isStarted) {
                    this.weapon.fire();
                }
            } 
        },
    };

    app_container.Gameplay = Gameplay;

}(window.app_container = window.app_container || {}));