/* eslint-disable no-restricted-globals */
class Chat {
    static users = {};

    static getNickColour(nick) {
        if (!Chat.users[nick]) {
            Chat.users[nick] = Chat.randomColour();
        }
        return Chat.users[nick];
    }

    static randomColour() {
        return `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
        function randomRGB() {
            const min = 70;
            return Math.floor(Math.random() * (256 - min)) + min;
        }
    }

    static formatChatText(text) {
        for (const user of Object.keys(Chat.users).sort((a, b) => b.length - a.length)) {
            const escaped = user.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            text = text.replace(
                new RegExp(`([ ,:>]|^)${escaped}([< ,:]|$)`, "g"),
                `$1<span style="color: ${Chat.getNickColour(user)}; font-weight: bold">${user}</span>$2`
            );
        }
        return text.replace(/(https?:\/\/\S+)/g, `<a href="$1" target="_blank">$1</a>`);
    }
}

self.addEventListener("message", (e) => {
    const { id, event, data } = e.data;
    // console.log("worker: ", id, event, data);
    switch (event) {
        case "colour":
            respond(id, event, Chat.getNickColour(data));
            break;

        case "format":
            data.text = Chat.formatChatText(data.text);
            respond(id, event, data);
            break;

        default:
            break;
    }
});

function respond(id, event, data) {
    self.postMessage({
        id: id,
        event: event,
        data: data,
    });
}
