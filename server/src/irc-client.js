const irc = require("irc");
const config = require("./config.json");

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

    client.addListener("raw", (raw) => {
        sendToClients(JSON.stringify(raw), connections);
        if (raw && raw.rawCommand === "PRIVMSG" && raw.args && raw.args[0] === config["irc-nick"]) {
            notify(client, `${raw.nick || ""}: ${raw.args[1] || JSON.stringify(raw)}`);
        }
    });

    client.addListener("error", function (message) {
        console.log("error: ", message);
    });

    client.connect(0, () => {
        notify(client, "connected");
        client.join("#fuelrats", () => {
            notify(client, "connected to fuelrats");
        });
        client.join("#ratchat", () => {
            notify(client, "connected to ratchat");
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

function notify(client, message) {
    const targets = config["irc-notify"];
    for (const target of targets) {
        try {
            client.say(target, message);
        } catch (err) {
            console.log(err.message);
        }
    }
}
