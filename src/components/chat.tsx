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
    public static users: { [name: string]: string } = {};
    private chatLog: HTMLDivElement | null = null;
    private chat: HTMLDivElement | null = null;

    constructor(props: ChatProps) {
        super(props);
        this.state = { logs: [], ready: false };

        EventDispatcher.listen("irc.message", async (log: Log) => {
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
                                uid: `error-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`,
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
                Chat.users[data.nick] = Chat.getNickColour(data.raw.user);
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
                <table className="chatLog" ref={(el) => (this.chat = el)}>
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
                <td style={{ color: Chat.getNickColour(log.user), fontWeight: "bold" }}>
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
        if (this.chatLog && this.chat && App.isFocused) {
            this.chatLog.scrollTo(0, this.chat.getBoundingClientRect().height + 1000);
        }
    }

    public static formatChatText(text: string) {
        for (const user of Object.keys(Chat.users).sort((a, b) => b.length - a.length)) {
            const escaped = user.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
            text = text.replace(
                new RegExp(`([ ,:>]|^)${escaped}([< ,:]|$)`, "g"),
                `$1<span style="color: ${Chat.getNickColour(user)}; font-weight: bold">${user}</span>$2`
            );
        }
        text = text.replace(/(https?:\/\/\S+)/g, `<a href="$1" target="_blank">$1</a>`);
        return <span dangerouslySetInnerHTML={{ __html: text }}></span>;
    }

    public static getNickColour(nick: string) {
        if (!Chat.users[nick]) {
            Chat.users[nick] = Chat.randomColour();
        }
        return Chat.users[nick];
    }

    private static randomColour() {
        return `rgb(${randomRGB()},${randomRGB()},${randomRGB()})`;
        function randomRGB() {
            const min = 70;
            return Math.floor(Math.random() * (256 - min)) + min;
        }
    }
}

export default Chat;

type User = {
    colour: string;
};
