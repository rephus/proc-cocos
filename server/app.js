// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port ws://localhost:%d', port);
});

var numUsers = 0;
var players  = {};
var sectors = {};
io.on('connection', function (socket) {
  numUsers++;

  // -----------------
  // CONNECTION
  // ------------------

  console.log("User connected ", socket.id);
  socket.emit('connected', {id: socket.id} );

  socket.on('disconnect', function () {
    console.log("Disconnecting player " , socket.id);
      delete players[socket.id];
      socket.broadcast.emit('disconnect player', {id: socket.id} );
  });

  // --------------------
  // UPDATE
  // --------------------

  socket.on('update player', function (data) {
    //console.log("update player ", data);
    players[socket.id] = data; 
     //myLevel.data = data;
     socket.broadcast.emit('update player', data);
  });

   // --------------------
  // SECTORS
  // --------------------
  var SECTOR_SIZE = 200;

  function sectorId(x, y ){
        if (x < 0) x-=  SECTOR_SIZE;
      if (y < 0) y -= SECTOR_SIZE;
      return (parseInt(x / SECTOR_SIZE))+","+(parseInt(y /SECTOR_SIZE));
  }
  function origSector(pos) {
    if (pos < 0) pos -= SECTOR_SIZE;
    return parseInt(pos /SECTOR_SIZE) * SECTOR_SIZE;
  }

  function newSector(id, x, y){
      var sector = {
          id : id, x: x,  y: y,
          size: SECTOR_SIZE, 
          contents: { 
            dots: []
          }
        }
        for( var i=0 ; i < 5; i++){
            var obj = {
              x: random(x, x+SECTOR_SIZE), 
              y: random(y, y+SECTOR_SIZE)
            };
            sector.contents.dots.push(obj);
        }
        return sector; 
  }
  socket.on('get sector', function(data){
    
     var id = sectorId ( data.x, data.y);

    var x = origSector(data.x); 
    var y = origSector(data.y); 

      var sector;

      if (sectors[id] ){
         sector = sectors[id];
        sector.isNew=false; 
      } else {
        console.log("Creating new sector " , id);
        sector = newSector(id, x, y );
        sectors[id] = sector; 
        sector.isNew=true; 
      }
      socket.emit('update sector', sector );
  });
});

function random(min,max){
      return Math.floor(Math.random()*(max-min+1)+min);
  }
