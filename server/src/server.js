/* eslint-disable no-loop-func */
const http = require("http");
const config = require("./config.json");
const wsServer = require("./wsserver");

const init = async () => {
    const server = http.createServer((response) => {
        response.writeHead(404);
        response.end();
    });

    server.listen(config["disptach-port"], function () {
        console.log(new Date() + ` Server is listening on port ${config["disptach-port"]}`);

        wsServer.init(server);
        require("./irc-client")(wsServer.connections);
    });
};

init();
