var Websocket = new WebsocketManager();

var UPDATE_DELAY = 0.1; //seconds

function WebsocketManager() {

    console.log("Loading websocket");
    var socket;
    var lastPlayerUpdate;

    // -----------------
    // CONNECTION
    // ------------------

    this.connect = function () {
        socket = io('http://localhost:3000');

        // Done on broadcast, it won't be received by the person who 
        // updated the user on the first place

        //After being connected, receive a connected message with the socket.id
        socket.on('connected', function (data) {
            console.log("Connected player ", data);
            Global.layer.schedule(update, UPDATE_DELAY);
            Global.player.set(data.id);
        });

        // When other players disconnect, we remove them from our list
        socket.on('disconnect player', function (data) {
            if (Global.players[data.id]) {
                Global.players[data.id].destroy();

                console.log("Total players ", Object.keys(Global.players).length);
            } // else nothing to remove 
        });

        socket.on('update player', updatePlayer);
        socket.on('update sector', updateSector);
    }
    // --------------------
    // UPDATE
    // --------------------

    // Update other players
    function updatePlayer(data) {

        if (!Global.players[data.id]) {
            console.log("Creating remote player ", data); 
            var remotePlayer = new Player();
            var c = data.color.split(",");
            var color = cc.color(parseInt(c[0]), parseInt(c[1]) , parseInt(c[2]), 255);

            remotePlayer.set(data.id, color, data.name);
            Global.players[data.id] = remotePlayer;
        }
        //console.log("Updating remote player ", data);
        Global.players[data.id].update(data.x, data.y);
    }

    //Send my player details 
    function update() {
        // Only send position when it's updated
        var playerUpdate = JSON.stringify(Global.player.properties());
        if (playerUpdate !== lastPlayerUpdate) {
            lastPlayerUpdate = playerUpdate;
            socket.emit('update player', Global.player.properties());
        }
    }

    // --------------------
    // SECTORS
    // --------------------

    this.getSector = function (x, y) {
        socket.emit('get sector', { x: x, y: y });
    };

    function updateSector(data) {
        if (sectors[data.id]) {
            //TODO update existing sector 
        } else Sectors.create(data);
    }

};
