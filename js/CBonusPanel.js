function CBonusPanel(){
    var _bInitGame;
    var _iCurAnim;
    var _iTimeIdle;
    var _iTimeWin;
    var _iGameState;
    var _iPrizeToShow;
    var _iCurAlpha;
    var _oWheel;
    var _oLeds;
    var _oSpinBut;
    var _oTextHighLight;
    var _oContainer;
    
    this._init = function(){
        _iTimeIdle = 0;
        _iTimeWin = 0;
        _iCurAlpha = 0;
        _bInitGame = false;
        _iGameState = STATE_BONUS_IDLE;
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oAttachSection.addChild(_oContainer);
        
        var pCenterWheel = {x: 890, y: 320};
        _oWheel = new CWheelBonus(pCenterWheel.x, pCenterWheel.y,_oContainer);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_bonus'));
        _oContainer.addChild(oBg);
        
        _oLeds = new CLedsBonus(pCenterWheel.x, pCenterWheel.y,_oContainer);
        _iCurAnim = _oLeds.getState();
        
        var oSprite = s_oSpriteLibrary.getSprite('but_spin_bonus');
        _oSpinBut = new CTextButton(360 + (oSprite.width/2),490 ,oSprite,TEXT_SPIN,FONT_GAME,"#ffffff",40,_oContainer);  
        _oSpinBut.addEventListener(ON_MOUSE_UP, this._onSpin, this);
        
        var oTextHelpStroke = new createjs.Text(TEXT_BONUS_HELP,"bold 56px "+FONT_GAME, "#000");
        oTextHelpStroke.x = 490;
        oTextHelpStroke.y = 132;
        oTextHelpStroke.textAlign = "center";
        oTextHelpStroke.textBaseline = "alphabetic";
        oTextHelpStroke.lineWidth = 300;
        _oContainer.addChild(oTextHelpStroke);
        
        var oTextHelp = new createjs.Text(TEXT_BONUS_HELP,"bold 56px "+FONT_GAME, "white");
        oTextHelp.x = 488;
        oTextHelp.y = 130;
        oTextHelp.textAlign = "center";
        oTextHelp.textBaseline = "alphabetic";
        oTextHelp.lineWidth = 300;
        _oContainer.addChild(oTextHelp);
        
        _oTextHighLight = new createjs.Text(TEXT_CURRENCY +"0","bold 56px "+FONT_GAME, "yellow");
        _oTextHighLight.x = 464;
        _oTextHighLight.y = 340;
        _oTextHighLight.textAlign = "center";
        _oTextHighLight.textBaseline = "alphabetic";
        _oTextHighLight.lineWidth = 400;
        _oTextHighLight.alpha = _iCurAlpha;
        _oContainer.addChild(_oTextHighLight);
    };
    
    this.show = function(iPrize){
        _oSpinBut.enable();
        _oTextHighLight.text = "";
        _oTextHighLight.alpha = 1;
        _iPrizeToShow = iPrize;
        _oContainer.visible = true;
        _bInitGame = true;
    };
    
    this._onSpin = function(){
        _oSpinBut.disable();
        _iGameState = STATE_BONUS_SPIN;
        _iTimeWin = 0;
                
        //CALCULATE ROTATION
        var iNumSpinFake = MIN_FAKE_SPIN + Math.floor(Math.random()*3);
        var iOffsetInterval = SEGMENT_ROT - 3;
        var iOffsetSpin = -iOffsetInterval/2 + Math.random()*iOffsetInterval;
        var _iCurWheelDegree = _oWheel.getDegree();
        
        var iTrueRotation = (360 - _iCurWheelDegree + _iPrizeToShow * SEGMENT_ROT + iOffsetSpin)%360; //Define how much rotation, to reach the selected prize.       
        
        var iRotValue = 360*iNumSpinFake + iTrueRotation;
        var iTimeMult = iNumSpinFake;

        //SPIN
        _oWheel.spin(iRotValue, iTimeMult);
    };
    
    this._animLedIdle = function(){
        _iTimeIdle += s_iTimeElaps;
        
        if(_iTimeIdle > TIME_ANIM_IDLE){
            _iTimeIdle=0;
            var iRandAnim = Math.floor(Math.random()*_oLeds.getNumAnim());
    
            while(iRandAnim === _iCurAnim){
                iRandAnim = Math.floor(Math.random()*_oLeds.getNumAnim());
            }    
            _oLeds.changeAnim(iRandAnim);

            _iCurAnim = iRandAnim;
        }
    };    
    
    this._animLedSpin = function(){
        _oLeds.changeAnim(LED_SPIN);
        _iGameState =-1;
    };
    
    this._animLedWin = function(){
        if(_iTimeWin === 0){
            var iRandomWinAnim = 4 + Math.round(Math.random())
            _oLeds.changeAnim(iRandomWinAnim);
            _oLeds.setWinColor(this.getCurColor());            
        } else if(_iTimeWin > TIME_ANIM_WIN) {
            _iTimeIdle = TIME_ANIM_IDLE; 
            _iGameState = STATE_BONUS_IDLE;
            s_oBonusPanel.unload()
            _iTimeWin =0;
        }
        _iTimeWin += s_iTimeElaps;
        
    };
    
    this._animLedLose = function(){
       
        if(_iTimeWin === 0){            
            _oLeds.changeAnim(6);
            _oLeds.setWinColor(this.getCurColor());            
        } else if(_iTimeWin > TIME_ANIM_LOSE) {
            _iTimeIdle = TIME_ANIM_IDLE; 
            _iGameState = STATE_BONUS_IDLE;
            s_oBonusPanel.unload()
            _iTimeWin =0;
        }
        _iTimeWin += s_iTimeElaps;
        
    };
    
    this.getCurColor = function(){
        return _oWheel.getColor();
    };
    
    this.wheelArrived = function(){	
        _oTextHighLight.text = TEXT_CURRENCY + WHEEL_SETTINGS[_iPrizeToShow];
        
	this._animWinText();
        
        if(WHEEL_SETTINGS[_iPrizeToShow].prize <= 0){
            _iGameState = STATE_BONUS_LOSE;

            playSound("game_over_bonus",1,0);
        } else {
            _iGameState = STATE_BONUS_WIN;

            playSound("win_bonus",1,0);
        }
    };
    
    this._animWinText = function(){
        if(_iCurAlpha === 1){
            _iCurAlpha = 0;
            createjs.Tween.get(_oTextHighLight).to({alpha:_iCurAlpha }, 150,createjs.Ease.cubicOut).call(function(){s_oBonusPanel._animWinText();});
        }else{
            _iCurAlpha = 1;
            createjs.Tween.get(_oTextHighLight).to({alpha:_iCurAlpha }, 150,createjs.Ease.cubicOut).call(function(){s_oBonusPanel._animWinText();});
        }
    };
    
    this.unload = function(){
        _bInitGame = false;
        _oContainer.visible = false;
        createjs.Tween.removeTweens(_oTextHighLight);
        
        s_oGame.exitFromBonus();
    };
    
    this.update = function(){
	if(_bInitGame){
            _oLeds.update();
            switch(_iGameState) {
                case STATE_BONUS_IDLE:{
                        this._animLedIdle();
                        break;
                } case STATE_BONUS_SPIN: {
                        this._animLedSpin();
                        break;              

                } case STATE_BONUS_WIN: {
                        this._animLedWin();
                        break;                             
                } case STATE_BONUS_LOSE: {
                        this._animLedLose();
                        break;                             
                }    

            }
        }
        
    };
    
    s_oBonusPanel = this;
    
    this._init();
}

var s_oBonusPanel = null;