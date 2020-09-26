import "../style/case-card.css";

import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { Callout, NewCase, BaseMessage } from "../core/log.parser";
import Utils from "../core/utils";
import CaseCard from "./case.card";
import { CaseCardProps, CaseCardState } from "./case.card";
import update from "immutability-helper";
import Config from "../core/config";

export interface CaseControllerProps {}

export interface CaseControllerState {
    cases: Array<JSX.Element>;
}

class CaseController extends React.Component<CaseControllerProps, CaseControllerState> {
    public static caseData: { [id: number]: { key: string; props?: CaseCardProps; state?: CaseCardState } } = {};

    constructor(props: CaseControllerProps) {
        super(props);
        this.state = {
            cases: [],
        };
        this.handleCaseMD = this.handleCaseMD.bind(this);
        this.handleCloseCase = this.handleCloseCase.bind(this);
        this.handleNewCase = this.handleNewCase.bind(this);
        this.removeCase = this.removeCase.bind(this);
        this.updateCase = this.updateCase.bind(this);
    }

    render() {
        return (
            <div id="case-cards-wrapper">
                <div id="case-cards">{this.state.cases}</div>
            </div>
        );
    }

    private caseSorter(a: JSX.Element, b: JSX.Element) {
        const A = CaseController.caseData[a.props.id];
        const B = CaseController.caseData[b.props.id];
        if (A?.state && B?.state) {
            if (A.state.active < B.state.active) return 1;
            if (A.state.active > B.state.active) return -1;
            if (A.state.cr < B.state.cr) return 1;
            if (A.state.cr > B.state.cr) return -1;
        } else {
            if (a.props.cr < b.props.cr) return 1;
            if (a.props.cr > b.props.cr) return -1;
        }
        return a.props.created.getTime() - b.props.created.getTime();
    }

    private removeCase(data: Callout) {
        const index = this.state.cases.findIndex((c: any) => c.props.id === data.id);
        if (index > -1) {
            if (data.rat && !CaseController.caseData[data.id].state?.rats[data.rat]) return;
            delete CaseController.caseData[data.id];
            this.setState(
                update(this.state, {
                    cases: {
                        $splice: [[index, 1]],
                    },
                })
            );
            this.forceUpdate();
        }
    }

    private async handleCloseCase(data: Callout) {
        this.removeCase(data);
    }

    private async handleCaseMD(data: Callout) {
        this.removeCase(data);
    }

    private async handleNewCase(data: NewCase) {
        const key = Utils.getUniqueKey("case-card");
        const cases = this.state.cases;
        cases.push(
            <CaseCard
                key={key}
                caseKey={key}
                id={data.id}
                client={data.client}
                nick={data.nick || data.client}
                system={data.system}
                sysconf={data.sysconf}
                platform={data.platform}
                lang={(data.lang.split("-")[0] || "").toUpperCase()}
                created={data.time}
                cr={data.cr}
            />
        );
        CaseController.caseData[data.id] = {
            key: key,
        };
        this.setState(
            update(this.state, {
                cases: {
                    $set: cases.sort(this.caseSorter),
                },
            })
        );
    }

    private async updateCase(newState: NewCase) {
        const existingCase = Object.values(CaseController.caseData).find(
            ({ state }) => state && state.client === newState.client
        );
        if (existingCase && existingCase.state) {
            const oldState = existingCase.state;
            const currentCaseId = oldState.id !== newState.id ? newState.id : oldState.id;
            const baseMessage: any = {
                id: currentCaseId,
            };
            if (oldState.id !== newState.id) {
                await EventDispatcher.dispatch("case.changeid", this, {
                    id: oldState.id,
                    newId: newState.id,
                });
            }
            if (oldState.client !== newState.client) {
                EventDispatcher.dispatch("case.client", this, {
                    ...baseMessage,
                    client: newState.client,
                });
            }
            if (oldState.nick !== newState.nick) {
                EventDispatcher.dispatch("nickchange", this, {
                    raw: {
                        user: oldState.nick,
                    },
                    nick: newState.nick,
                });
            }
            if (oldState.cr !== newState.cr) {
                EventDispatcher.dispatch("case.cr", this, {
                    ...baseMessage,
                    cr: newState.cr,
                });
            }
            if (oldState.system !== newState.system) {
                EventDispatcher.dispatch("case.sys", this, {
                    ...baseMessage,
                    system: newState.system,
                });
            }
            if (oldState.platform !== newState.platform) {
                EventDispatcher.dispatch("case.platform", this, {
                    ...baseMessage,
                    platform: newState.platform,
                });
            }
            if (oldState.lang !== newState.lang) {
                EventDispatcher.dispatch("case.lang", this, {
                    ...baseMessage,
                    lang: newState.lang,
                });
            }
        }
    }

    componentDidMount() {
        EventDispatcher.listen("callout.newcase", this.handleNewCase);
        EventDispatcher.listen("case.closed", this.handleCloseCase);
        EventDispatcher.listen("case.md", this.handleCaseMD);
        EventDispatcher.listen("callout.updatecase", this.updateCase);
        EventDispatcher.listen("case.disconnect", async (data: any) => {
            if (data.nick === "MechaSqueak[BOT]") {
                Config.mechaDown = true;
                EventDispatcher.dispatch("ERROR", this, "Mecha disconnected. Entering Mecha-Down mode.");
            }
        });
        EventDispatcher.listen("case.connect", async (data: any) => {
            if (data.nick === "MechaSqueak[BOT]") {
                EventDispatcher.dispatch("ERROR", this, "Mecha reconnected. Disable Mecha-Down mode from the options.");
            }
        });
        EventDispatcher.listen("case.update", async (caseId: number) => {
            this.setState(
                update(this.state, {
                    cases: {
                        $set: this.state.cases.sort(this.caseSorter),
                    },
                })
            );
        });
    }

    public static getCaseNumberForNick(nick: string): number | undefined {
        const caseCard = Object.values(CaseController.caseData).find(({ state }) => state?.nick === nick);
        return caseCard ? caseCard?.props?.id : undefined;
    }
}

export default CaseController;
