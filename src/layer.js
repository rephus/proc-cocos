var Layer = cc.Layer.extend({

    player:null,

    ctor:function () {
        this._super();

        Global.layer = this; //Used in player to addChild 
        player = new Player();
        player.control(this);
        Global.player = player;

        this.schedule(this.update,0.2);
        var _this = this;
        Websocket.connect();
/*
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                var target = event.getCurrentTarget();
                var move_inc = 10;
                //console.log("Pressed key " , key);
                if(key == "37" ) _this.x += move_inc;
                else if(key == "38") _this.y -= move_inc;
                else if(key == "39") _this.x -= move_inc;
                else if(key == "40") _this.y += move_inc;
            } 
        }, this);
*/
        return true;
    },
    
    update: function(){
        var p = player.properties();
         var s = Sectors.get( p.x,  p.y); 
         //Get surrounding sectors
         var SS = SECTOR_SIZE;
         Sectors.get( p.x - SS, p.y - SS ); Sectors.get( p.x, p.y - SS ); Sectors.get( p.x + SS, p.y - SS ); 
         Sectors.get( p.x - SS, p.y  ); /*Sectors.get( p.x, p.y ); */Sectors.get( p.x + SS, p.y  ); 
         Sectors.get( p.x - SS, p.y + SS ); Sectors.get( p.x, p.y + SS ); Sectors.get( p.x + SS, p.y + SS ); 

     },
     move:  function(x, y){
        this.x = x;
        this.y = y;

     },
     properties: function(){
         return {
            x : this.x, 
            y: this.y
         }
     }
});
