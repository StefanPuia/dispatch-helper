const WebSocketServer = require("websocket").server;
const connections = [];

const initWebSocketServer = (server) => {
    const wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false,
    });

    wsServer.on("request", function (request) {
        const ip = request.httpRequest.headers["x-real-ip"] || request.remoteAddress;
        const address = ip === "::1" ? "localhost" : ip;
        const connection = request.accept("echo-protocol", request.origin);
        console.log(new Date() + ` ${address} connection accepted.`);
        connections.push(connection);
        connection.on("close", function (reasonCode, description) {
            const index = connections.indexOf(connection);
            if (index > -1) {
                connections.splice(index, 1);
            }
            console.log(new Date() + ` ${address} peer disconnected.`);
        });
    });
};

module.exports = {
    init: initWebSocketServer,
    connections: connections,
};
