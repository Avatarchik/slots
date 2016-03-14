function CMsgBox(){
    
    var _oBg;
    var _oMsgText;
    var _oMsgTextBack;
    var _oButExit;
    var _oGroup;
    
    this._init = function(){
        _oGroup = new createjs.Container();
        _oGroup.visible = false;
        s_oStage.addChild(_oGroup);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        _oGroup.addChild(_oBg);

        _oMsgTextBack = new createjs.Text("","bold 24px "+FONT_GAME, "#000");
        _oMsgTextBack.x = CANVAS_WIDTH/2 +2;
        _oMsgTextBack.y = (CANVAS_HEIGHT/2)-48;
        _oMsgTextBack.textAlign = "center";
        _oGroup.addChild(_oMsgTextBack);

        _oMsgText = new createjs.Text("","bold 24px "+FONT_GAME, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-50;
        _oMsgText.textAlign = "center";
        _oGroup.addChild(_oMsgText);
                                                      
        _oButExit = new CTextButton((CANVAS_WIDTH/2),CANVAS_HEIGHT - 200,s_oSpriteLibrary.getSprite('but_bg'),TEXT_OK,"walibi0615bold","#ffffff",40,_oGroup);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this); 
    };
    
    this.show = function(szMsg){
        _oMsgTextBack.text = szMsg;
        _oMsgText.text = szMsg;
        _oGroup.visible = true;
    };
    
    this.hide = function(){
        _oGroup.visible = false;
    };
    
    this._onExit = function(){
        this.hide();
    };
    
    this._init();
    
    return this;
}