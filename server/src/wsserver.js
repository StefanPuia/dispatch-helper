const WebSocketServer = require("websocket").server;
const connections = [];

const initWebSocketServer = (server) => {
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
                new Date() + " Peer " + (connection.remoteAddress === "::1" ? "local" : connection.remoteAddress) + " disconnected."
            );
        });
    });
};

module.exports = {
    init: initWebSocketServer,
    connections: connections
};