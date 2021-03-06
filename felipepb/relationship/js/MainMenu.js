BasicGame.MainMenu = function (game) {
    this.player;
    this.beloved;
    this.playerTextField;
    this.belovedTextField;
    this.currentBitmapText;
    this.playButton;
    this.textFieldCursor;
    
    this.playerTextFieldBoundingBox;
    this.belovedTextFieldBoundingBox;

    this.confirmSFX;
    this.negateSFX;
};

BasicGame.MainMenu.backspaceKey = 8;
BasicGame.MainMenu.tabKey = 9;
BasicGame.MainMenu.enterKey = 13;
BasicGame.MainMenu.letterAKey = 65;
BasicGame.MainMenu.letterZKey = 90;
BasicGame.MainMenu.maximumPlayerNameLength = 14;
BasicGame.MainMenu.playerName = '';
BasicGame.MainMenu.belovedName = '';
BasicGame.MainMenu.fontSize = 30;

BasicGame.MainMenu.textFieldPlaceHolderActive = 'textBoxPlaceholderActive_349-52.png';
BasicGame.MainMenu.textFieldPlaceHolderNone = 'textBoxPlaceholderNone_349-52.png';
BasicGame.MainMenu.textFieldActive = 'textBoxTextActive_349-52.png';
BasicGame.MainMenu.textFieldNone = 'textBoxTextNone_349-52.png';
BasicGame.MainMenu.playerNameKey = 'relationship-player';
BasicGame.MainMenu.belovedNameKey = 'relationship-beloved';

BasicGame.MainMenu.createCookie = function(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        var expires = '; expires=' + date.toGMTString();
    } else {
        var expires = '';
    }
    document.cookie = name + '=' + value + expires + '; path=/';
};
    
BasicGame.MainMenu.readCookie = function(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
};
    
BasicGame.MainMenu.eraseCookie = function(name) {
    BasicGame.MainMenu.createCookie(name, '', -1);
};

