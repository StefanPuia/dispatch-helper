import update from "immutability-helper";
import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";

import CaseHelper from "../core/case-helper";
import { EventDispatcher } from "../core/event.dispatcher";
import { BaseMessage, Callout, CalloutJumps, CaseAssign, NickChange } from "../core/log.parser";
import Utils from "../core/utils";
import CaseController from "./case.controller";
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
    platform: "PC" | "XB" | "PS4";
    caseKey: string;
}

export interface CaseCardState {
    id: number;
    client: string;
    rats: { [user: string]: CaseRatState };
    connected: boolean;
    active: boolean;
    cr: boolean;
    nick: string;
    system: string;
    sysconf: boolean;
    platform: "PC" | "XB" | "PS4";
    unread: boolean;
    prep: boolean;
    prepLanguage?: string;
    lang: string;
    distanceToWaypoint?: string;
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
            id: this.props.id,
            client: this.props.client,
            rats: {},
            connected: true,
            active: true,
            cr: this.props.cr,
            nick: this.props.nick,
            system: this.props.system,
            sysconf: this.props.sysconf,
            platform: this.props.platform,
            unread: true,
            prep: false,
            lang: this.props.lang,
        };

        this.closeCase = this.closeCase.bind(this);
        this.setLangPrompt = this.setLangPrompt.bind(this);
        this.setLang = this.setLang.bind(this);
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
        this.setPlatform = this.setPlatform.bind(this);
        this.getAutoSpatch = this.getAutoSpatch.bind(this);
        this.prepClient = this.prepClient.bind(this);
        this.prepClientCR = this.prepClientCR.bind(this);
        this.setId = this.setId.bind(this);
        this.setClient = this.setClient.bind(this);
    }

    render() {
        if (CaseController.caseData[this.state.id]) {
            CaseController.caseData[this.state.id].props = this.props;
            CaseController.caseData[this.state.id].state = this.state;
        }
        const systemNote = CaseHelper.getSystemNote(this.state.system);
        const autoSpatch = this.getAutoSpatch();
        return (
            <div
                key={this.props.caseKey}
                className={[
                    "case-card",
                    Utils.ternary(!this.state.active, "case-inactive"),
                    Utils.ternary(this.state.cr, "code-red"),
                    Utils.ternary(this.state.unread, "case-unread"),
                ].join(" ")}
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
                    <div onClick={this.setLangPrompt} className={`case-language language-${this.state.lang}`}>
                        {this.state.lang}
                    </div>
                    <div onClick={this.closeCase} className={`case-number platform-${this.state.platform}`}>
                        #{this.state.id}
                    </div>
                    <div
                        className={`case-system`}
                        style={{
                            color: Utils.ternary(!this.state.sysconf, "red"),
                        }}
                    >
                        <CopyToClipboard key={Utils.getUniqueKey("CopyToClipboard")} text={this.state.system}>
                            <span className={Utils.ternary(!!systemNote, "system-note")} title={systemNote}>
                                {this.state.system}
                            </span>
                        </CopyToClipboard>
                        <span style={{ paddingLeft: "1ch" }}>{this.state.distanceToWaypoint}</span>
                    </div>
                    <div></div>
                    <CaseDuration start={this.props.created.getTime()} />
                </div>
                <div className="case-card-body">{this.renderRats()}</div>
                <CaseLogs key={this.props.caseKey} id={this.state.id} caseState={this.state} />
                <div className="auto-spatch">
                    {autoSpatch.map((auto) => {
                        return (
                            <CopyToClipboard key={Utils.getUniqueKey("CopyToClipboard")} text={auto.clipboard}>
                                <button className="btn-auto-spatch" title={auto.clipboard}>
                                    {auto.info}
                                </button>
                            </CopyToClipboard>
                        );
                    })}
                </div>
            </div>
        );
    }

    private renderRats() {
        const rats = Object.keys(this.state.rats).sort((a, b) => {
            if (this.state.rats[a].assigned && !this.state.rats[b].assigned) {
                return -1;
            }
            return 1;
        });
        return rats.map((ratName: string) => {
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

    private getAutoSpatch() {
        return CaseHelper.buildAutoDispatch(this.state);
    }

    private setLangPrompt() {
        const prompt = window.prompt("Change the language of this case to:", this.state.lang);
        if (prompt) {
            EventDispatcher.dispatch("case.lang", this, {
                id: this.state.id,
                lang: prompt.substr(0, 2).toUpperCase(),
            });
        }
    }

    private closeCase() {
        if (window.confirm("Are you sure you want to close this case?")) {
            EventDispatcher.dispatch("case.closed", this, {
                id: this.state.id,
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
        if (data.id !== this.state.id) {
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
        if (data.id !== this.state.id || data.rat === this.state.nick) return;
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
        if (data.id !== this.state.id && assign) {
            for (const rat of data.rats) {
                if (rats[rat] && !rats[rat].assigned) {
                    delete rats[rat];
                }
            }
        } else {
            for (const rat of data.rats) {
                if (rat !== this.state.nick) {
                    if (!rats[rat] && assign) {
                        rats[rat] = {
                            assigned: assign,
                            state: {},
                        };
                    } else if (rats[rat]) {
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
        if ((data.id && data.id !== this.state.id) || data.rat === this.state.nick) return;
        const rats = this.state.rats;
        if (!rats[data.rat] || rats[data.rat].assigned) return;
        delete rats[data.rat];
        this.updateState({
            rats: { $set: rats },
            unread: { $set: true },
        });
    }

    private changeState(
        stateName: "active" | "cr" | "sysconf" | "system" | "platform" | "lang" | "client" | "id",
        data: BaseMessage,
        override?: any,
        useData?: boolean,
        overrideDataName?: string
    ) {
        if (data.id !== this.state.id) return;
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

        if (stateName === "active") {
            EventDispatcher.dispatch("case.update", this, this.state.id);
        }
        CaseController.caseData[this.state.id] = {
            key: CaseController.caseData[this.state.id]?.key || Utils.getUniqueKey("case-card"),
            state: this.state,
            props: this.props,
        };
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
        if (data.id === this.state.id) {
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

    private async setLang(data: BaseMessage) {
        this.changeState("lang", data, undefined, true, "lang");
    }

    private async setCaseActive(data: BaseMessage) {
        this.changeState("active", data);
    }

    private async setCaseCR(data: BaseMessage) {
        this.changeState("cr", data);
    }

    private async setCaseSysconf(data: BaseMessage) {
        this.changeState("sysconf", data, !!(data as any).sysconf);
    }

    private async setId(data: BaseMessage) {
        if (data.id !== this.state.id) return;
        delete CaseController.caseData[data.id];
        this.changeState("id", data, undefined, true, "newId");
    }

    private async setClient(data: BaseMessage) {
        this.changeState("client", data);
    }

    private async setCaseSystem(data: BaseMessage) {
        if (data.id !== this.state.id) return;
        this.changeState("system", data, undefined, true, "sys");
        this.setState({ sysconf: true });
        this.getWaypointDistance();
    }

    private async setPlatform(data: any) {
        let platform = data.platform.toUpperCase();
        if (platform === "PS") platform = "PS4";
        this.changeState("platform", data, platform);
    }

    private async prepClient({ nick, language }: any) {
        if (!this.state.cr && this.state.nick.toLowerCase() === (nick || "").toLowerCase()) {
            this.setState({
                prep: true,
                prepLanguage: language || "EN",
            });
        }
    }

    private async prepClientCR({ nick, language }: any) {
        if (this.state.cr && this.state.nick.toLowerCase() === (nick || "").toLowerCase()) {
            this.setState({
                prep: true,
                prepLanguage: language || "EN",
            });
        }
    }

    private async getWaypointDistance() {
        if (this.state.sysconf) {
            const waypointString = await CaseHelper.getClosestWaypoint(this.state.system, this.state.platform);
            if (waypointString) {
                this.setState({ distanceToWaypoint: waypointString });
            }
        }
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
            ["case.platform", this.setPlatform],
            ["case.prep", this.prepClient],
            ["case.prepcr", this.prepClientCR],
            ["case.lang", this.setLang],
            ["case.changeid", this.setId],
            ["case.client", this.setClient],
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
        if (CaseController.caseData[this.state.id]) {
            CaseController.caseData[this.state.id].props = this.props;
            CaseController.caseData[this.state.id].state = this.state;
        }
        EventDispatcher.dispatch("case.update", this, this.state.id);
        for (const handler of this.getEventHandlers()) {
            EventDispatcher.listen(handler[0], handler[1]);
        }
        this.getWaypointDistance();
    }
}

export default CaseCard;
