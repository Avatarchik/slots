function CInterface(iCurBet,iTotBet,iMoney){
    var _oButExit;
    var _oSpinBut;
    var _oAutoSpinBut;
    var _oInfoBut;
    var _oAddLineBut;
    var _oAddLineButMinus;
    var _oAudioToggle;
    var _oBetCoinBut;
    var _oBetCoinButMinus;
    var _oMaxBetBut;
    var _pStartPosAudio;
    var _pStartPosExit;

    var _oCoinText;
    var _oMoneyText;
    var _oTotalBetText;
    var _oNumLinesText;
    var _oWinText;
    var _oFreeSpinNumText;
    
    this._init = function(iCurBet,iTotBet,iMoney){
        
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x:CANVAS_WIDTH - (oSprite.width/2) - 16,y:(oSprite.height/2) + 16};
        _oButExit = new CGfxButton(_pStartPosExit.x,_pStartPosExit.y,oSprite,s_oAttachSection);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon')
            _pStartPosAudio = {x:_pStartPosExit.x - (oSprite.width/2) - 2,y:(oSprite.height/2) + 2};
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
        }

        oSprite = s_oSpriteLibrary.getSprite('plus_bg');
        _oAddLineBut = new CTextButton(960 + (oSprite.width/2),310 ,oSprite,TEXT,FONT_GAME,"#ffffff",22);  
        _oAddLineBut.addEventListener(ON_MOUSE_UP, this._onAddLine, this);

        oSprite = s_oSpriteLibrary.getSprite('minus_bg');
        _oAddLineButMinus = new CTextButton(100 + (oSprite.width/2),310 ,oSprite,TEXT,FONT_GAME,"#ffffff",22);  
        _oAddLineButMinus.addEventListener(ON_MOUSE_UP, this._onAddLineMinus, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_autospin');
        _oAutoSpinBut = new CTextButton(790 + (oSprite.width/2),595 ,oSprite,TEXT_AUTOSPIN,FONT_GAME,"#ffffff",22);  
        _oAutoSpinBut.addEventListener(ON_MOUSE_UP, this._onAutoSpin, this);

        oSprite = s_oSpriteLibrary.getSprite('spin_but');
        _oSpinBut = new CTextButton(875 + (oSprite.width/2),600 ,oSprite,TEXT,FONT_GAME,"#ffffff",26);  
        _oSpinBut.addEventListener(ON_MOUSE_UP, this._onSpin, this);

        oSprite = s_oSpriteLibrary.getSprite('info_but');
        _oInfoBut = new CTextButton(105 + (oSprite.width/2),610,oSprite,TEXT,FONT_GAME,"#ffffff",30);        
        _oInfoBut.addEventListener(ON_MOUSE_UP, this._onInfo, this);

        oSprite = s_oSpriteLibrary.getSprite('plus_bg');
        _oBetCoinBut = new CTextButton(385 + (oSprite.width/2),610 ,oSprite,TEXT,FONT_GAME,"#ffffff",22);  
        _oBetCoinBut.addEventListener(ON_MOUSE_UP, this._onBet, this);

        oSprite = s_oSpriteLibrary.getSprite('minus_bg');
        _oBetCoinButMinus = new CTextButton(240 + (oSprite.width/2),610 ,oSprite,TEXT,FONT_GAME,"#ffffff",22);  
        _oBetCoinButMinus.addEventListener(ON_MOUSE_UP, this._onBetMinus, this);
        
        oSprite = s_oSpriteLibrary.getSprite('but_maxbet_bg');
        _oMaxBetBut = new CTextButton(655 + (oSprite.width/2),610,oSprite,TEXT,FONT_GAME,"#ffffff",30);
        _oMaxBetBut.addEventListener(ON_MOUSE_UP, this._onMaxBet, this);

	    _oMoneyText = new createjs.Text("   MONEY " +"   "+iMoney.toFixed(2),"bold 24px "+FONT_GAME, "#ffde00");
        _oMoneyText.x = 309;
        _oMoneyText.y = 20;
        _oMoneyText.textAlign = "center";
        s_oAttachSection.addChild(_oMoneyText);
        
        _oNumLinesText = new createjs.Text("/"+NUM_PAYLINES ,"bold 30px "+FONT_GAME, "#ffffff");
        _oNumLinesText.x =  630;
        _oNumLinesText.y = CANVAS_HEIGHT - 25;
        _oNumLinesText.textAlign = "center";
        _oNumLinesText.textBaseline = "alphabetic";
        _oNumLinesText.shadow = new createjs.Shadow("#000000", 1, 1, 2);
        s_oAttachSection.addChild(_oNumLinesText);
        
        _oCoinText = new createjs.Text(iCurBet.toFixed(2) ,"bold 30px "+FONT_GAME, "#ffffff");
        _oCoinText.x =  355;
        _oCoinText.y = CANVAS_HEIGHT - 25;
        _oCoinText.textAlign = "center";
        _oCoinText.textBaseline = "alphabetic";
        _oCoinText.shadow = new createjs.Shadow("#000000", 1, 1, 2);
        s_oAttachSection.addChild(_oCoinText);

        _oTotalBetText = new createjs.Text("BET" +": "+iTotBet.toFixed(2),"bold 30px "+FONT_GAME, "#ffffff");
        _oTotalBetText.x = 540;
        _oTotalBetText.y = CANVAS_HEIGHT - 25;
        _oTotalBetText.textAlign = "center";
        _oTotalBetText.textBaseline = "alphabetic";
        _oTotalBetText.shadow = new createjs.Shadow("#000000", 1, 1, 2);
        s_oAttachSection.addChild(_oTotalBetText);
        
        _oWinText = new createjs.Text("","bold 24px "+FONT_GAME, "#ffde00");
        _oWinText.x = 845;
        _oWinText.y = CANVAS_HEIGHT - 94;
        _oWinText.textAlign = "center";
        _oWinText.textBaseline = "alphabetic";
        _oWinText.shadow = new createjs.Shadow("#000000", 1, 1, 2);
        s_oAttachSection.addChild(_oWinText);
        
        _oFreeSpinNumText = new createjs.Text("","bold 54px "+FONT_GAME, "#ffde00");
        _oFreeSpinNumText.x = 737;
        _oFreeSpinNumText.y = 59;
        _oFreeSpinNumText.textAlign = "center";
        _oFreeSpinNumText.textBaseline = "alphabetic";
        s_oAttachSection.addChild(_oFreeSpinNumText);

        this.refreshButtonPos (s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        _oButExit.unload();
        _oButExit = null;
        _oSpinBut.unload();
        _oSpinBut = null;
        _oAutoSpinBut.unload();
        _oAutoSpinBut = null;
        _oInfoBut.unload();
        _oInfoBut = null;
        _oAddLineBut.unload();
        _oAddLineBut = null;
        _oAddLineButMinus.unload();
        _oAddLineButMinus = null;
        _oBetCoinBut.unload();
        _oBetCoinBut = null;
        _oBetCoinButMinus.unload();
        _oBetCoinButMinus = null;
        _oMaxBetBut.unload();
        _oMaxBetBut = null;
        
        if(DISABLE_SOUND_MOBILE === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        s_oInterface = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
    };

    this.refreshMoney = function(iMoney){
        _oMoneyText.text = "   MONEY " +"   "+iMoney.toFixed(2);
    };
    
    this.refreshBet = function(iBet){
        _oCoinText.text = iBet.toFixed(2);
    };
    
    this.refreshTotalBet = function(iTotBet){
        _oTotalBetText.text = "BET" +": "+iTotBet.toFixed(2);
    };
    
    this.refreshNumLines = function(iLines){
        _oNumLinesText.text = "/"+iLines;
    };
    
    this.resetWin = function(){
        _oWinText.text = " ";
    };
    
    this.refreshWinText = function(iWin){
        _oWinText.text = TEXT_WIN + " "+iWin.toFixed(2);
    };
    
    this.refreshFreeSpinNum = function(iNum){
        _oFreeSpinNumText.text = iNum;
    };
    
    this.showLine = function(iLine){
    };
    
    this.hideLine = function(iLine){
    };
    
    this.hideAllLines = function(){
    };
    
    this.disableBetBut = function(bDisable){
    };
    
    this.enableGuiButtons = function(){
        _oSpinBut.enable();
        _oAutoSpinBut.setText(TEXT_AUTOSPIN);
        _oAutoSpinBut.enable();
        _oMaxBetBut.enable();
        _oBetCoinBut.enable();
        _oAddLineBut.enable();
        _oBetCoinButMinus.enable();
        _oAddLineButMinus.enable();
        _oInfoBut.enable();
    };
	
    this.enableSpin = function(){
        _oSpinBut.enable();
        _oAutoSpinBut.setText(TEXT_AUTOSPIN);
        _oAutoSpinBut.enable();
        _oMaxBetBut.enable();
    };
    
    this.enableAutoSpin = function(){
        _oAutoSpinBut.enable();
    };

    this.disableSpin = function(bAutoSpin){
        _oSpinBut.disable();
        if(bAutoSpin){
            _oAutoSpinBut.setText(TEXT_STOP_AUTO);
        }else{
            _oAutoSpinBut.disable();
        }
        _oMaxBetBut.disable();
    };
    
    this.disableAutoSpin = function(){
        _oAutoSpinBut.disable();
    };
    
    this.disableGuiButtons = function(bAutoSpin){
        _oSpinBut.disable();
        if(bAutoSpin){
            _oAutoSpinBut.setText(TEXT_STOP_AUTO);
        }else{
            _oAutoSpinBut.disable();
        }
        
        _oMaxBetBut.disable();
        _oBetCoinBut.disable();
        _oAddLineBut.disable();
        _oBetCoinButMinus.disable();
        _oAddLineButMinus.disable();
        _oInfoBut.disable();
    };
    
    this._onBetLineClicked = function(iLine){
        this.refreshNumLines(iLine);
        
        s_oGame.activateLines(iLine);
    };
    
    this._onExit = function(){
        s_oGame.onExit();  
    };
    
    this._onSpin = function(){
        s_oGame.onSpin();
    };
    
    this._onAutoSpin = function(){
        if(_oAutoSpinBut.getText() === TEXT_AUTOSPIN){
            s_oGame.onAutoSpin();
        }else{
            _oAutoSpinBut.disable();
            _oAutoSpinBut.setText(TEXT_AUTOSPIN);
            
            s_oGame.onStopAutoSpin();
        }
        
    };
    
    this._onAddLine = function(){
        s_oGame.addLine();
    };

    this._onAddLineMinus = function(){
        s_oGame.addLineMinus();
    };
    
    this._onInfo = function(){
        s_oGame.onInfoClicked();
    };
    
    this._onBet = function(){
        s_oGame.changeCoinBet();
    };

    this._onBetMinus = function(){
        s_oGame.changeCoinBetMinus();
    };
    
    this._onMaxBet = function(){
        s_oGame.onMaxBet();
    };
    
    this._onAudioToggle = function(){
        createjs.Sound.setMute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    s_oInterface = this;
    
    this._init(iCurBet,iTotBet,iMoney);
    
    return this;
}

var s_oInterface = null;