var s_aSession = new Array();

var NUM_ROWS = NUM_ROWS;
var NUM_REELS = NUM_REELS;
var _aFinalSymbols = new Array();
var _aRandSymbols = new Array();
_aRandSymbols = _initSymbolsOccurence();
var _betablePaylineCombo = new Array();
_betablePaylineCombo = _initBetablePaylines();
var _aPaylineCombo = new Array();
_aPaylineCombo = _initPaylines();
var _aSymbolWin = new Array();
_aSymbolWin = _initSymbolWin();
var _iNumSymbolFreeSpin = 0;
var slotResults = new Array();

s_aSession["bBonus"] = 0;
    
function _initSettings(){
    s_aSession["iMoney"] = TOTAL_MONEY;                            //USER MONEY
    s_aSession["iSlotCash"] = SLOT_CASH;                       //SLOT CASH. IF USER BET IS HIGHER THAN CASH, USER MUST LOOSE.
    s_aSession["win_occurrence"] = WIN_OCCURRENCE;                    //WIN OCCURRENCE(FROM 0 TO 100)
    s_aSession["freespin_occurrence"] = FREESPIN_OCCURRENCE;               //IF USER MUST WIN, SET THIS VALUE FOR FREESPIN OCCURRENCE
    s_aSession["bonus_occurrence"] = BONUS_OCCURRENCE;                  //IF USER MUST WIN, SET THIS VALUE FOR BONUS OCCURRENCE
    s_aSession["freespin_symbol_num_occur"] = FREESPIN_SYMBOL_NUM_OCCURR; //WHEN PLAYER GET FREESPIN, THIS ARRAY GET THE OCCURRENCE OF RECEIVING 3,4 OR 5 FREESPIN SYMBOLS IN THE WHEEL
    s_aSession["num_freespin"] = NUM_FREESPIN;                 //THIS IS THE NUMBER OF FREESPINS IF IN THE FINAL WHEEL THERE ARE 3,4 OR 5 FREESPIN SYMBOLS
    s_aSession["bonus_prize"] =  BONUS_PRIZE; //THIS IS THE LIST OF BONUS PRIZES. KEEP BEST PRIZE IN PENULTIMATE POSITION IN ARRAY
    s_aSession["bonus_prize_occur"] = BONUS_PRIZE_OCCURR; //OCCURRENCE FOR EACH PRIZE IN BONUS_PRIZES. HIGHER IS THE NUMBER, MORE POSSIBILITY OF OUTPUTHAS THE PRIZE
    s_aSession["coin_bet"] = COIN_BET;
}

function checkLogin(){
    s_aSession["iTotFreeSpin"] = 0;

    s_aSession["bFreeSpin"] = 0;
    //STARTING MONEY
    _initSettings();
    _setMinWin();
    return _tryToCheckLogin();
}

function callSpin(iNumBettingLines,iCoin,iCurBet){
    return _onSpin(iNumBettingLines,iCoin,iCurBet);
}
    

function _tryToCheckLogin(){
    //THIS FUNCTION PASS USER MONEY AND BONUS PRIZES FOR THE WHEEL
    var aTmp = new Array();
    for(var i=0;i< _aSymbolWin.length;i++){
        aTmp[i] = _aSymbolWin[i].join(",");
    }
    
    return "res=true&login=true&money="+s_aSession["iMoney"]+"&bonus_prize="+s_aSession["bonus_prize"].join("#")+"&paytable="+
                                                            aTmp.join("#")+"&coin_bet="+s_aSession["coin_bet"].join("#");
}
    
function _setMinWin(){
    //FIND MIN WIN
    s_aSession["min_win"] = _aSymbolWin[0][_aSymbolWin[0].length-1];
    for(var i=0;i<_aSymbolWin.length;i++){
        var aTmp = _aSymbolWin[i];
        for(var j=0;j<aTmp.length;j++){
            if(aTmp[j] !== 0 && aTmp[j] < s_aSession["min_win"]){
                s_aSession["min_win"] = aTmp[j];
            }
        }
    }
}

