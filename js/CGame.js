function CGame(oData){
    var _bUpdate = false;
    var _bReadyToStop = false;
    var _bAutoSpin;
    var _iCurState;
    var _iCurReelLoops;
    var _iNextColToStop;
    var _iNumReelsStopped;
    var _iLastLineActive;
    var _iTimeElaps;
    var _iCurWinShown;
    var _iCurBet;
    var _iTotBet;
    var _iMoney;
    var _iTotWin;
    var _iTotFreeSpin;
    var _iBonus;
    var _iCurBonusPrizeIndex;
    var _iCurCoinIndex;
    var _iNumSpinCont;
    var _aMovingColumns;
    var _aStaticSymbols;
    var _aWinningLine;
    var _aReelSequence;
    var _aFinalSymbolCombo;
    var _oReelSound;
    var _oCurSymbolWinSound;
    var _oBg;
    var _oLogo;
    var _oLogoFreeSpin;
    var _oFreeSpinPanel;
    var _oFrontSkin;
    var _oInterface;
    var _oPayTable = null;
    var _oBonusPanel;
    
    this._init = function(){
        _iCurState = GAME_STATE_IDLE;
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iCurCoinIndex = 0;
        _aReelSequence = new Array(0,1,2,3,4);
        _iNextColToStop = _aReelSequence[0];
        _iLastLineActive = NUM_PAYLINES;
        _iMoney = TOTAL_MONEY;
        _iCurBet = MIN_BET;
        _iTotBet = _iCurBet * _iLastLineActive;
        _bAutoSpin = false;
        _iTotFreeSpin = 0;
        _iBonus = 0;
        _iNumSpinCont = 0;
        
        s_oTweenController = new CTweenController();
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game'));
        s_oAttachSection.addChild(_oBg);

        this._initReels();

        _oFrontSkin = new createjs.Bitmap(s_oSpriteLibrary.getSprite('mask_slot'));
        s_oAttachSection.addChild(_oFrontSkin);
        
        _oLogo = new createjs.Bitmap(s_oSpriteLibrary.getSprite('logo'));
        _oLogo.x = 590;
        _oLogo.y = 0;
        s_oAttachSection.addChild(_oLogo);
        
        _oLogoFreeSpin = new createjs.Bitmap(s_oSpriteLibrary.getSprite('logo_freespin'));
        _oLogoFreeSpin.x = 590;
        _oLogoFreeSpin.y = 0;
        _oLogoFreeSpin.visible = false;
        s_oAttachSection.addChild(_oLogoFreeSpin);

        _oFreeSpinPanel = new createjs.Bitmap(s_oSpriteLibrary.getSprite('freespin_panel'));
        _oFreeSpinPanel.x = 940;
        _oFreeSpinPanel.y = 3;
        _oFreeSpinPanel.visible = false;
        s_oAttachSection.addChild(_oFreeSpinPanel);

        _oInterface = new CInterface(_iCurBet,_iTotBet,_iMoney);
        this._initStaticSymbols();
        _oPayTable = new CPayTablePanel();
		
        if(_iMoney < _iTotBet){
                _oInterface.disableSpin(_bAutoSpin);
        }
        
        //FIND MIN WIN
        MIN_WIN = s_aSymbolWin[0][s_aSymbolWin[0].length-1];
        for(var i=0;i<s_aSymbolWin.length;i++){
            var aTmp = s_aSymbolWin[i];
            for(var j=0;j<aTmp.length;j++){
                if(aTmp[j] !== 0 && aTmp[j] < MIN_WIN){
                    MIN_WIN = aTmp[j];
                }
            }
        }
        
        _oBonusPanel = new CBonusPanel();

        _bUpdate = true;
    };
    
    this.unload = function(){
        createjs.Sound.stop();
        
        
        _oInterface.unload();
        _oPayTable.unload();
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].unload();
        }
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].unload();
            }
        }
        
        s_oAttachSection.removeAllChildren();
    };
    
    this._initReels = function(){  
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        
        var iCurDelay = 0;
        _aMovingColumns = new Array();
        for(var i=0;i<NUM_REELS;i++){ 
            _aMovingColumns[i] = new CReelColumn(i,iXPos,iYPos,iCurDelay);
            _aMovingColumns[i+NUM_REELS] = new CReelColumn(i+NUM_REELS,iXPos,iYPos + (SYMBOL_SIZE*NUM_ROWS),iCurDelay );
            iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;
            iCurDelay += REEL_DELAY;
        }
        
    };
    
    this._initStaticSymbols = function(){
        var iXPos = REEL_OFFSET_X;
        var iYPos = REEL_OFFSET_Y;
        _aStaticSymbols = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aStaticSymbols[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                var oSymbol = new CStaticSymbolCell(i,j,iXPos,iYPos);
                _aStaticSymbols[i][j] = oSymbol;
                
                iXPos += SYMBOL_SIZE + SPACE_BETWEEN_SYMBOLS;
            }
            iXPos = REEL_OFFSET_X;
            iYPos += SYMBOL_SIZE;
        }
    };
    
    this.generateLosingPattern = function(){
         var aFirstCol = new Array();
         for(var i=0;i<NUM_ROWS;i++){
            var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
            var iRandSymbol = s_aRandSymbols[iRandIndex];
            aFirstCol[i] = iRandSymbol;  
        }
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                
                if(j === 0){
                    _aFinalSymbolCombo[i][j] = aFirstCol[i];
                }else{
                    do{
                        var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
                        var iRandSymbol = s_aRandSymbols[iRandIndex];
                    }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol);

                    _aFinalSymbolCombo[i][j] = iRandSymbol;
                }  
            }
        }
        
        _aWinningLine = new Array();
        _bReadyToStop = true;
    };
    
    this._generateRandSymbols = function() {
        var aRandSymbols = new Array();
        for (var i = 0; i < NUM_ROWS; i++) {
                var iRandIndex = Math.floor(Math.random()* s_aRandSymbols.length);
                aRandSymbols[i] = s_aRandSymbols[iRandIndex];
        }

        return aRandSymbols;
    };
    
    this.reelArrived = function(iReelIndex,iCol) {
        if(_iCurReelLoops>MIN_REEL_LOOPS ){
            if (_iNextColToStop === iCol) {
                if (_aMovingColumns[iReelIndex].isReadyToStop() === false) {
                    var iNewReelInd = iReelIndex;
                    if (iReelIndex < NUM_REELS) {
                            iNewReelInd += NUM_REELS;
                            
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iReelIndex],
                                                                        _aFinalSymbolCombo[1][iReelIndex],
                                                                        _aFinalSymbolCombo[2][iReelIndex]), true);
                            
                    }else {
                            iNewReelInd -= NUM_REELS;
                            _aMovingColumns[iNewReelInd].setReadyToStop();
                            
                            _aMovingColumns[iReelIndex].restart(new Array(_aFinalSymbolCombo[0][iNewReelInd],
                                                                          _aFinalSymbolCombo[1][iNewReelInd],
                                                                          _aFinalSymbolCombo[2][iNewReelInd]), true);
                            
                            
                    }
                    
                }
            }else {
                    _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(),false);
            }
            
        }else {
            
            _aMovingColumns[iReelIndex].restart(this._generateRandSymbols(), false);
            if(_bReadyToStop && iReelIndex === 0){
                _iCurReelLoops++;
            }
            
        }
    };
    
    this.stopNextReel = function() {
        _iNumReelsStopped++;

        if(_iNumReelsStopped%2 === 0){
            
            playSound("reel_stop",1,0);
            
            _iNextColToStop = _aReelSequence[_iNumReelsStopped/2];
            if (_iNumReelsStopped === (NUM_REELS*2) ) {
                    this._endReelAnimation();
            }
        }    
    };
    
    this._endReelAnimation = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oReelSound.stop();
        }

        _bReadyToStop = false;
        
        _iCurReelLoops = 0;
        _iNumReelsStopped = 0;
        _iNextColToStop = _aReelSequence[0];

        if(_iBonus > 0){
            _oInterface.disableSpin(_bAutoSpin);
            _oInterface.disableGuiButtons(false);
        }
        
        if( !(_oFreeSpinPanel.visible === false && _iTotFreeSpin === 0)){
            _oInterface.refreshFreeSpinNum(_iTotFreeSpin);
        }
            
        //INCREASE MONEY IF THERE ARE COMBOS
        if(_aWinningLine.length > 0){
            //HIGHLIGHT WIN COMBOS IN PAYTABLE
            for(var i=0;i<_aWinningLine.length;i++){
                
                if(_aWinningLine[i].line > 0){
                    _oInterface.showLine(_aWinningLine[i].line);
                }
                var aList = _aWinningLine[i].list;
                for(var k=0;k<aList.length;k++){
                    _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value);
                    _aMovingColumns[aList[k].col].setVisible(aList[k].row,false);
                    _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,false);
                }
            }
          

            if(_iTotFreeSpin > 0){
                _oLogo.visible = false;
                _oLogoFreeSpin.visible = true;
                _oFreeSpinPanel.visible = true;
            }else{
                _oLogo.visible = true;
                _oLogoFreeSpin.visible = false;
                _oFreeSpinPanel.visible = false;
                _oInterface.refreshFreeSpinNum("");
            }

            if(_iTotWin>0){
                _oInterface.refreshWinText(_iTotWin);
            }
			
            _iTimeElaps = 0;
            _iCurState = GAME_STATE_SHOW_ALL_WIN;
            
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oCurSymbolWinSound = playSound("win",0.3,0);
            }
            
            _oInterface.refreshMoney(_iMoney);
        }else{
            if(_iTotFreeSpin > 0){
                _oLogo.visible = false;
                _oLogoFreeSpin.visible = true;
                _oFreeSpinPanel.visible = true;
                
                _oInterface.disableSpin(_bAutoSpin);
                this.onSpin();
            }else{
                _oLogo.visible = true;
                _oLogoFreeSpin.visible = false;
                _oFreeSpinPanel.visible = false;
                _oInterface.refreshFreeSpinNum("");
                
                if(_bAutoSpin){
                    if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
                        this.resetCoinBet();
                        _bAutoSpin = false;
                        _oInterface.enableGuiButtons();
                    }else{
                        _oInterface.enableAutoSpin();
                        this.onSpin();
                    }
                }else{
                    _iCurState = GAME_STATE_IDLE;
                }
            }
            
        }

        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
            this.resetCoinBet();
            _bAutoSpin = false;
            _oInterface.enableGuiButtons();
            //s_oMsgBox.show(TEXT_NOT_ENOUGH_MONEY);
        }else{
            if(!_bAutoSpin && _iTotFreeSpin === 0 && _iBonus === 0){
                _oInterface.enableGuiButtons();
                _oInterface.disableBetBut(false);
            }
        }
        
        _iNumSpinCont++;
        if(_iNumSpinCont === NUM_SPIN_FOR_ADS){
            _iNumSpinCont = 0;
            
            $(s_oMain).trigger("show_interlevel_ad");
        }
        
        $(s_oMain).trigger("save_score",_iMoney);
    };

    this.hidePayTable = function(){
        _oPayTable.hide();
    };
    
    this._showWin = function(){
        var iLineIndex;
        if(_iCurWinShown>0){ 
            if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
                _oCurSymbolWinSound.stop();
            }
            
            iLineIndex = _aWinningLine[_iCurWinShown-1].line;
            if(iLineIndex > 0){
                _oInterface.hideLine(iLineIndex);
            }
            
            
            var aList = _aWinningLine[_iCurWinShown-1].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
                _aMovingColumns[aList[k].col].setVisible(aList[k].row,true);
                _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,true);
            }
        }
        
        if(_iCurWinShown === _aWinningLine.length){
            _iCurWinShown = 0;
            if(_iTotFreeSpin > 0){
                _oInterface.disableSpin(_bAutoSpin);
                this.onSpin();
                return;
            }else if(_iBonus === BONUS_WHEEL){
                _oBonusPanel.show(_iCurBonusPrizeIndex);
                _iCurState = GAME_STATE_BONUS;
            }else if(_bAutoSpin){
                _oInterface.enableAutoSpin();
                this.onSpin();
                return;
            }
        }
        
        iLineIndex = _aWinningLine[_iCurWinShown].line;
        if(iLineIndex > 0){
            _oInterface.showLine(iLineIndex);
        }
        

        var aList = _aWinningLine[_iCurWinShown].list;
        for(var k=0;k<aList.length;k++){
            _aStaticSymbols[aList[k].row][aList[k].col].show(aList[k].value);
            _aMovingColumns[aList[k].col].setVisible(aList[k].row,false);
            _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,false);
        }
            

        _iCurWinShown++;
        
    };
    
    this._hideAllWins = function(){
        for(var i=0;i<_aWinningLine.length;i++){
            var aList = _aWinningLine[i].list;
            for(var k=0;k<aList.length;k++){
                _aStaticSymbols[aList[k].row][aList[k].col].stopAnim();
                _aMovingColumns[aList[k].col].setVisible(aList[k].row,true);
                _aMovingColumns[aList[k].col+NUM_REELS].setVisible(aList[k].row,true);
            }
        }
        
        _oInterface.hideAllLines();

        _iTimeElaps = 0;
        _iCurWinShown = 0;
        _iTimeElaps = TIME_SHOW_WIN;
        _iCurState = GAME_STATE_SHOW_WIN;
    };
	
    this.activateLines = function(iLine){
        _iLastLineActive = iLine;
        this.removeWinShowing();
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);


        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{
                _oInterface.enableSpin();
        }
    };
	
    this.addLine = function(){
        if(_iLastLineActive === NUM_PAYLINES){
            _iLastLineActive = 1;  
        }else{
            _iLastLineActive++;    
        }
		
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);

