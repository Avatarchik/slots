function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    
    var _oData;
    var _oPreloader;
    var _oMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        var canvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(canvas);  
        
        s_oAttachSection = new createjs.Container();
        s_oStage.addChild(s_oAttachSection);
        
        createjs.Touch.enable(s_oStage);
        
        s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
        }
        
        
        s_iPrevTime = new Date().getTime();

        createjs.Ticker.setFPS(30);
	createjs.Ticker.addEventListener("tick", this._update);
	
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
		
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };

    this.soundLoaded = function(){
         _iCurResource++;

         if(_iCurResource === RESOURCE_TO_LOAD){
              this.onAllResourcesLoaded();
         }
    };
    
    this._initSounds = function(){
         if (!createjs.Sound.initializeDefaultPlugins()) {
             return;
         }
		
        if(navigator.userAgent.indexOf("Opera")>0 || navigator.userAgent.indexOf("OPR")>0){
                createjs.Sound.alternateExtensions = ["mp3"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/press_but.ogg", "press_but");
                createjs.Sound.registerSound("./sounds/win.ogg", "win");
                createjs.Sound.registerSound("./sounds/reels.ogg", "reels");
                createjs.Sound.registerSound("./sounds/reel_stop.ogg", "reel_stop",6);
                createjs.Sound.registerSound("./sounds/start_reel.ogg", "start_reel",6);
                
                createjs.Sound.registerSound("./sounds/game_over_bonus.ogg", "game_over_bonus");
                createjs.Sound.registerSound("./sounds/reel_bonus.ogg", "reel_bonus");
                createjs.Sound.registerSound("./sounds/start_reel_bonus.ogg", "start_reel_bonus");
                createjs.Sound.registerSound("./sounds/win_bonus.ogg", "win_bonus");
        }else{
                createjs.Sound.alternateExtensions = ["ogg"];
                createjs.Sound.addEventListener("fileload", createjs.proxy(this.soundLoaded, this));

                createjs.Sound.registerSound("./sounds/press_but.mp3", "press_but");
                createjs.Sound.registerSound("./sounds/win.mp3", "win");
                createjs.Sound.registerSound("./sounds/reels.mp3", "reels");
                createjs.Sound.registerSound("./sounds/reel_stop.mp3", "reel_stop",6);
                createjs.Sound.registerSound("./sounds/start_reel.mp3", "start_reel",6);
                
                createjs.Sound.registerSound("./sounds/game_over_bonus.mp3", "game_over_bonus");
                createjs.Sound.registerSound("./sounds/reel_bonus.mp3", "reel_bonus");
                createjs.Sound.registerSound("./sounds/start_reel_bonus.mp3", "start_reel_bonus");
                createjs.Sound.registerSound("./sounds/win_bonus.mp3", "win_bonus");
        }
        RESOURCE_TO_LOAD += 9;
        
    };
    
    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );

        s_oSpriteLibrary.addSprite("but_bg","./sprites/but_play_bg.png");
        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("bg_menu","./sprites/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("bg_game","./sprites/bg_game.jpg");
        s_oSpriteLibrary.addSprite("paytable1","./sprites/paytable1.jpg");
        s_oSpriteLibrary.addSprite("paytable2","./sprites/paytable2.jpg");
        s_oSpriteLibrary.addSprite("paytable3","./sprites/paytable3.jpg");
        s_oSpriteLibrary.addSprite("mask_slot","./sprites/mask_slot.png");
        s_oSpriteLibrary.addSprite("spin_but","./sprites/but_spin_bg.png");
        s_oSpriteLibrary.addSprite("but_autospin","./sprites/but_autospin.png");
        s_oSpriteLibrary.addSprite("spin_bg","./sprites/spin_bg.png");
        s_oSpriteLibrary.addSprite("coin_but","./sprites/but_coin_bg.png");
        s_oSpriteLibrary.addSprite("info_but","./sprites/but_info_bg.png");
        s_oSpriteLibrary.addSprite("bet_but","./sprites/bet_but.png");
        s_oSpriteLibrary.addSprite("win_frame_anim","./sprites/win_frame_anim.png");
        s_oSpriteLibrary.addSprite("but_lines_bg","./sprites/but_lines_bg.png");
        s_oSpriteLibrary.addSprite("but_maxbet_bg","./sprites/but_maxbet_bg.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_icon.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("but_arrow_next","./sprites/but_arrow_next.png");
        s_oSpriteLibrary.addSprite("but_arrow_prev","./sprites/but_arrow_prev.png");
        s_oSpriteLibrary.addSprite("freespin_panel","./sprites/freespin_panel.png");
        s_oSpriteLibrary.addSprite("logo","./sprites/logo.png");
        s_oSpriteLibrary.addSprite("logo_freespin","./sprites/logo_freespin.png");
        
        for(var i=1;i<NUM_SYMBOLS+1;i++){
            s_oSpriteLibrary.addSprite("symbol_"+i,"./sprites/symbol_"+i+".png");
            s_oSpriteLibrary.addSprite("symbol_"+i+"_anim","./sprites/symbol_"+i+"_anim.png");
        }
        
        for(var j=1;j<NUM_PAYLINES+1;j++){
            s_oSpriteLibrary.addSprite("payline_"+j,"./sprites/payline_"+j+".png");
        }
        
        //LOAD BONUS SPRITES
        s_oSpriteLibrary.addSprite("bg_bonus","./sprites/bonus/bg_bonus.png");
        s_oSpriteLibrary.addSprite("but_spin_bonus","./sprites/bonus/but_spin_bonus.png");
        s_oSpriteLibrary.addSprite("leds","./sprites/bonus/leds.png");
        s_oSpriteLibrary.addSprite("wheel","./sprites/bonus/wheel.png");
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();

        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;

        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);

        if(_iCurResource === RESOURCE_TO_LOAD){
            this.onAllResourcesLoaded();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this.onAllResourcesLoaded = function(){
        s_oGameSettings = new CSlotSettings();
        s_oMsgBox = new CMsgBox();
        _oPreloader.unload();

        
        WIN_OCCURRENCE = _oData.win_occurrence;
        MIN_REEL_LOOPS = _oData.min_reel_loop;
        REEL_DELAY = _oData.reel_delay;
        TIME_SHOW_WIN = _oData.time_show_win;
        TIME_SHOW_ALL_WINS = _oData.time_show_all_wins;
        SLOT_CASH = _oData.slot_cash;
        TOTAL_MONEY = parseFloat(_oData.money);
        FREESPIN_OCCURRENCE = _oData.freespin_occurrence;
        BONUS_OCCURRENCE = _oData.bonus_occurrence;
        FREESPIN_SYMBOL_NUM_OCCURR = _oData.freespin_symbol_num_occur;
        NUM_FREESPIN = _oData.num_freespin;
        BONUS_PRIZE = _oData.bonus_prize;
        BONUS_PRIZE_OCCURR = _oData.bonus_prize_occur;
        COIN_BET = _oData.coin_bet;
        NUM_SPIN_FOR_ADS = oData.num_spin_ads_showing;
        
        this.gotoMenu();
    };
    
    this.gotoMenu = function(){
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(){
        _oGame = new CGame(_oData);   
							
        _iState = STATE_GAME;
    };
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
    
    this.stopUpdate = function () {
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display", "block");
    };

    this.startUpdate = function () {
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display", "none");
    };
    
    this._update = function(event){
        if(_bUpdate === false){
                return;
        }
                
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    _oData = oData;

    this.initContainer();
}

var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;

var s_oDrawLayer;
var s_oStage;
var s_oAttachSection;
var s_oMain;
var s_oSpriteLibrary;
var s_bLogged = false;
var s_oMsgBox;
var s_oGameSettings;