function _onCallSpin(iCoin, iCurBet, iNumBettingLines){
    //CHECK IF iCurBet IS < DI iMoney OR THERE IS AN INVALID BET
    if(iCurBet > s_aSession["iMoney"]){
        _dieError("INVALID BET: "+iCurBet+",money:"+s_aSession["iMoney"]);
        return;
    }
    //DECREASING USER MONEY WITH THE CURRENT BET
    s_aSession["iMoney"] = s_aSession["iMoney"] - iCurBet;
    s_aSession["iSlotCash"] = s_aSession["iSlotCash"] + iCurBet;
    s_aSession["bBonus"] = 0;

    //Create JSON data containing wager and paylines for request
    var paylines = [];
    for (var i = 0; i < iNumBettingLines; i++) {
        paylines.push(_betablePaylineCombo[i])
    }
    var wage = iCurBet.toFixed(2).toString();
    var economy = betable.demoMode ? 'sandbox' : 'real';

    //Make a betable bet on the game
    betable.bet("Q64CcNdTxMqJsF6EApIbKn", {
        wager: wage
        ,paylines: paylines
        ,currency: 'GBP'
        ,economy: economy
    }, function success(data){
        var slotWindow = data.window;
        var slotOutcome = data.outcomes;
        var slotPayouts = data.payout;

        //Determine symbols to display in final results
        for (var i = 0; i < slotWindow.length; i++) {
            _aFinalSymbols[i] = new Array();
            var slotRowResults = slotWindow[i];
            for (var j = 0; j < slotRowResults.length; j++) {
                if(slotRowResults[j] == "bonus"){
                    _aFinalSymbols[i][j] = "9";
                }
                else if(slotRowResults[j] == "scatter"){
                    _aFinalSymbols[i][j] = "10";
                }
                else if(slotRowResults[j] == "wild"){
                    _aFinalSymbols[i][j] = "11";
                }
                else{
                    _aFinalSymbols[i][j] = slotRowResults[j].substring(6);
                }
            };
        };
        //Find each line that has a win outcome
        var _aWinningLine = new Array();
        var outcome = false;
        for(var i = 0; i < slotOutcome.length - 1; i++){
            var outcomeObject = slotOutcome[i];
            if (outcomeObject.outcome == "win") {
                outcome = true;
                var aCellList = new Array();
                var payline = new Array();
                payline = outcomeObject.payline;
                var symbols = new Array();
                symbols = outcomeObject.symbols;
                for(var k = 0; k < payline.length; k++){
                    if(symbols[k] == "bonus"){
                        aCellList.push({row:payline[k],col:k,value:"9"});
                    }
                    else if(symbols[k] == "scatter"){
                        aCellList.push({row:payline[k],col:k,value:"10"});
                    }
                    else if(symbols[k] == "wild"){
                        aCellList.push({row:payline[k],col:k,value:"11"});
                    }
                    else{
                        aCellList.push({row:payline[k],col:k,value:symbols[k].substring(6)});
                    }
                }
                _aWinningLine.push({line:i+1,list:aCellList});
            };
        };
        var oData;
        //Win outcome
        if (outcome) {
            s_aSession["iMoney"] = s_aSession["iMoney"] + parseInt(slotPayouts); 
            s_aSession["iSlotCash"] = s_aSession["iSlotCash"] - parseInt(slotPayouts);
            oData = "res=true&win=true&pattern="+JSON.stringify(_aFinalSymbols)+"&win_lines="+JSON.stringify(_aWinningLine)+"&money="+s_aSession["iMoney"]+"&tot_win="+slotPayouts+"&freespin="+s_aSession["iTotFreeSpin"]+"&bonus="+s_aSession["bBonus"]+"&bonus_prize=-1"+"&cash="+s_aSession["iSlotCash"];
        }
        //Lose outcome
        else{
            oData = "res=true&win=false&pattern="+JSON.stringify(_aFinalSymbols)+"&money="+s_aSession["iMoney"]+"&freespin="+s_aSession["iTotFreeSpin"]+"&bonus=false&bonus_prize=-1";
        }
        //Display outcome in the game
        var oRetData = getUrlVars(oData);
        if ( oRetData.res === "true" ){
            s_oGame.onSpinReceived(oRetData);
        }else{
            s_oMsgBox.show(oRetData.desc);
        }
    }, function error(data){
        alert("The following error has occured while making a bet: " +data.description)
    });
};

