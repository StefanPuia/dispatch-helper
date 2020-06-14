/* eslint-disable no-loop-func */
const http = require("http");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function askForPort() {
    return new Promise((resolve, reject) => {
        rl.question("Please enter a port number (1000-65535):\n", (answer) => {
            try {
                let port = parseInt(answer);
                if (port > 65535 && port < 1000) {
                    throw new Error(``);
                }
                resolve(port);
            } catch (err) {
                console.log("Port number not valid");
                resolve(false);
            }
        });
    });
}

(async () => {
    let port = false;
    while (!port) {
        port = await askForPort();
    }

    const server = http.createServer((response) => {
        response.writeHead(404);
        response.end();
    });

    server.listen(port, function () {
        console.log(new Date() + " Server is listening on port 6969");

        require("./wsserver").init(server);
        require("./watcher")(rl);
    });
})();