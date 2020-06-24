import "../style/case-card.css";

import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { NewCase, BaseMessage } from "../core/log.parser";
import Utils from "../core/utils";
import CaseCard from "./case.card";
import { CaseCardProps, CaseCardState } from "./case.card";

export interface CaseControllerProps {}

export interface CaseControllerState {}

class CaseController extends React.Component<CaseControllerProps, CaseControllerState> {
    private cases: Array<JSX.Element> = [];
    public static caseData: { [id: number]: { key: string; props?: CaseCardProps; state?: CaseCardState } } = {};

    constructor(props: CaseControllerProps) {
        super(props);
        this.handleCaseMD = this.handleCaseMD.bind(this);
        this.handleCloseCase = this.handleCloseCase.bind(this);
        this.handleNewCase = this.handleNewCase.bind(this);
    }

    render() {
        return (
            <div id="case-cards-wrapper">
                <div id="case-cards">{this.cases}</div>
            </div>
        );
    }

    private removeCase(data: BaseMessage) {
        const index = this.cases.findIndex((c: any) => c.props.id === data.id);
        if (index > -1) {
            delete CaseController.caseData[data.id];
            this.cases.splice(index, 1);
            this.forceUpdate();
        }
    }

    private async handleCloseCase(data: BaseMessage) {
        this.removeCase(data);
    }

    private async handleCaseMD(data: BaseMessage) {
        this.removeCase(data);
    }

    private async handleNewCase(data: NewCase) {
        const key = Utils.getUniqueKey("case-card");
        this.cases.push(
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
        this.forceUpdate();
    }

    componentDidMount() {
        EventDispatcher.listen("callout.newcase", this.handleNewCase);
        EventDispatcher.listen("case.closed", this.handleCloseCase);
        EventDispatcher.listen("case.md", this.handleCaseMD);
    }

    public static getCaseNumberForNick(nick: string): number | undefined {
        const caseCard = Object.values(CaseController.caseData).find(({ state }) => state?.nick === nick);
        return caseCard ? caseCard?.props?.id : undefined;
    }
}

export default CaseController;
