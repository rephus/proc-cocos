var sectors = {}; 
var SECTOR_SIZE = 200;

var Sectors = new SectorManager(); 

function SectorManager(){
    var currentSector ; //TODO remove Debug rect to show which sector you're in

    this.get = function(x, y){
        if (!currentSector){ //Initialize once
           currentSector = new cc.DrawNode();
            currentSector.drawRect(cc.p(0,0), cc.p(-SECTOR_SIZE, -SECTOR_SIZE), undefined, 5, cc.color.RED);
            Global.layer.addChild(currentSector); 
        }
        var id = sectorId(x,y);

        if (sectors[id]){
            var sector = sectors[id];
            currentSector.x = sector.x; 
            currentSector.y = sector.y; 

            return sector;
        } else {
            // Sector is not stored locally, request sector to websocket
            Websocket.getSector(x, y);
        }
    }

    //Created from websocket callback
    this.create = function(data){

        sectors[data.id] = data;
        isNew = data.isNew; 
        console.log("creating sector ", data);

        // Initialize contents
        data.contents.dots.forEach(function(dot){
            var node = new cc.DrawNode();
            node.drawDot(cc.p(dot.x, dot.y), 2);
            Global.layer.addChild(node);
        });
        // Draw different color bg sector if it's new
        var color = cc.color(0,0,0,0);
        if (isNew) color = cc.color(255,255,255,50);// cc.color.WHITE; 
        //Debug Draw sector
        var node = new cc.DrawNode();
        // http://www.cocos2d-x.org/docs/api-ref/js/v3x/
        node.drawRect(
            cc.p(data.x, data.y), 
            cc.p(data.x + data.size, data.y + data.size),
            color
        );
        Global.layer.addChild(node);
    }
}

  function sectorId(x, y ){
      if (x < 0) x-=  SECTOR_SIZE;
      if (y < 0) y -= SECTOR_SIZE;
      return (parseInt(x / SECTOR_SIZE))+","+(parseInt(y /SECTOR_SIZE));
  }