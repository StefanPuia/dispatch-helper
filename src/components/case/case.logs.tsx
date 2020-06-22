import React from "react";
import Utils from "../../core/utils";
import Chat from "../chat";
import { BaseMessage, Log } from "../../core/log.parser";
import update from "immutability-helper";
import App from "../../App";
import { EventDispatcher } from "../../core/event.dispatcher";
import { CaseCardState } from "../case.card";

export interface CaseLogsProps {
    id: number;
    caseState: CaseCardState;
}

export interface CaseLogsState {
    messages: Array<{ uid: string; elem: JSX.Element }>;
}

class CaseLogs extends React.Component<CaseLogsProps, CaseLogsState> {
    private chatLines: HTMLDivElement | null = null;
    private chat: HTMLDivElement | null = null;

    constructor(props: CaseLogsProps) {
        super(props);
        this.state = { messages: [] };
    }

    render() {
        return (
            <div className="case-card-footer" ref={(el) => (this.chatLines = el)}>
                <div className="chat" ref={(el) => (this.chat = el)}>
                    {this.renderChatMessages()}
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.chatLines && this.chat && App.isFocused) {
            this.chatLines.scrollTo(0, this.chat.getBoundingClientRect().height + 1000);
        }
    }

    private renderChatMessages() {
        return this.state.messages.map((msg) => {
            return (
                <div className="chat-row" key={Utils.getUniqueKey("case-chat")}>
                    {msg.elem}
                </div>
            );
        });
    }

    private messageAlreadyRecorded(message: BaseMessage | Log) {
        const m = this.state.messages;
        for (let i = m.length - 1; i >= 0; i--) {
            if (typeof message.uid !== "undefined" && m[i].uid === message.uid) {
                return true;
            }
        }
        return false;
    }

    private grabChat() {
        return async (data: BaseMessage) => {
            if (data.id === this.props.id) {
                if (this.messageAlreadyRecorded(data)) return;
                this.setState(
                    update(this.state, {
                        messages: {
                            $push: [
                                {
                                    uid: data.uid,
                                    elem: (
                                        <>
                                            {Chat.formatChatText(data.raw.user)}: {Chat.formatChatText(data.raw.text)}
                                        </>
                                    ),
                                },
                            ],
                        },
                    })
                );
                EventDispatcher.dispatch("case.unread", this, { id: data.id });
            }
        };
    }

    private grabClientMessages() {
        return async (data: Log) => {
            const isClient = data.user === this.props.caseState.nick;
            const isAssignedRat =
                Object.keys(this.props.caseState.rats)
                    .filter((rat) => this.props.caseState.rats[rat].assigned)
                    .indexOf(data.user) > -1;
            const containsClientName = data.text.indexOf(this.props.caseState.nick) > -1;
            const isMechaSqueak = data.user === "MechaSqueak[BOT]";
            if (!isMechaSqueak && (isClient || isAssignedRat || containsClientName)) {
                if (this.messageAlreadyRecorded(data)) return;
                this.setState(
                    update(this.state, {
                        messages: {
                            $push: [
                                {
                                    uid: data.uid,
                                    elem: (
                                        <>
                                            {Chat.formatChatText(data.user)}: {Chat.formatChatText(data.text)}
                                        </>
                                    ),
                                },
                            ],
                        },
                    })
                );
                EventDispatcher.dispatch("case.unread", this, { id: this.props.id });
            }
        };
    }

    private getEventHandlers(): Array<[string, any]> {
        return [
            ["case.intelligrab", this.grabChat()],
            ["irc.message", this.grabClientMessages()],
        ];
    }

    componentWillUnmount() {
        for (const handler of this.getEventHandlers()) {
            EventDispatcher.removeListener(handler[0], handler[1]);
        }
    }

    componentDidMount() {
        for (const handler of this.getEventHandlers()) {
            EventDispatcher.listen(handler[0], handler[1]);
        }
    }
}

export default CaseLogs;
