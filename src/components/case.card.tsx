import update from "immutability-helper";
import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { BaseMessage, Callout, CalloutJumps, CaseAssign, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import CaseDuration from "./case/case.duration";
import CaseLogs from "./case/case.logs";
import Chat from "./chat";
import CaseController from "./case.controller";

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
    caseKey: string;
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
    private mounted = false;

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

        this.closeCase = this.closeCase.bind(this);
        this.handleAssign = this.handleAssign.bind(this);
        this.handleCaseAssign = this.handleCaseAssign.bind(this);
        this.handleConnect = this.handleConnect.bind(this);
        this.handleDisonnect = this.handleDisonnect.bind(this);
        this.handleJumpCall = this.handleJumpCall.bind(this);
        this.handleNickChange = this.handleNickChange.bind(this);
        this.handleStandDown = this.handleStandDown.bind(this);
        this.handleUnssign = this.handleUnssign.bind(this);
        this.setBcMinus = this.setBcMinus.bind(this);
        this.setBcPlus = this.setBcPlus.bind(this);
        this.setCaseActive = this.setCaseActive.bind(this);
        this.setCaseCR = this.setCaseCR.bind(this);
        this.setCaseSysconf = this.setCaseSysconf.bind(this);
        this.setCaseSystem = this.setCaseSystem.bind(this);
        this.setFrMinus = this.setFrMinus.bind(this);
        this.setFrPlus = this.setFrPlus.bind(this);
        this.setFuel = this.setFuel.bind(this);
        this.setUnread = this.setUnread.bind(this);
        this.setWrMinus = this.setWrMinus.bind(this);
        this.setWrPlus = this.setWrPlus.bind(this);

        for (const handler of this.getEventHandlers()) {
            EventDispatcher.listen(handler[0], handler[1]);
        }
    }

    render() {
        return (
            <div
                key={this.props.caseKey}
                className={
                    "case-card" +
                    (this.state.active ? "" : " case-inactive") +
                    (this.state.cr ? " code-red" : "") +
                    (this.state.unread ? " case-unread" : "")
                }
                onClick={(e: React.MouseEvent) => {
                    if (this.state.unread) {
                        this.updateState({ unread: { $set: false } });
                    }
                }}
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
                <CaseLogs key={this.props.caseKey} id={this.props.id} caseState={this.state} />
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

    private closeCase() {
        if (window.confirm("Are you sure you want to close this case?")) {
            EventDispatcher.dispatch("case.closed", this, {
                id: this.props.id,
            });
        }
    }

    private updateState(newState: any, stateObj?: any) {
        if (this.mounted) {
            this.setState(update(stateObj || this.state, newState));
        }
    }

    private async handleJumpCall(data: CalloutJumps) {
        const rats = this.state.rats;
        if (data.rat === this.state.nick) return;
        // if not this case, unassign rat
        if (data.id !== this.props.id) {
            if (rats[data.rat] && !rats[data.rat].assigned) {
                delete rats[data.rat];
                this.updateState({
                    rats: { $set: rats },
                    unread: { $set: true },
                });
            }
        } else {
            if (!rats[data.rat]) {
                rats[data.rat] = {
                    assigned: false,
                    jumps: data.jumps,
                    state: {},
                };
                this.updateState({
                    rats: { $set: rats },
                    unread: { $set: true },
                });
            }
        }
    }

    private setRatStatus(prop: RatState, value: boolean, data: Callout) {
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
        this.updateState({
            rats: { $set: rats },
            unread: { $set: true },
        });
    }

    private handleConnectDisconnect(isConnect: boolean = true, data: BaseMessage) {
        if (this.state.nick === data.raw.user) {
            this.updateState({ connected: { $set: isConnect }, unread: { $set: true } });
        }
    }

    private handleCaseAssign(assign: boolean, data: CaseAssign) {
        const rats = this.state.rats;
        if (data.id !== this.props.id) {
            for (const rat of data.rats) {
                if (rats[rat] && !rats[rat].assigned) {
                    delete rats[rat];
                }
            }
        } else {
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
            this.updateState({
                rats: { $set: rats },
                unread: { $set: true },
            });
        }
    }

    private async handleStandDown(data: Callout) {
        if ((data.id && data.id !== this.props.id) || data.rat === this.state.nick) return;
        const rats = this.state.rats;
        if (!rats[data.rat] || rats[data.rat].assigned) return;
        delete rats[data.rat];
        this.updateState({
            rats: { $set: rats },
            unread: { $set: true },
        });
    }

    private changeState(
        stateName: "active" | "cr" | "sysconf" | "system",
        data: BaseMessage,
        override?: any,
        useData?: boolean,
        overrideDataName?: string
    ) {
        if (data.id !== this.props.id) return;
        let state: any = "";
        if (typeof override !== "undefined") {
            state = override;
        } else if (useData) {
            state = (data as any)[overrideDataName || stateName];
        } else {
            state = !this.state[stateName];
        }
        const updateObject: any = {
            unread: { $set: true },
        };
        updateObject[stateName] = { $set: state };
        this.updateState(updateObject);
    }

    private async handleNickChange(data: NickChange) {
        if (this.state.nick === data.raw.user) {
            this.updateState({ nick: { $set: data.nick }, unread: { $set: true } });
        }
        const rat = Object.keys(this.state.rats).find((rat) => rat === data.raw.user);
        if (rat) {
            const rats = this.state.rats;
            const aux = { ...rats[rat] };
            delete rats[rat];
            rats[data.nick] = aux;
            this.updateState({
                rats: { $set: rats },
                unread: { $set: true },
            });
        }
    }

    private async setUnread(data: BaseMessage) {
        if (data.id === this.props.id) {
            this.updateState({ unread: { $set: true } });
        }
    }

    private async setFrPlus(data: Callout) {
        this.setRatStatus("fr", true, data);
    }

    private async setFrMinus(data: Callout) {
        this.setRatStatus("fr", false, data);
    }

    private async setWrPlus(data: Callout) {
        this.setRatStatus("wr", true, data);
    }

    private async setWrMinus(data: Callout) {
        this.setRatStatus("wr", false, data);
    }

    private async setBcPlus(data: Callout) {
        this.setRatStatus("bc", true, data);
    }

    private async setBcMinus(data: Callout) {
        this.setRatStatus("bc", false, data);
    }

    private async setFuel(data: Callout) {
        this.setRatStatus("fuel", true, data);
    }

    private async handleConnect(data: BaseMessage) {
        this.handleConnectDisconnect(true, data);
    }

    private async handleDisonnect(data: BaseMessage) {
        this.handleConnectDisconnect(false, data);
    }

    private async handleAssign(data: CaseAssign) {
        this.handleCaseAssign(true, data);
    }

    private async handleUnssign(data: CaseAssign) {
        this.handleCaseAssign(false, data);
    }

    private async setCaseActive(data: BaseMessage) {
        this.changeState("active", data);
    }

    private async setCaseCR(data: BaseMessage) {
        this.changeState("cr", data);
    }

    private async setCaseSysconf(data: BaseMessage) {
        this.changeState("sysconf", data, true);
    }

    private async setCaseSystem(data: BaseMessage) {
        this.changeState("system", data, undefined, true, "sys");
    }

    private getEventHandlers(): Array<[string, any]> {
        return [
            ["callout.fr+", this.setFrPlus],
            ["callout.fr-", this.setFrMinus],
            ["callout.wr+", this.setWrPlus],
            ["callout.wr-", this.setWrMinus],
            ["callout.bc+", this.setBcPlus],
            ["callout.bc-", this.setBcMinus],
            ["callout.fuel+", this.setFuel],
            ["callout.jumps", this.handleJumpCall],
            ["case.connect", this.handleConnect],
            ["case.disconnect", this.handleDisonnect],
            ["case.assign", this.handleAssign],
            ["case.unassign", this.handleUnssign],
            ["callout.stdn", this.handleStandDown],
            ["case.active", this.setCaseActive],
            ["case.cr", this.setCaseCR],
            ["case.sysconf", this.setCaseSysconf],
            ["case.sys", this.setCaseSystem],
            ["nickchange", this.handleNickChange],
            ["case.unread", this.setUnread],
        ];
    }

    componentWillUnmount() {
        this.mounted = false;
        for (const handler of this.getEventHandlers()) {
            EventDispatcher.removeListener(handler[0], handler[1]);
        }
    }

    componentDidMount() {
        this.mounted = true;
        CaseController.caseData[this.props.id].props = this.props;
        CaseController.caseData[this.props.id].state = this.state;
    }
}

export default CaseCard;
