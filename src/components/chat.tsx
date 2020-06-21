import moment from "moment";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { Log, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import update from "immutability-helper";
import App from "../App";

export interface ChatProps {}

export interface ChatState {
    logs: Array<Log>;
    ready: boolean;
}

class Chat extends React.Component<ChatProps, ChatState> {
    public static users: { [name: string]: User } = {};
    private chatLog: HTMLDivElement | null = null;

    constructor(props: ChatProps) {
        super(props);
        this.state = { logs: [], ready: false };

        EventDispatcher.listen("irc.message", async (log: Log) => {
            if (!Chat.users[log.user]) {
                Chat.users[log.user] = {
                    colour: this.randomColour(),
                };
            }
            if (this.state.ready) {
                this.setState(
                    update(this.state, {
                        logs: {
                            $push: [log],
                        },
                    })
                );
            }
        });

        EventDispatcher.listen("error", async (errorText) => {
            this.setState(
                update(this.state, {
                    logs: {
                        $push: [
                            {
                                time: new Date(),
                                text: `<span style="color: red">${errorText}</span>`,
                                user: "SYSTEM",
                                type: "event",
                            },
                        ],
                    },
                })
            );
        });

        EventDispatcher.listen("nickchange", async (data: NickChange) => {
            if (Chat.users[data.raw.user]) {
                Chat.users[data.nick] = { ...Chat.users[data.raw.user] };
            }
            if (this.state.ready) {
                this.setState(
                    update(this.state, {
                        logs: {
                            $push: [data.raw],
                        },
                    })
                );
            }
        });
    }

    render() {
        return (
            <div
                id="chat"
                style={{ overflowY: "scroll", gridArea: "chat" }}
                ref={(el) => {
                    this.chatLog = el;
                }}
            >
                <table className="chatLog">
                    <tbody>
                        {this.state.logs.slice(-1000).map((log) => this.renderLog(log))}
                        <tr></tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private renderLog(log: Log) {
        return (
            <tr key={Utils.getUniqueKey("chat-log")}>
                <td>{moment(log.time).format("HH:mm:ss")}</td>
                <td style={{ color: Chat.users[log.user]?.colour, fontWeight: "bold" }}>
                    {log.user}
                    {this.isMainChannel(log)}
                </td>
                <td>{Chat.formatChatText(log.text)}</td>
            </tr>
        );
    }

    private isMainChannel(log: Log) {
        return typeof log.channel !== "undefined" && log.channel !== "#fuelrats" ? " *" : "";
    }

    componentDidMount() {
        this.setState({ ready: true });
    }

    componentDidUpdate() {
        if (this.chatLog && App.isFocused) {
            this.chatLog.scrollTo(0, this.state.logs.length * 35);
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

type User = {
    colour: string;
};
