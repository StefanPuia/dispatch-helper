const WebSocketServer = require("websocket").server;
const http = require("http");
const Tail = require("tail").Tail;
const path = require("path");

const connections = [];
const server = http.createServer(function (request, response) {
    console.log(new Date() + " Received request for " + request.url);
    response.writeHead(404);
    response.end();
});
server.listen(6969, function () {
    console.log(new Date() + " Server is listening on port 6969");
});

const wsServer = new WebSocketServer({
    httpServer: server,
    autoAcceptConnections: false,
});

wsServer.on("request", function (request) {
    const connection = request.accept("echo-protocol", request.origin);
    console.log(new Date() + " Connection accepted.");
    connections.push(connection);
    connection.on("close", function (reasonCode, description) {
        const index = connections.indexOf(connection);
        if (index > -1) {
            connections.splice(index, 1);
        }
        console.log(
            new Date() + " Peer " + connection.remoteAddress + " disconnected."
        );
    });
});

try {
    const tail = new Tail(
        path.join(
            require("os").homedir(),
            "AppData\\Roaming\\HexChat\\logs\\FuelRats\\#fuelrats.log"
        ), {
            fromBeginning: false,
        }
    );
    tail.on("error", console.error);
    tail.on("line", (data) => {
        sendToClients(data);
    });
} catch (err) {
    console.error(err);
}

function sendToClients(data) {
    for (const conn of connections) {
        try {
            conn.send(data);
        } catch (err) {
            console.error(err);
        }
    }
}