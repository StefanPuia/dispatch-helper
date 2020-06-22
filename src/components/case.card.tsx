import update from "immutability-helper";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { BaseMessage, Callout, CalloutJumps, CaseAssign, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import CaseDuration from "./case/case.duration";
import CaseLogs from "./case/case.logs";
import Chat from "./chat";

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
    private firstRat: string = "";
    private container: HTMLDivElement | null = null;

    constructor(props: CaseCardProps) {
        super(props);
        this.state = {
            rats: {},
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
        this.setRead = this.setRead.bind(this);
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
                onClick={this.setRead}
                ref={(el) => (this.container = el)}
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
                    <CaseDuration start={this.props.created.getTime()} />
                </div>
                <div className="case-card-body">{this.renderRats()}</div>
                <CaseLogs id={this.props.id} caseState={this.state} />
            </div>
        );
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

    private setRead(e: React.MouseEvent) {
        if (this.container) {
            this.container.classList.remove("case-unread");
        }
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

    private setUnread() {
        return async (data: BaseMessage) => {
            if (data.id === this.props.id) {
                this.setState({ unread: true });
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
            ["nickchange", this.handleNickChange()],
            ["case.unread", this.setUnread()],
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

export default CaseCard;