/*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
    };

    this.addLineMinus = function(){
        if(_iLastLineActive === 1){
            _iLastLineActive = NUM_PAYLINES;  
        }else{
            _iLastLineActive--;    
        }
        
        var iNewTotalBet = _iCurBet * _iLastLineActive;

        _iTotBet = iNewTotalBet;
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);

/*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
    };
    
    this.resetCoinBet = function(){
        _iCurCoinIndex = 0;
        
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);       
        
        /*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
    };
    
    this.changeCoinBet = function(){
        _iCurCoinIndex++;
        if(_iCurCoinIndex === COIN_BET.length){
            _iCurCoinIndex = 0;
        }
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);       
        
        /*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
		
    };

    this.changeCoinBetMinus = function(){
        _iCurCoinIndex--;
        if(_iCurCoinIndex < 0){
            _iCurCoinIndex = COIN_BET.length-1;
        }
        var iNewBet = parseFloat(COIN_BET[_iCurCoinIndex]);
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = iNewBet;
        _iCurBet = Math.floor(_iCurBet * 100)/100;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);       
        
        /*
        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{*/
                _oInterface.enableSpin();
        //}
        
    };
	
    this.onMaxBet = function(){
        if(_iMoney < (MAX_BET*NUM_PAYLINES)){
                s_oMsgBox.show(TEXT_NO_MAX_BET);
                return;
        }
        
        var iNewBet = MAX_BET;
	_iLastLineActive = NUM_PAYLINES;
        
        var iNewTotalBet = iNewBet * _iLastLineActive;

        _iCurBet = MAX_BET;
        _iTotBet = iNewTotalBet;
        _oInterface.refreshBet(_iCurBet);
        _oInterface.refreshTotalBet(_iTotBet);
        _oInterface.refreshNumLines(_iLastLineActive);

        if(iNewTotalBet>_iMoney){
                _oInterface.disableSpin(_bAutoSpin);
        }else{
                _oInterface.enableSpin();
                this.onSpin();
        }
    };
    
    this.removeWinShowing = function(){
        _oInterface.resetWin();
        
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                _aStaticSymbols[i][j].hide();
                _aMovingColumns[j].setVisible(i,true);
                _aMovingColumns[j+NUM_REELS].setVisible(i,true);
            }
        }
        
        for(var k=0;k<_aMovingColumns.length;k++){
            _aMovingColumns[k].activate();
        }
        
        _iCurState = GAME_STATE_IDLE;
    };
    
    this.onSpin = function(){
        if(_iMoney < _iTotBet && _iTotFreeSpin === 0){
            _oInterface.enableGuiButtons();
            _bAutoSpin = false;
            s_oMsgBox.show(TEXT_NOT_ENOUGH_MONEY);
            return;
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            if(_oCurSymbolWinSound){
                _oCurSymbolWinSound.stop();
            }
            _oReelSound = playSound("reels",1,0);
        }
        
        _oInterface.disableBetBut(true);
        this.removeWinShowing();
        
        if(s_bLogged === true){
            if(_oLogoFreeSpin.visible){
                _iTotBet = 0;
            }else{
                _iTotBet = _iCurBet * _iLastLineActive;
            }
            tryCallSpin(_iCurBet,_iTotBet,_iLastLineActive);
        }else{
            this.generateLosingPattern();
        }

        _oInterface.hideAllLines();
        _oInterface.disableGuiButtons(_bAutoSpin);/*
        _iMoney -= _iTotBet;
        _oInterface.refreshMoney(_iMoney);
        
        _iCurState = GAME_STATE_SPINNING;*/
    };
    
    //AUTOSPIN BUTTON CLICKED
    this.onAutoSpin = function(){
        _bAutoSpin = true;
        this.onSpin();
    };
    
    this.onStopAutoSpin = function(){
        _bAutoSpin = false;
        
        if(_iCurState !== GAME_STATE_SPINNING && _iCurState !== GAME_STATE_BONUS){
            _oInterface.enableGuiButtons();
        }
    };
    
    this.generateLosingPattern = function(){
         var aFirstCol = new Array();
         for(var i=0;i<NUM_ROWS;i++){
            var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
            var iRandSymbol = s_aRandSymbols[iRandIndex];
            aFirstCol[i] = iRandSymbol;  
        }
        
        _aFinalSymbolCombo = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            _aFinalSymbolCombo[i] = new Array();
            for(var j=0;j<NUM_REELS;j++){
                
                if(j === 0){
                    _aFinalSymbolCombo[i][j] = aFirstCol[i];
                }else{
                    do{
                        var iRandIndex = Math.floor(Math.random()* (s_aRandSymbols.length-2));
                        var iRandSymbol = s_aRandSymbols[iRandIndex];
                    }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol);

                    _aFinalSymbolCombo[i][j] = iRandSymbol;
                }  
            }
        }
        
        _aWinningLine = new Array();
        _bReadyToStop = true;
    };
    
    this.onSpinReceived = function(oRetData){
        _iMoney -= _iTotBet;
        _oInterface.refreshMoney(_iMoney);
        
        _iCurState = GAME_STATE_SPINNING;
        
        if ( oRetData.res === "true" ){
                _iTotFreeSpin = parseInt(oRetData.freespin);
                
                if(oRetData.win === "true"){
                    _aFinalSymbolCombo = JSON.parse(oRetData.pattern);
                    _aWinningLine = JSON.parse(oRetData.win_lines);
                    
                    if(parseInt(oRetData.freespin) > 0 ){
                        _iBonus = BONUS_FREESPIN;   
                        //_bAutoSpin = false;
                    }else if(parseInt(oRetData.bonus) > 0){
                        _iBonus = BONUS_WHEEL;
                        //_bAutoSpin = false;
                        _iCurBonusPrizeIndex = oRetData.bonus_prize;
                    }else{
                        _iBonus = 0;
                    }
                    
                    //GET TOTAL WIN FOR THIS SPIN
                    _iTotWin = parseFloat(oRetData.tot_win);

                    _bReadyToStop = true;
                }else{
                    _iBonus = 0;
                    
                    _aFinalSymbolCombo = JSON.parse(oRetData.pattern);

                    _aWinningLine = new Array();
                    _bReadyToStop = true;
                }

                _iMoney = parseFloat(oRetData.money);
                
        }else{
                s_oGame.generateLosingPattern();
        }
    };
    
    this.onInfoClicked = function(){
        if(_iCurState === GAME_STATE_SPINNING){
            return;
        }
        
        if(_oPayTable.isVisible()){
            _oPayTable.hide();
        }else{
            _oPayTable.show();
        }
    };
    
    this.onConnectionLost = function(){
        s_oMsgBox.show(TEXT_CONNECTION_LOST);
        _oInterface.enableGuiButtons();
    };
    
    this.exitFromBonus = function(){
        _iMoney = _iMoney + parseFloat(WHEEL_SETTINGS[_iCurBonusPrizeIndex]);
        _oInterface.refreshMoney(_iMoney);
        
        if(_bAutoSpin){
            _oInterface.enableAutoSpin();
            this.onSpin();
        }else{
            _oInterface.enableGuiButtons();
            _oInterface.disableBetBut(false);
            _oInterface.enableSpin();
        }
        
        $(s_oMain).trigger("save_score",_iMoney);
    };

    this.onExit = function(){
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        $(s_oMain).trigger("share_event", {
                img: "200x200.jpg",
                title: TEXT_CONGRATULATIONS,
                msg:  TEXT_MSG_SHARE1+ _iMoney + TEXT_MSG_SHARE2,
                msg_share: TEXT_MSG_SHARING1 + _iMoney + TEXT_MSG_SHARING2
            });
    };
    
    this.getState = function(){
        return _iCurState;
    };
    
    this.update = function(){
        if(_bUpdate === false){
            return;
        }
       
        switch(_iCurState){
            case GAME_STATE_SPINNING:{
                for(var i=0;i<_aMovingColumns.length;i++){
                    _aMovingColumns[i].update();
                }
                break;
            }
            case GAME_STATE_SHOW_ALL_WIN:{
                    
                    _iTimeElaps += s_iTimeElaps;
                    if(_iTimeElaps> TIME_SHOW_ALL_WINS){  
                        this._hideAllWins();
                    }
                    break;
            }
            case GAME_STATE_SHOW_WIN:{
                _iTimeElaps += s_iTimeElaps;
                if(_iTimeElaps > TIME_SHOW_WIN){
                    _iTimeElaps = 0;

                    this._showWin();
                }
                break;
            }
            case GAME_STATE_BONUS:{
                    _oBonusPanel.update();
                    break;
            }
        }
        
	
    };
    
    s_oGame = this;
    
    
    
    this._init();
}

var s_oGame;
var s_oTweenController;