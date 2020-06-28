import moment from "moment";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { Log, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import update from "immutability-helper";
import App from "../App";

export interface ChatProps {}

export interface ChatState {
    logs: Array<{ uid: string; line: JSX.Element }>;
    ready: boolean;
    visible: boolean;
}

class Chat extends React.Component<ChatProps, ChatState> {
    public static users: { [name: string]: string } = {};
    private chatLog: HTMLDivElement | null = null;
    private chat: HTMLDivElement | null = null;
    private static worker: Worker;

    constructor(props: ChatProps) {
        super(props);
        this.state = { logs: [], ready: false, visible: true };

        this.handleError = this.handleError.bind(this);
        this.handleNewMessage = this.handleNewMessage.bind(this);
        this.handleNickChange = this.handleNickChange.bind(this);
        this.toggleChat = this.toggleChat.bind(this);
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
                <span id="chatToggle" onClick={this.toggleChat}>
                    Toggle chat
                </span>
                <table className="chatLog" ref={(el) => (this.chat = el)}>
                    <tbody>
                        {this.state.logs.slice(-1000).map((log) => log.line)}
                        <tr></tr>
                    </tbody>
                </table>
            </div>
        );
    }

    private renderLog(log: Log) {
        return (
            <tr key={Utils.getUniqueKey("chat-log")}>
                <td>{moment(log.time || undefined).format("HH:mm:ss")}</td>
                <td style={{ color: Chat.getNickColour(log.user), fontWeight: "bold" }}>
                    {log.user}
                    {this.isMainChannel(log)}
                </td>
                <td>
                    <span dangerouslySetInnerHTML={{ __html: log.text }}></span>
                </td>
            </tr>
        );
    }

    private isMainChannel(log: Log) {
        return typeof log.channel !== "undefined" && log.channel !== "#fuelrats" ? " *" : "";
    }

    componentDidMount() {
        this.setState({ ready: true });
        EventDispatcher.listen("error", this.handleError);
        EventDispatcher.listen("irc.message", this.handleNewMessage);
        EventDispatcher.listen("nickchange", this.handleNickChange);

        EventDispatcher.listen("chatworker.format", async (data: Log) => {
            if (this.state.logs.findIndex((log) => log.uid === data.uid) > -1) return;
            this.setState(
                update(this.state, {
                    logs: {
                        $push: [
                            {
                                uid: data.uid,
                                line: this.renderLog(data),
                            },
                        ],
                    },
                })
            );
        });
    }

    componentDidUpdate() {
        if (this.chatLog && this.chat && App.isFocused) {
            this.chatLog.scrollTo(0, this.chat.getBoundingClientRect().height + 1000);
        }
    }

    private async handleNewMessage(log: Log) {
        EventDispatcher.dispatch("chatworker.requestFormat", this, {
            id: log.uid,
            event: "format",
            data: log,
        });
    }

    private async handleError(errorText: string) {
        const errorUID = `error-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
        this.setState(
            update(this.state, {
                logs: {
                    $push: [
                        {
                            uid: errorUID,
                            line: this.renderLog({
                                uid: errorUID,
                                time: new Date(),
                                text: `<span style="color: red">${errorText}</span>`,
                                user: "SYSTEM",
                                type: "event",
                            }),
                        },
                    ],
                },
            })
        );
    }

    private toggleChat(e: React.MouseEvent) {
        const caseWrapper: HTMLDivElement | null = document.querySelector("div#case-cards");
        if (this.chatLog && caseWrapper) {
            const size = this.state.visible ? "45px" : "25vh";
            this.chatLog.style.top = `calc(100vh - ${size})`;
            if (caseWrapper) {
                caseWrapper.style.marginBottom = `${size}`;
            }
            this.setState(update(this.state, { visible: { $set: !this.state.visible } }));
        }
    }

    private async handleNickChange(data: NickChange) {
        if (Chat.users[data.raw.user]) {
            Chat.users[data.nick] = Chat.getNickColour(data.raw.user);
        }
        EventDispatcher.dispatch("chatworker.requestFormat", this, {
            id: data.uid,
            event: "format",
            data: data.raw,
        });
    }

    public static getNickColour(nick: string) {
        if (!Chat.users[nick]) {
            Chat.users[nick] = Chat.randomColour();
            Chat.worker.postMessage({
                id: nick,
                event: "colour",
                data: Chat.users[nick],
            });
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

    public static init() {
        if (!Chat.worker) {
            Chat.worker = new Worker("chat.worker.js");
            try {
                EventDispatcher.listen("chatworker.requestFormat", async (data: any) => {
                    Chat.worker.postMessage(data);
                });
                (Chat.worker as any).addEventListener("message", (e: any) => {
                    const { id, event, data } = e.data;
                    // console.log("script: ", id, event, data);
                    switch (event) {
                        case "colour":
                            Chat.users[id] = data;
                            break;

                        case "format":
                            EventDispatcher.dispatch("chatworker.format", this, data);
                            break;
                    }
                });
            } catch (err) {
                EventDispatcher.dispatch("error", this, err.message);
            }
        }
    }
}

export default Chat;

Chat.init();

type User = {
    colour: string;
};
