import update from "immutability-helper";
import moment from "moment";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { Callout, CalloutJumps, BaseMessage, CaseAssign, Log, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import Chat from "./chat";
import App from "../App";

export interface CaseCardProps {
    id: number;
    client: string;
    lang: string;
    created: Date;
    nick: string;
    system: string;
    cr: boolean;
    sysconf: boolean;
    platform: "PC" | "XB" | "PS";
}

export interface CaseCardState {
    rats: { [user: string]: CaseRatState };
    messages: Array<{ uid: string; elem: JSX.Element }>;
    duration: string;
    connected: boolean;
    active: boolean;
    cr: boolean;
    nick: string;
    system: string;
    sysconf: boolean;
    platform: "PC" | "XB" | "PS";
    unread: boolean;
}

interface CaseRatState {
    assigned: boolean;
    jumps?: number;
    state: {
        fr?: boolean;
        wr?: boolean;
        bc?: boolean;
        fuel?: boolean;
    };
}

type RatState = "fr" | "wr" | "bc" | "fuel";

class CaseCard extends React.Component<CaseCardProps, CaseCardState> {
    private interval: NodeJS.Timeout | undefined;
    private firstRat: string = "";
    private chatLines: HTMLDivElement | null = null;
    private chat: HTMLDivElement | null = null;

    constructor(props: CaseCardProps) {
        super(props);
        this.state = {
            rats: {},
            messages: [],
            duration: this.calculateDuration(),
            connected: true,
            active: true,
            cr: this.props.cr,
            nick: this.props.nick,
            system: this.props.system,
            sysconf: this.props.sysconf,
            platform: this.props.platform,
            unread: false,
        };
        this.handleJumpCall = this.handleJumpCall.bind(this);
        this.handleCaseAssign = this.handleCaseAssign.bind(this);
        this.handleStandDown = this.handleStandDown.bind(this);
        this.closeCase = this.closeCase.bind(this);
    }

    render() {
        return (
            <div
                className={
                    "case-card" +
                    (this.state.active ? "" : " case-inactive") +
                    (this.state.cr ? " code-red" : "") +
                    (this.state.unread ? " case-unread" : "")
                }
                onClick={(e) => {
                    this.setState({ unread: false });
                }}
            >
                <div className="case-card-header">
                    <div
                        className="client-name"
                        style={
                            !this.state.connected
                                ? {
                                      color: "red",
                                      textDecoration: "underline",
                                  }
                                : { color: Chat.getNickColour(this.state.nick) }
                        }
                    >
                        {this.state.nick}
                    </div>
                    <div className={`case-language language-${this.props.lang}`}>{this.props.lang}</div>
                    <div onClick={this.closeCase} className={`case-number platform-${this.state.platform}`}>
                        #{this.props.id}
                    </div>
                    <div
                        className="case-system"
                        style={{
                            color: this.state.sysconf ? "" : "red",
                        }}
                    >
                        {this.state.system}
                    </div>
                    <div></div>
                    <div className="case-time">{this.state.duration}</div>
                </div>
                <div className="case-card-body">{this.renderRats()}</div>
                <div className="case-card-footer" ref={(el) => (this.chatLines = el)}>
                    <div className="chat" ref={(el) => (this.chat = el)}>
                        {this.renderChatMessages()}
                    </div>
                </div>
            </div>
        );
    }

    componentDidUpdate() {
        if (this.chatLines && this.chat && App.isFocused) {
            this.chatLines.scrollTo(0, this.chat.getBoundingClientRect().height + 1000);
        }
    }

    private calculateDuration() {
        return moment.utc(moment().diff(moment.utc(this.props.created))).format("HH:mm:ss");
    }

    private renderRats() {
        return Object.keys(this.state.rats).map((ratName: string) => {
            return (
                <div className="rat-row" key={Utils.getUniqueKey("rat-row")}>
                    <div className="rat-name">
                        {this.renderRatName(ratName)}
                        {this.renderRatJumps(ratName)}
                    </div>
                    {Object.keys(this.state.rats[ratName].state).map((status: string) => {
                        return (
                            <div
                                className={`rat-status rat-status-${status} ${this.getStatusOverride(ratName, status)}`}
                                key={Utils.getUniqueKey("rat-status")}
                            >
                                {this.getRatStatusDisplay(ratName, status)}
                            </div>
                        );
                    })}
                </div>
            );
        });
    }

    private renderRatJumps(rat: string) {
        const { jumps, assigned } = this.state.rats[rat];
        return jumps && !assigned ? ` - ${jumps}j` : "";
    }

    private renderRatName(rat: string) {
        return (
            <span
                style={{
                    color: this.state.rats[rat].assigned ? "green" : "",
                }}
            >
                {rat} {rat === this.firstRat ? "*" : ""}
            </span>
        );
    }

    private getRatStatusDisplay(rat: string, status: string) {
        const state = this.state.rats[rat].state[status as RatState];
        if (typeof state !== "undefined") {
            return `${status.toUpperCase()}${state ? "+" : "-"}`;
        }
    }

    private getStatusOverride(rat: string, _status: string) {
        return `rat-status-${this.state.rats[rat].state[_status as RatState]}`;
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

    private closeCase() {
        if (window.confirm("Are you sure you want to close this case?")) {
            EventDispatcher.dispatch("case.closed", this, {
                id: this.props.id,
            });
        }
    }

    private async handleJumpCall(data: CalloutJumps) {
        const rats = this.state.rats;
        if (data.rat === this.state.nick) return;
        // if not this case, unassign rat
        if (data.id !== this.props.id) {
            if (rats[data.rat]) {
                delete rats[data.rat];
                this.setState(
                    update(this.state, {
                        rats: { $set: rats },
                    })
                );
            }
        } else {
            if (!rats[data.rat]) {
                rats[data.rat] = {
                    assigned: false,
                    jumps: data.jumps,
                    state: {},
                };
                this.setState(
                    update(this.state, {
                        rats: { $set: rats },
                    })
                );
            }
        }
    }

    private setRatStatus(prop: RatState, value: boolean) {
        return async (data: Callout) => {
            if (data.id !== this.props.id || data.rat === this.state.nick) return;
            const rats = this.state.rats;
            if (!this.state.rats[data.rat]) {
                rats[data.rat] = {
                    assigned: false,
                    state: {},
                };
            }
            rats[data.rat].state[prop] = value;
            if (prop === "fuel") {
                for (const key of ["fr", "wr", "bc"]) {
                    rats[data.rat].state[key as RatState] = undefined;
                }
                if (!this.firstRat) {
                    this.firstRat = data.rat;
                }
            }
            this.setState(
                update(this.state, {
                    rats: { $set: rats },
                })
            );
        };
    }

    private handleConnectDisconnect(isConnect: boolean = true) {
        return async (data: BaseMessage) => {
            if (this.state.nick === data.raw.user) {
                this.setState({ connected: isConnect });
            }
        };
    }

    private handleCaseAssign(assign: boolean) {
        return async (data: CaseAssign) => {
            if (data.id !== this.props.id) return;
            const rats = this.state.rats;
            for (const rat of data.rats) {
                if (rat !== this.state.nick) {
                    if (!rats[rat]) {
                        rats[rat] = {
                            assigned: assign,
                            state: {},
                        };
                    } else {
                        rats[rat].assigned = assign;
                    }
                }
            }
            this.setState(
                update(this.state, {
                    rats: { $set: rats },
                })
            );
        };
    }

    private async handleStandDown(data: Callout) {
        if ((data.id && data.id !== this.props.id) || data.rat === this.state.nick) return;
        const rats = this.state.rats;
        if (!rats[data.rat]) return;
        delete rats[data.rat];
        this.setState(
            update(this.state, {
                rats: { $set: rats },
            })
        );
    }

    private changeState(
        stateName: "active" | "cr" | "sysconf" | "system",
        override?: any,
        useData?: boolean,
        overrideDataName?: string
    ) {
        return async (data: BaseMessage) => {
            if (data.id !== this.props.id) return;
            let state: any = "";
            if (typeof override !== "undefined") {
                state = override;
            } else if (useData) {
                state = (data as any)[overrideDataName || stateName];
            } else {
                state = !this.state[stateName];
            }
            const updateObject: any = {};
            updateObject[stateName] = { $set: state };
            this.setState(update(this.state, updateObject));
        };
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
                        unread: { $set: true },
                    })
                );
            }
        };
    }

    private grabClientMessages() {
        return async (data: Log) => {
            const isClient = data.user === this.state.nick;
            const isAssignedRat =
                Object.keys(this.state.rats)
                    .filter((rat) => this.state.rats[rat].assigned)
                    .indexOf(data.user) > -1;
            const containsClientName = data.text.indexOf(this.state.nick) > -1;
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
                        unread: { $set: true },
                    })
                );
            }
        };
    }

    private handleNickChange() {
        return async (data: NickChange) => {
            if (this.state.nick === data.raw.user) {
                this.setState({ nick: data.nick });
            }
            const rat = Object.keys(this.state.rats).find((rat) => rat === data.raw.user);
            if (rat) {
                const rats = this.state.rats;
                const aux = { ...rats[rat] };
                delete rats[rat];
                rats[data.nick] = aux;
                this.setState(
                    update(this.state, {
                        rats: { $set: rats },
                    })
                );
            }
        };
    }

    private getEventHandlers(): Array<[string, any]> {
        return [
            ["callout.fr+", this.setRatStatus("fr", true)],
            ["callout.fr-", this.setRatStatus("fr", false)],
            ["callout.wr+", this.setRatStatus("wr", true)],
            ["callout.wr-", this.setRatStatus("wr", false)],
            ["callout.bc+", this.setRatStatus("bc", true)],
            ["callout.bc-", this.setRatStatus("bc", false)],
            ["callout.fuel+", this.setRatStatus("fuel", true)],
            ["callout.jumps", this.handleJumpCall],
            ["case.connect", this.handleConnectDisconnect(true)],
            ["case.disconnect", this.handleConnectDisconnect(false)],
            ["case.assign", this.handleCaseAssign(true)],
            ["case.unassign", this.handleCaseAssign(false)],
            ["callout.stdn", this.handleStandDown],
            ["case.active", this.changeState("active")],
            ["case.cr", this.changeState("cr")],
            ["case.sysconf", this.changeState("sysconf", true)],
            ["case.sys", this.changeState("system", undefined, true, "sys")],
            ["case.intelligrab", this.grabChat()],
            ["irc.message", this.grabClientMessages()],
            ["nickchange", this.handleNickChange()],
        ];
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }
        for (const handler of this.getEventHandlers()) {
            EventDispatcher.removeListener(handler[0], handler[1]);
        }
    }

    componentDidMount() {
        // this.interval = setInterval(() => {
        //     this.setState({ duration: this.calculateDuration() });
        // }, 1000);

        for (const handler of this.getEventHandlers()) {
            EventDispatcher.listen(handler[0], handler[1]);
        }
    }
}

export default CaseCard;
