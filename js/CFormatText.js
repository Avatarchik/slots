function CFormatText (iX, iY, szText, oParentContainer){
    
    var _iPrevLetterWidth;
    
    var _oTextOutline;
    var _oText;
    var _oTextContainer;
    
    this._init = function(iX, iY, szText, oParentContainer){    
        
        _iPrevLetterWidth = 0;
        
        _oTextContainer = new createjs.Container();
        _oTextContainer.x = iX;
        _oTextContainer.y = iY;
        oParentContainer.addChild(_oTextContainer);
        
        var iDim = 56;
        
        var iScale = 20;
        var iLetterOffset = iDim/iScale;
        
        var iReduceOffset = 9;
        
        for(var i=0; i<szText.length; i++){
            
            var szFontTag = iDim + "px";
            
            _oTextOutline = new createjs.Text();
            _oTextOutline.text = szText[i];
            _oTextOutline.font = "bold "+szFontTag+" "+FONT_GAME;
            _oTextOutline.color = "#000000";
            _oTextOutline.textAlign = "left";
            _oTextOutline.textBaseline = "middle";
            _oTextOutline.x = _iPrevLetterWidth + 2;
            _oTextOutline.y = 2;
            _oTextContainer.addChild(_oTextOutline);

            _oText = new createjs.Text();
            _oText.text = szText[i];
            _oText.font = "bold "+szFontTag+" "+FONT_GAME;
            _oText.color = "#ffffff";
            _oText.textAlign = "left";
            _oText.textBaseline = "middle";
            _oText.x = _iPrevLetterWidth;
            _oTextContainer.addChild(_oText);
            
            _iPrevLetterWidth += _oTextOutline.getMeasuredWidth() + iLetterOffset;
            iDim -= iReduceOffset;
            
        }
    };
 
    this.unload = function(){
        oParentContainer.removeChild(_oTextContainer);
    };

    this.rotateText = function(iRot){
        _oTextContainer.rotation = iRot;
    };
    
    this._init(iX, iY, szText, oParentContainer);
    
}