BasicGame.MainMenu.prototype = {

    create: function () {
        var self = this;
        var cameraWidth = this.game.camera.width;
        var cameraHeight = this.game.camera.height;
        var fontSize = BasicGame.MainMenu.fontSize;
        this.add.sprite(0, 0, 'mainMenu');
        
        
        this.playerTextField = this.add.sprite(57, cameraHeight - 220, 'textField');
        this.playerTextField.frameName = BasicGame.MainMenu.textFieldPlaceHolderNone;
        
        this.player = this.game.add.bitmapText(54, cameraHeight - 208, 'silkscreenred', '', fontSize);
        
        this.belovedTextField = this.add.sprite(57, cameraHeight - 99, 'textField');
        this.belovedTextField.frameName = BasicGame.MainMenu.textFieldPlaceHolderNone;
        
        this.beloved = this.game.add.bitmapText(54, cameraHeight - 87, 'silkscreenred', '', fontSize);

        this.currentBitmapText = null;
		
		var playerText = BasicGame.MainMenu.readCookie(BasicGame.MainMenu.playerNameKey);
        var belovedText = BasicGame.MainMenu.readCookie(BasicGame.MainMenu.belovedNameKey);
		
        this.player.text = playerText ? ' ' + playerText : new String('');
        this.beloved.text = belovedText ? ' ' + belovedText : new String('');

        var keyboard = this.game.input.keyboard;
        keyboard.onDownCallback = function (args) {
            self.handleTextFieldsInput(args);
        };

        this.playButton = this.game.add.button(cameraWidth - 417, cameraHeight - 210,
                                               'playButton',
                                               this.onPlayButtonClicked,
                                               this,
                                               'buttonPlayHover_314-66.png',
                                               'buttonPlayNone_314-66.png',
                                               'buttonPlayActive_314-66.png');
                                               
        this.textFieldCursor = this.game.add.bitmapText(55, cameraHeight - 212, 'silkscreenred', '|', fontSize);
        this.textFieldCursor.visible = false;
        var textFieldCursorTween = this.game.add.tween(this.textFieldCursor);
        textFieldCursorTween.to({ alpha: 0 }, 600, Phaser.Easing.Linear.None, true, 0, Number.MAX_VALUE, true);
        
        this.playerTextFieldBoundingBox = new Phaser.Rectangle(this.playerTextField.x, this.playerTextField.y,
                                                               this.playerTextField.width, this.playerTextField.height);

        this.belovedTextFieldBoundingBox = new Phaser.Rectangle(this.belovedTextField.x, this.belovedTextField.y,
                                                                this.belovedTextField.width, this.belovedTextField.height);

        this.confirmSFX = this.game.add.sound('blip_01');
        this.negateSFX = this.game.add.sound('blip_02');
    },
    
    setCurrentTextField: function (bitmapText) {
        if (this.currentBitmapText == bitmapText)
            return;
            
        var player = this.player;
        var beloved = this.beloved;

        this.currentBitmapText = bitmapText;

        if (this.currentBitmapText == player) {
            // console.log('player');
            this.textFieldCursor.visible = true;
        } else if (this.currentBitmapText == beloved) {
            // console.log('beloved');
            this.textFieldCursor.visible = true;
        } else {
            // console.log('none');
            this.textFieldCursor.visible = false;
        }

        if (bitmapText !== null)
            this.confirmSFX.play();
        else
            this.negateSFX.play();
        
        //this.updateTextFieldProperties(this.playerTextField, player);
        //this.updateTextFieldProperties(this.belovedTextField, beloved);
    },
    
    updateTextFieldProperties: function (textField, bitmapText) {
        var currentBitmapText = this.currentBitmapText;
        var text = bitmapText.text ? bitmapText.text.trim() : null;
        
        if (bitmapText == currentBitmapText) {
            textField.frameName = text ? BasicGame.MainMenu.textFieldActive : BasicGame.MainMenu.textFieldPlaceHolderActive;
        } else {
            textField.frameName = text ? BasicGame.MainMenu.textFieldNone : BasicGame.MainMenu.textFieldPlaceHolderNone;
        }
    },
    
    update: function () {
        if (this.currentBitmapText) {
            var textFieldCursor = this.textFieldCursor;
            textFieldCursor.x = this.currentBitmapText.x + this.currentBitmapText.textWidth;
            textFieldCursor.y = this.currentBitmapText.y;
        }
        
        var pointer = this.game.input.activePointer;
        var playerTextFieldBoundingBox = this.playerTextFieldBoundingBox;
        var belovedTextFieldBoundingBox = this.belovedTextFieldBoundingBox;

        if (pointer.isDown) {
            if (playerTextFieldBoundingBox.contains(pointer.x, pointer.y)) {
                this.setCurrentTextField(this.player);
            } else if (belovedTextFieldBoundingBox.contains(pointer.x, pointer.y)) {
                this.setCurrentTextField(this.beloved);
            } else {
                this.setCurrentTextField(null);
            }
        }
        
        this.updateTextFieldProperties(this.playerTextField, this.player);
        this.updateTextFieldProperties(this.belovedTextField, this.beloved);
    },
    
    handleTextFieldsInput: function (args) {
        
        var player = this.player;
        var beloved = this.beloved;
        var keyCode = args.keyCode;
        var letter = String.fromCharCode(keyCode);
        var maximumNameLength = BasicGame.MainMenu.maximumPlayerNameLength;
        //console.log('key: ' + keyCode);
        
        if (keyCode == BasicGame.MainMenu.enterKey) {
        	this.onPlayButtonClicked(this.playButton);
        }
        
        if (keyCode == BasicGame.MainMenu.tabKey) {
            if (!this.currentBitmapText)
                this.setCurrentTextField(player);
            else
                this.setCurrentTextField(this.currentBitmapText == player ? beloved : player);
        }
        
        if (this.currentBitmapText) {
            if (keyCode == BasicGame.MainMenu.backspaceKey) {
                this.negateSFX.play();
                this.currentBitmapText.text = this.currentBitmapText.text.substr(0, this.currentBitmapText.text.length - 1);
            } else if (keyCode >= BasicGame.MainMenu.letterAKey && keyCode <= BasicGame.MainMenu.letterZKey) {
                this.currentBitmapText.text += letter.toLowerCase();
                this.confirmSFX.play();
            }
            this.currentBitmapText.text = this.currentBitmapText.text.substr(0, maximumNameLength);
        }
        
        args.preventDefault();  
    },
    
    onPlayButtonClicked: function (button) {
        var playerName = this.player.text ? this.player.text.trim() : null;
        var belovedName = this.beloved.text ? this.beloved.text.trim() : null;


        if (!playerName || playerName.length == 0) {
            alert('Enter your name');
            this.currentBitmapText = this.player;
            this.negateSFX.play();
        } else if (!belovedName || belovedName.length == 0) {
            alert('Enter your beloved name');
            this.currentBitmapText = this.beloved;
            this.negateSFX.play();
        } else {
            this.confirmSFX.play();

            BasicGame.MainMenu.playerName = playerName;
            BasicGame.MainMenu.belovedName = belovedName;
			
			BasicGame.MainMenu.eraseCookie(BasicGame.MainMenu.playerNameKey);
			BasicGame.MainMenu.createCookie(BasicGame.MainMenu.playerNameKey, playerName, 60);
			
			BasicGame.MainMenu.eraseCookie(BasicGame.MainMenu.belovedNameKey);
            BasicGame.MainMenu.createCookie(BasicGame.MainMenu.belovedNameKey, belovedName, 60);
			
            this.state.start('GameManager');
        }
    }
};