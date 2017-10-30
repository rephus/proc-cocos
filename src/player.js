var Player = function(){
    var sprite; 
    var id; 
    
    var winSize = cc.winSize;

    sprite = new cc.Sprite(res.pixel);
    sprite.x = winSize.width/ 2; 
    sprite.y = winSize.height/ 2; 

    var name = randomNameGenerator();
    var label =  cc.LabelTTF.create(name, "Arial", 16);
    label.x = sprite.x; 
    label.y = sprite.y + 40; 
    Global.layer.addChild(label);

    sprite.color = cc.color(Utils.random(150, 255), 
        Utils.random(150, 255), 
        Utils.random(150, 255), 255); 

    sprite.setAnchorPoint(0.5,0.5);
    Global.layer.addChild(sprite);

    this.update = function(x, y){
        sprite.x = x;
        sprite.y = y;

        label.x = x; 
        label.y = y + 40; 
    }
    this.set = function(_id, color, _name){
        id = _id;
        if (color) sprite.color =  color; 
        if (_name) {
            name = _name;
            label.setString(name);
        }
    }

    this.control = function(layer){
        /*
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseUp: function (event) {
                var layerProperties = Global.layer.properties();
                console.log("Mouse up " , layerProperties, event.x, event.y);
                sprite.x = event._x- layerProperties.x ; 
                sprite.y = event._y -layerProperties.y;

            } 
        }, layer);*/

         cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function (key, event) {
                var target = event.getCurrentTarget();
                var move_inc = 10;
                //console.log("Pressed key " , key);
                if(key == "37" ) sprite.x -= move_inc;
                else if(key == "38") sprite.y += move_inc;
                else if(key == "39") sprite.x += move_inc;
                else if(key == "40") sprite.y -= move_inc;

                //update camera layer
                Global.layer.move(-sprite.x + winSize.width/ 2, 
                    -sprite.y + winSize.height/ 2);

                label.x = sprite.x; 
                label.y = sprite.y + 40;
                 
            } 
        },layer);

    }

    this.destroy = function(){
        sprite.removeFromParent(true);
        label.removeFromParent(true);

        delete Global.players[id];
    }

    this.properties = function(){
        return {
            id: id, 
            x: sprite.x, 
            y: sprite.y,
            color: sprite.color.r + ","  + sprite.color.g + ","+sprite.color.b,
            name: name
        }
    }
}

function randomNameGenerator(){
    var  animals= ['tiger', 'lion', 'cat', 'dog', 'rabbit', 'pidgeon', 'lizard', 'fox', 'shark'];
    //http://www.momswhothink.com/reading/list-of-adjectives.html
    var adjectives = ['smart', 'fast', 'quick', 'big' , 'angry', 'violent', 'black', 'clever', 'shy'];
    return adjectives[Utils.random(0, adjectives.length-1 )] +" "+ animals[Utils.random(0, animals.length-1 )];
}