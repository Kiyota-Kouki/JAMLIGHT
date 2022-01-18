var express = require('express'),
    http = require('http'),
    url = require('url'),
    path = require('path'),
    webSocket = require('ws');

var app = express(),
    server = http.createServer(app),
    wss = new webSocket.Server({ server:server });

// client connections
var connects = []

// --------------------------------------------------------------

app.use(express.static(path.join(__dirname, '/public')));

// Called when success building connection
wss.on('connection', function (ws, req) {
    var location = url.parse(req.url, true);

    var initMessage = {message:"connection"};
    var initMessage_2 = {message_2:"connection"};
    ws.send(JSON.stringify(initMessage));
    ws.send(JSON.stringify(initMessage_2));
    connects.push(ws);
    console.log("New Client Connected : " + connects.length);

    // Callback from client message
    ws.on('message', function (message) {
        console.log('received_1: %f', message);

        broadcast( + message);
    });

    ws.on('message_2', function (message_2) {
        console.log('received_2: %f', message_2);

        broadcast( + message_2);
    });


    ws.on('close', function () {
        console.log('A Client Leave');
        connects = connects.filter(function (conn, i) {
            return (conn === ws) ? false : true;
        });
    });

});

server.listen(7777, function listening() {
    console.log('Listening on %d', server.address().port);
});

// Implement broadcast function because of ws doesn't have it
function broadcast (message, message_2) {
    connects.forEach(function (socket, i) {
        socket.send(message);
        socket.send(message_2);
    });
}
