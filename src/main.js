//Main Game container 
var Scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        GameLayer = new Layer();
        this.addChild(GameLayer);
    }
});