function _onSpin(iNumBettingLines,iCoin,iCurBet){
    //CHECK IF iCurBet IS < DI iMoney OR THERE IS AN INVALID BET
    if(iCurBet > s_aSession["iMoney"]){
        _dieError("INVALID BET: "+iCurBet+",money:"+s_aSession["iMoney"]);
        return;
    }

    //DECREASING USER MONEY WITH THE CURRENT BET
    s_aSession["iMoney"] = s_aSession["iMoney"] - iCurBet;
    s_aSession["iSlotCash"] = s_aSession["iSlotCash"] + iCurBet;
    s_aSession["bBonus"] = 0;

    //Create JSON data containing wager and paylines for request
    var paylines = [];
    for (var i = 0; i < iNumBettingLines; i++) {
        paylines.push(_betablePaylineCombo[i])
    }
    var wage = iCurBet.toFixed(2).toString();
    var economy = betable.demoMode ? 'sandbox' : 'real';

    //Make a betable bet on the game
    betable.bet("Q64CcNdTxMqJsF6EApIbKn", {
        wager: wage
        ,paylines: paylines
        ,currency: 'GBP'
        ,economy: economy
    }, function success(data){
        var slotWindow = data.window;
        var slotOutcome = data.outcomes;
        var slotPayouts = data.payout;

        for (var i = 0; i < slotWindow.length; i++) {
            _aFinalSymbols[i] = new Array();
            var slotRowResults = slotWindow[i];
            for (var j = 0; j < slotRowResults.length; j++) {
                _aFinalSymbols[i][j] = slotRowResults[j].substring(6);
            };
        };

        var _aWinningLine = new Array();

        var outcome = false;

        for(var i = 0; i < slotOutcome.length - 1; i++){
            var outcomeObject = slotOutcome[i];
            if (outcomeObject.outcome == "win") {
                outcome = true;

                var aCellList = new Array();

                var payline = new Array();
                payline = outcomeObject.payline;
                var symbols = new Array();
                symbols = outcomeObject.symbols;

                for(var k = 0; k < payline.length; k++){
                    aCellList.push({row:payline[k],col:k,value:symbols[k].substring(6)});
                }
                _aWinningLine.push({line:i+1,list:aCellList});
            };
        };

        if (outcome) {
            s_aSession["iMoney"] = s_aSession["iMoney"] + slotPayouts.parseInt; 
            s_aSession["iSlotCash"] = s_aSession["iSlotCash"] - slotPayouts.parseInt;
            return "res=true&win=true&pattern="+JSON.stringify(_aFinalSymbols)+"&win_lines="+JSON.stringify(_aWinningLine)+"&money="+s_aSession["iMoney"]+"&tot_win="+slotPayouts+"&freespin="+s_aSession["iTotFreeSpin"]+"&bonus="+s_aSession["bBonus"]+"&bonus_prize="+iPrizeReceived+"&cash="+s_aSession["iSlotCash"];
        }
        else{
            return "res=true&win=false&pattern="+JSON.stringify(_aFinalSymbols)+"&money="+s_aSession["iMoney"]+"&freespin="+s_aSession["iTotFreeSpin"]+"&bonus=false&bonus_prize=-1";
        }
    }, function error(data){
        alert("The following error has occured while making a bet: " +data.description)
    });
};

