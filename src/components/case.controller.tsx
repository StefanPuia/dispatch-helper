import "../style/case-card.css";

import React from "react";

import { EventDispatcher } from "../core/event.dispatcher";
import { NewCase, BaseMessage } from "../core/log.parser";
import Utils from "../core/utils";
import CaseCard from "./case.card";

export interface CaseControllerProps {}

export interface CaseControllerState {}

class CaseController extends React.Component<CaseControllerProps, CaseControllerState> {
    private cases: Array<JSX.Element> = [];

    render() {
        return <div id="case-cards">{this.renderCaseCards()}</div>;
    }

    private renderCaseCards() {
        return this.cases;
    }

    componentDidMount() {
        EventDispatcher.listen("callout.newcase", async (data: NewCase) => {
            this.cases.push(
                <CaseCard
                    id={data.id}
                    client={data.client}
                    nick={data.nick || data.client}
                    system={data.system}
                    sysconf={data.sysconf}
                    platform={data.platform}
                    lang={(data.lang.split("-")[0] || "").toUpperCase()}
                    created={data.time}
                    cr={data.cr}
                    key={Utils.getUniqueKey("case-card")}
                />
            );
            this.forceUpdate();
        });

        EventDispatcher.listen("case.closed", async (data: BaseMessage) => {
            const index = this.cases.findIndex((c: any) => c.props.id === data.id);
            if (index > -1) {
                this.cases.splice(index, 1);
                this.forceUpdate();
            }
        });

        EventDispatcher.listen("case.md", async (data: BaseMessage) => {
            const index = this.cases.findIndex((c: any) => c.props.id === data.id);
            if (index > -1) {
                this.cases.splice(index, 1);
                this.forceUpdate();
            }
        });
    }
}

export default CaseController;
