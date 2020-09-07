const irc = require("irc");
const config = require("./config.json");
const fs = require("fs");

module.exports = (connections) => {
    const client = new irc.Client("irc.fuelrats.com", config["irc-nick"], {
        port: "+6667",
        realName: config["irc-realname"],

        sasl: true,
        userName: config["irc-name"],
        password: config["irc-password"],

        channels: [],
        debug: false,
        showErrors: true,
        autoRejoin: false,
        autoConnect: false,
        secure: false,
        selfSigned: true,
        certExpired: true,
        floodProtection: false,
        floodProtectionDelay: 1000,
        retryCount: 1,
        retryDelay: 5000,
        stripColors: true,
        channelPrefixes: "&#",
    });

    const regexList = [];
    for (const regex of config["notify"] || []) {
        try {
            regexList.push(new RegExp(regex[0], regex[1]));
        } catch (err) {
            console.trace(err);
        }
    }

    client.addListener("raw", (raw) => {
        sendToClients(JSON.stringify(raw), connections);
        if (raw && raw.rawCommand === "PRIVMSG") {
            if (raw.args && raw.args[0] === config["irc-nick"]) {
                log(`${raw.nick || ""}: ${raw.args[1] || JSON.stringify(raw)}`);
            } else if (raw.args[1]) {
                for (const regex of regexList) {
                    if (regex.test(raw.args[1])) {
                        log(`${raw.nick || ""}: ${raw.args[1]}`);
                    }
                }
            }
        }
    });

    client.addListener("error", function (message) {
        log(`error: ${message}`);
    });

    client.connect(0, () => {
        log("connected");
        client.join("#fuelrats", () => {
            log("connected to fuelrats");
        });
        client.join("#ratchat", () => {
            log("connected to ratchat");
        });
    });
};

function sendToClients(data, connections) {
    for (const conn of connections) {
        try {
            conn.send(data);
        } catch (err) {
            log(err.message);
        }
    }
}

function log(message) {
    const messageLine = `${new Date().toISOString()} ${message}\n`;
    console.log(messageLine);
    fs.appendFile("irc.log", messageLine, (err) => {
        if (err) console.error(err);
    });
}
