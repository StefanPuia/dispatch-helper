import moment from "moment";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { Log, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import update from "immutability-helper";

export interface ChatProps {}

export interface ChatState {
    logs: Array<Log>;
}

class Chat extends React.Component<ChatProps, ChatState> {
    public static users: { [name: string]: User } = {};
    private chatLogEnd: HTMLTableRowElement | null = null;

    constructor(props: ChatProps) {
        super(props);
        this.state = { logs: [] };
    }

    render() {
        return (
            <div style={{ overflowY: "scroll", gridArea: "chat" }}>
                <table className="chatLog">
                    <tbody>
                        {this.state.logs.slice(-1000).map((log) => this.renderLog(log))}
                        <tr
                            ref={(el) => {
                                this.chatLogEnd = el;
                            }}
                        ></tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private renderLog(log: Log) {
        return (
            <tr key={Utils.getUniqueKey("chat-log")}>
                <td>{moment(log.time).format("HH:mm:ss")}</td>
                <td style={{ color: Chat.users[log.user]?.colour, fontWeight: "bold" }}>{log.user}</td>
                <td>{Chat.formatChatText(log.text)}</td>
            </tr>
        );
    }

    componentDidMount() {
        EventDispatcher.listen("hexchat", async (log: Log) => {
            if (!Chat.users[log.user]) {
                Chat.users[log.user] = {
                    colour: this.randomColour(),
                };
            }
            this.setState(
                update(this.state, {
                    logs: {
                        $push: [log],
                    },
                })
            );
        });
    }

    componentDidUpdate() {
        if (this.chatLogEnd) {
            this.chatLogEnd.scrollIntoView({ behavior: "smooth" });
        }
    }

    public static formatChatText(text: string) {
        for (const user of Object.keys(Chat.users).sort((a, b) => b.length - a.length)) {
            const escaped = user.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            text = text.replace(
                new RegExp(`([ ,:>]|^)${escaped}([< ,:]|$)`, "g"),
                `$1<span style="color: ${Chat.users[user].colour}; font-weight: bold">${user}</span>$2`
            );
        }
        text = text.replace(/(https?:\/\/\S+)/g, `<a href="$1" target="_blank">$1</a>`);
        return <span dangerouslySetInnerHTML={{ __html: text }}></span>;
    }

    private randomColour() {
        return `#${randomRGB().toString(16)}${randomRGB().toString(16)}${randomRGB().toString(16)}`;

        function randomRGB() {
            return Math.floor(Math.random() * 232) + 25;
        }
    }
}

export default Chat;

EventDispatcher.listen("nickchange", async (data: NickChange) => {
    if (Chat.users[data.raw.user]) {
        Chat.users[data.nick] = { ...Chat.users[data.raw.user] };
    }
});
console.log(Chat.users);

type User = {
    colour: string;
};