function _initBetablePaylines(){
    //STORE ALL INFO ABOUT BETABLE PAYLINES
    //[1,1,1,1,1] is a horizontal line through the second row
    //[0,1,2,3,4] is a diagonal line from top left to bottom right

    _betablePaylineCombo[0] = [1,1,1,1,1];
    _betablePaylineCombo[1] = [0,0,0,0,0];
    _betablePaylineCombo[2] = [2,2,2,2,2];
    _betablePaylineCombo[3] = [0,1,2,1,0];
    _betablePaylineCombo[4] = [2,1,0,1,2];
    _betablePaylineCombo[5] = [1,0,0,0,1];
    _betablePaylineCombo[6] = [1,2,2,2,1];
    _betablePaylineCombo[7] = [0,0,1,2,2];
    _betablePaylineCombo[8] = [2,2,1,0,0];
    _betablePaylineCombo[9] = [1,0,1,2,1];
    _betablePaylineCombo[10] = [1,2,1,0,1];
    _betablePaylineCombo[11] = [0,1,1,1,0];
    _betablePaylineCombo[12] = [2,1,1,1,2];
    _betablePaylineCombo[13] = [0,1,0,1,0];
    _betablePaylineCombo[14] = [2,1,2,1,2];
    _betablePaylineCombo[15] = [1,1,0,1,1];
    _betablePaylineCombo[16] = [1,1,2,1,1];
    _betablePaylineCombo[17] = [0,0,1,0,0];
    _betablePaylineCombo[18] = [2,2,1,2,2];
    _betablePaylineCombo[19] = [1,2,1,2,1];

    return _betablePaylineCombo;
};
	
