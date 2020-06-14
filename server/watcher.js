/* eslint-disable no-loop-func */
const Tail = require("tail").Tail;
const path = require("path");
const fs = require("fs");
const connections = require("./wsserver").connections;
const defaultLocation = path.join(require("os").homedir(), "AppData\\Roaming\\HexChat\\logs\\FuelRats\\#fuelrats.log");

module.exports = async (rl) => {
    let successful = false;
    while (!successful) {
        successful = await tryReadingFile(rl);
    }
    console.log(`Listening for file changes`);
};

function tryReadingFile(rl) {
    return new Promise((resolve) => {
        rl.question(
            "Please enter the full path to the #fuelrats chat log file (or press enter for default):\n",
            (answer) => {
                try {
                    let file = answer || defaultLocation;
                    if (!fs.existsSync(file)) {
                        throw new Error(`File '${file}' does not exist.`);
                    }
                    engageTail(defaultLocation);
                    resolve(true);
                } catch (err) {
                    console.log(err.message);
                    resolve(false);
                }
            }
        );
    });
}

function engageTail(file) {
    console.log(`Trying to read file: ${file}`);
    try {
        const tail = new Tail(file, {
            fromBeginning: false,
        });
        tail.on("error", err => console.log(err.message));
        tail.on("line", (data) => {
            sendToClients(data);
        });
    } catch (err) {
        throw new Error(`Error reading file.`);
    }
}

function sendToClients(data) {
    for (const conn of connections) {
        try {
            conn.send(data);
        } catch (err) {
            console.log(err.message);
        }
    }
}