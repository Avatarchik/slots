function CPayTablePanel(){
    var _iCurPage;
    var _aNumSymbolComboText;
    var _aWinComboText;
    var _aPages;
    var _oCurPage;
    
    var _oHitArea;
    var _oWildText;
    var _oBg;
    var _oButArrowNext;
    var _oButArrowPrev;
    var _oContainer;
    
    this._init = function(){
        _iCurPage = 0;
        _aPages = new Array();
        
        _oContainer = new createjs.Container();
        _oContainer.visible = false;
        s_oAttachSection.addChild(_oContainer);
        
        //ATTACH PAGE 1
        var oContainerPage = new createjs.Container();
        _oContainer.addChild(oContainerPage);
        
        var oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable1'));
        oContainerPage.addChild(oBg);
        

        //LIST OF COMBO TEXT
        _aNumSymbolComboText = new Array();
        var i;
        var iXPos = 450;
        var iYPos = 122;
        _aNumSymbolComboText[0] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[0][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 450;
        iYPos = 302;
        _aNumSymbolComboText[1] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[1][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 450;
        iYPos = 486;
        _aNumSymbolComboText[2] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[2][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 780;
        iYPos = 122;
        _aNumSymbolComboText[3] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[3][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 780;
        iYPos = 302;
        _aNumSymbolComboText[4] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[4][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 1100;
        iYPos = 122;
        _aNumSymbolComboText[5] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[5][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 1100;
        iYPos = 302;
        _aNumSymbolComboText[6] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text("X"+(5-i),"bold 26px "+FONT_PAYTABLE, "#ffffff");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aNumSymbolComboText[6][i] = oText;
            
            iYPos += 49;
        }
        
        
        //LIST OF MONEY WIN
        _aWinComboText = new Array();
        
        iXPos = 510;
        iYPos = 122;
        _aWinComboText[0] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[0][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[0][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 510;
        iYPos = 302;
        _aWinComboText[3] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[3][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[3][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 510;
        iYPos = 486;
        _aWinComboText[6] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[6][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[6][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 830;
        iYPos = 122;
        _aWinComboText[1] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[1][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[1][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 830;
        iYPos = 302;
        _aWinComboText[4] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[4][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[4][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 1150;
        iYPos = 122;
        _aWinComboText[2] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[2][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[2][i] = oText;
            
            iYPos += 49;
        }
        
        iXPos = 1150;
        iYPos = 302;
        _aWinComboText[5] = new Array();
        for(i=0;i<3;i++){
            var oText = new createjs.Text(s_aSymbolWin[5][4-i],"bold 26px "+FONT_PAYTABLE, "#ffff00");
            oText.textAlign = "center";
            oText.x = iXPos;
            oText.y = iYPos;
            oText.textBaseline = "alphabetic";
            oContainerPage.addChild(oText);
            
            _aWinComboText[5][i] = oText;
            
            iYPos += 49;
        }
        
        _oWildText = new createjs.Text(TEXT_HELP_WILD,"bold 26px "+FONT_PAYTABLE, "#ffff00");
        _oWildText.textAlign = "center";
        _oWildText.x = 986;
        _oWildText.y = 484;
        oContainerPage.addChild(_oWildText);
        
        _aPages[0] = oContainerPage;
        
        //ATTACH PAGE 2
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        
        oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable2'));
        oContainerPage.addChild(oBg);
        
        var oText = new createjs.Text(TEXT_HELP_BONUS1,"bold 26px "+FONT_PAYTABLE, "#fff");
        oText.textAlign = "center";
        oText.x = 986;
        oText.y = 124;
        oText.lineWidth = 400;
        oContainerPage.addChild(oText);
        
        var oText2 = new createjs.Text(TEXT_HELP_BONUS2,"bold 26px "+FONT_PAYTABLE, "#fff");
        oText2.textAlign = "center";
        oText2.x = 506;
        oText2.y = 304;
        oText2.lineWidth = 400;
        oContainerPage.addChild(oText2);
        
        _aPages[1] = oContainerPage;
        
        //ATTACH PAGE 3
        oContainerPage = new createjs.Container();
        oContainerPage.visible = false;
        _oContainer.addChild(oContainerPage);
        
        oBg = createBitmap(s_oSpriteLibrary.getSprite('paytable3'));
        oContainerPage.addChild(oBg);
        
        var oText = new createjs.Text(TEXT_HELP_FREESPIN,"bold 32px "+FONT_PAYTABLE, "#ffff00");
        oText.textAlign = "center";
        oText.x = CANVAS_WIDTH/2;
        oText.y = 328;
        oText.lineWidth = 400;
        oContainerPage.addChild(oText);
        
        _aPages[2] = oContainerPage;
        
        _oCurPage = _aPages[_iCurPage];
        
        
        //ATTACH HIT AREA
        _oHitArea = new createjs.Shape();
        _oHitArea.graphics.beginFill("rgba(0,0,0,0.01)").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        var oParent = this;
        _oHitArea.on("click",function(){oParent._onExit()});
        _oContainer.addChild(_oHitArea);
        
        //ATTACH ARROW
        _oButArrowNext = new CGfxButton(CANVAS_WIDTH - 300,50,s_oSpriteLibrary.getSprite('but_arrow_next'),_oContainer);
        _oButArrowNext.addEventListener(ON_MOUSE_UP, this._onNext, this);
        
        _oButArrowPrev = new CGfxButton(300,50,s_oSpriteLibrary.getSprite('but_arrow_prev'),_oContainer);
        _oButArrowPrev.addEventListener(ON_MOUSE_UP, this._onPrev, this);
    };
    
    this.unload = function(){
        var oParent = this;
        _oHitArea.off("click",function(){oParent._onExit()});
        
        s_oAttachSection.removeChild(_oContainer);
        
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            _oContainer.removeChild(_aNumSymbolComboText[i]);
        }
        
        for(var j=0;j<_aWinComboText.length;j++){
            _oContainer.removeChild(_aWinComboText[j]);
        }
        
    };
    
    this._onNext = function(){
        if(_iCurPage === _aPages.length-1){
            _iCurPage = 0;
        }else{
            _iCurPage++;
        }
        
        
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };
    
    this._onPrev = function(){
        if(_iCurPage === 0){
            _iCurPage = _aPages.length -1;
        }else{
            _iCurPage--;
        }
        
        
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
    };
    
    this.show = function(){
        _iCurPage = 0;
        _oCurPage.visible = false;
        _aPages[_iCurPage].visible = true;
        _oCurPage = _aPages[_iCurPage];
        
        _oContainer.visible = true;
    };
    
    this.hide = function(){
        _oContainer.visible = false;
    };
    
    this.resetHighlightCombo = function(){
        for(var i=0;i<_aNumSymbolComboText.length;i++){
            for(var j=0;j<_aNumSymbolComboText[i].length;j++){
                _aNumSymbolComboText[i][j].color = "#ffffff";
                _aWinComboText[i][j].color = "#ffff00";
                createjs.Tween.removeTweens(_aWinComboText[i][j]);
                _aWinComboText[i][j].alpha = 1;
            }
        } 
    };
    
    this.highlightCombo = function(iSymbolValue,iNumCombo){
        
        _aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo].color = "#ff0000";
        
        this.tweenAlpha(_aWinComboText[iSymbolValue-1][NUM_REELS-iNumCombo],0);
        
    };
    
    this.tweenAlpha = function(oText,iAlpha){
        var oParent = this;
        createjs.Tween.get(oText).to({alpha:iAlpha}, 200).call(function(){if(iAlpha === 1){
                                                                                    oParent.tweenAlpha(oText,0);
                                                                                }else{
                                                                                    oParent.tweenAlpha(oText,1);
                                                                                }
        });
    };
    
    this._onExit = function(){
        s_oGame.hidePayTable();
    };
    
    this.isVisible = function(){
        return _oContainer.visible;
    };
    
    this._init();
}