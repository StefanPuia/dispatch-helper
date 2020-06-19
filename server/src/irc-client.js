const irc = require("irc");
const config = require("./config.json");
const fs = require("fs");

module.exports = (connections) => {
    const client = new irc.Client("irc.fuelrats.com", config["irc-nick"], {
        port: "+6667",
        realName: "dispatch web helper",

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

    client.addListener("raw", (raw) => {
        sendToClients(JSON.stringify(raw), connections);
        // fs.appendFile("log.txt", JSON.stringify(raw) + ",\n", function (err) {
        //     if (err) console.error(err);
        // });
    });

    client.addListener("error", function (message) {
        console.log("error: ", message);
    });

    client.connect(0, () => {
        client.say("Stephano2013[PC]", "connected");
        client.join("#fuelrats", () => {
            client.say("Stephano2013[PC]", "connected to fuelrats");
        });
        client.join("#ratchat", () => {
            client.say("Stephano2013[PC]", "connected to ratchat");
        });
    });
};

function sendToClients(data, connections) {
    for (const conn of connections) {
        try {
            conn.send(data);
        } catch (err) {
            console.log(err.message);
        }
    }
}