function _initPaylines(){
    //STORE ALL INFO ABOUT PAYLINE COMBOS

    _aPaylineCombo[0] = [{row:1,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[1] = [{row:0,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[2] = [{row:2,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[3] = [{row:0,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[4] = [{row:2,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[5] = [{row:1,col:0},{row:0,col:1},{row:0,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[6] = [{row:1,col:0},{row:2,col:1},{row:2,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[7] = [{row:0,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[8] = [{row:2,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[9] = [{row:1,col:0},{row:0,col:1},{row:1,col:2},{row:2,col:3},{row:1,col:4}];
    _aPaylineCombo[10] = [{row:1,col:0},{row:2,col:1},{row:1,col:2},{row:0,col:3},{row:1,col:4}];
    _aPaylineCombo[11] = [{row:0,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[12] = [{row:2,col:0},{row:1,col:1},{row:1,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[13] = [{row:0,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:0,col:4}];
    _aPaylineCombo[14] = [{row:2,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:2,col:4}];
    _aPaylineCombo[15] = [{row:1,col:0},{row:1,col:1},{row:0,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[16] = [{row:1,col:0},{row:1,col:1},{row:2,col:2},{row:1,col:3},{row:1,col:4}];
    _aPaylineCombo[17] = [{row:0,col:0},{row:0,col:1},{row:1,col:2},{row:0,col:3},{row:0,col:4}];
    _aPaylineCombo[18] = [{row:2,col:0},{row:2,col:1},{row:1,col:2},{row:2,col:3},{row:2,col:4}];
    _aPaylineCombo[19] = [{row:1,col:0},{row:2,col:1},{row:1,col:2},{row:2,col:3},{row:1,col:4}];

    return _aPaylineCombo;
};
	
function _initSymbolsOccurence(){
    var i;

    //OCCURENCE FOR SYMBOL 1
    for(i=0;i<1;i++){
        _aRandSymbols.push(1);
    }

    //OCCURENCE FOR SYMBOL 2
    for(i=0;i<2;i++){
        _aRandSymbols.push(2);
    }

    //OCCURENCE FOR SYMBOL 3
    for(i=0;i<3;i++){
        _aRandSymbols.push(3);
    }

    //OCCURENCE FOR SYMBOL 4
    for(i=0;i<4;i++){
        _aRandSymbols.push(4);
    }

    //OCCURENCE FOR SYMBOL 5
    for(i=0;i<5;i++){
        _aRandSymbols.push(5);
    }

    //OCCURENCE FOR SYMBOL 6
    for(i=0;i<6;i++){
        _aRandSymbols.push(6);
    }

    //OCCURENCE FOR SYMBOL 7
    for(i=0;i<7;i++){
        _aRandSymbols.push(7);
    }

    //OCCURENCE FOR SYMBOL 8
    for(i=0;i<1;i++){
        _aRandSymbols.push(8);
    }

    //OCCURENCE FOR SYMBOL 9 (BONUS)
    for(i=0;i<2;i++){
        _aRandSymbols.push(9);
    }

     //OCCURENCE FOR SYMBOL 10 (FREESPIN)
    for(i=0;i<2;i++){
        _aRandSymbols.push(10);
    }

    //OCCURENCE FOR SYMBOL 11 (WILD)
    for(i=0;i<11;i++){
        _aRandSymbols.push(11);
    }
    
    return _aRandSymbols;
};
	
//THIS FUNCTION INIT WIN FOR EACH SYMBOL COMBO
//EXAMPLE: _aSymbolWin[0] = array(0,0,20,25,30) MEANS THAT
//CHERRY SYMBOL GIVES THE FOLLOWING PRIZE FOR:
//COMBO 1 : 0$
//COMBO 2 : 0$
//COMBO 3 : 20$
//COMBO 4 : 25$
//COMBO 5 : 30$
function _initSymbolWin(){
    _aSymbolWin[0] = [0,0,90,150,200];
    _aSymbolWin[1] = [0,0,80,110,160];
    _aSymbolWin[2] = [0,0,70,100,150];
    _aSymbolWin[3] = [0,0,50,80,110];
    _aSymbolWin[4] = [0,0,40,60,80];
    _aSymbolWin[5] = [0,0,30,50,70];
    _aSymbolWin[6] = [0,0,20,30,50];
    _aSymbolWin[7] = [0,0,0,0,0,50];
    _aSymbolWin[8] = [0,0,0,0,0,50];
    _aSymbolWin[9] = [0,0,0,0,0,50];

    return _aSymbolWin;
};
    
	
function generLosingPattern(){
    var aFirstCol = new Array();
    for(var i=0;i<NUM_ROWS;i++){
        do{
            var iRandIndex = Math.floor(Math.random()*(_aRandSymbols.length)); 
        }while(_aRandSymbols[iRandIndex] === 9 || _aRandSymbols[iRandIndex] === 10 || _aRandSymbols[iRandIndex] === 8);
        
        var iRandSymbol = _aRandSymbols[iRandIndex];
        aFirstCol[i] = iRandSymbol;  
    }

    for(var i=0;i<NUM_ROWS;i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            if(j == 0){
                _aFinalSymbols[i][j] = aFirstCol[i];
            }else{
                do{
                    iRandIndex =  Math.floor(Math.random()*_aRandSymbols.length);
                    iRandSymbol = _aRandSymbols[iRandIndex];
                }while(aFirstCol[0] === iRandSymbol || aFirstCol[1] === iRandSymbol || aFirstCol[2] === iRandSymbol ||
                        iRandSymbol === 9 || iRandSymbol === 10 || iRandSymbol === 8);

                _aFinalSymbols[i][j] = iRandSymbol;			
            }  
        }
    }
};
	
function generateRandomSymbols(bFreespin,bBonus){
    for(var i=0;i<NUM_ROWS;i++){
        _aFinalSymbols[i] = new Array();
        for(var j=0;j<NUM_REELS;j++){
            do{
                var iRandIndex = Math.floor(Math.random()*_aRandSymbols.length);
                iRandSymbol = _aRandSymbols[iRandIndex];
                _aFinalSymbols[i][j] = iRandSymbol;
            }while(iRandSymbol === 9 || iRandSymbol === 10);
        }
    }

    if(bFreespin === 1){
        //DECIDE HOW NAMY FREESPIN SYMBOL MUST APPEAR( MINIMUM 3, MAX 5)
        var aTmp = new Array();
        for(i=0;i<s_aSession["freespin_symbol_num_occur"].length;i++){
            for(j=0;j<s_aSession["freespin_symbol_num_occur"][i];j++){
                aTmp.push(i);
            }
        }

        var iRand =  Math.floor(Math.random()*aTmp.length);
        _iNumSymbolFreeSpin = 3 + aTmp[iRand];

        var aCurReel = [0,1,2,3,4];
        aCurReel = shuffle ( aCurReel );
        for(var k=0;k<_iNumSymbolFreeSpin;k++){
            var iRandRow = Math.floor(Math.random()*3);
            _aFinalSymbols[iRandRow][aCurReel[k]] = 10;
        }
    }else if(bBonus === 1){
        //DECIDE WHERE BONUS SYMBOL MUST APPEAR.          
        aCurReel = [0,1,2,3,4];
        aCurReel = shuffle ( aCurReel );
        var iNumBonusSymbol = Math.floor(Math.random()*3+3);
        for(var k=0;k<iNumBonusSymbol;k++){
            iRandRow = Math.floor(Math.random()*3);
            _aFinalSymbols[iRandRow][aCurReel[k]] = 9;
        }
    }
};
	
function checkWin(bFreespin,bBonus,iNumBettingLines){
    //CHECK IF THERE IS ANY COMBO
    var _aWinningLine = new Array();

    for(var k=0;k<iNumBettingLines;k++){
        var aCombos = _aPaylineCombo[k];

        var aCellList = new Array();
        var iValue = _aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']];

        var iNumEqualSymbol = 1;
        var iStartIndex = 1;
        
        aCellList.push({row:aCombos[0]['row'],col:aCombos[0]['col'],value:_aFinalSymbols[aCombos[0]['row']][aCombos[0]['col']]} );

        while(iValue === 8 && iStartIndex<NUM_REELS){
            iNumEqualSymbol++;
            iValue = _aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']];
	
            aCellList.push( {row: aCombos[iStartIndex]['row'] ,col:aCombos[iStartIndex]['col'] ,value:_aFinalSymbols[aCombos[iStartIndex]['row']][aCombos[iStartIndex]['col']]} );                                                    
            iStartIndex++;
        }
        
        for(var t=iStartIndex;t<aCombos.length;t++){
            if(_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === iValue || 
                                        _aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']] === 8){
                iNumEqualSymbol++;
                
                
                aCellList.push({row:aCombos[t]['row'],col:aCombos[t]['col'],value:_aFinalSymbols[aCombos[t]['row']][aCombos[t]['col']]} );
            }else{
                break;
            }
        }
        
        if(_aSymbolWin[iValue-1][iNumEqualSymbol-1] > 0){
            _aWinningLine.push({line:k+1,amount:_aSymbolWin[iValue-1][iNumEqualSymbol-1],num_win:iNumEqualSymbol,value:iValue,list:aCellList});
        }
    }
    
    if(bFreespin === 1){
        aCellList = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(var j=0;j<NUM_REELS;j++){
                if(_aFinalSymbols[i][j] === 10){
                    aCellList.push({row:i,col:j,value:10});
                }
            }
        }

        _aWinningLine.push({line:0,amount:0,num_win:aCellList.length,value:10,list:aCellList});
        
    }else if(bBonus === 1){
        var aCellList = new Array();
        for(var i=0;i<NUM_ROWS;i++){
            for(j=0;j<NUM_REELS;j++){
                if(_aFinalSymbols[i][j] === 9){
                    aCellList.push({row:i,col:j,value:9});
                }
            }
        }

        _aWinningLine.push({line:0,amount:0,num_win:aCellList.length,value:9,list:aCellList});
    }
    
    
    return _aWinningLine;
};

function shuffle(aArray){
    for(var j, x, i = aArray.length; i; j = Math.floor(Math.random() * i), x = aArray[--i], aArray[i] = aArray[j], aArray[j] = x);
    return aArray;
};

function _dieError( szReason){
    return "res=false&desc="+szReason;
};	