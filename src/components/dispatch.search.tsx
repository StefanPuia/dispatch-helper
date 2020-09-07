import React, { ChangeEvent } from "react";
import { EventDispatcher } from "../core/event.dispatcher";
import { CaseCardState } from "./case.card";
import CaseController from "./case.controller";
import CopyToClipboard from "react-copy-to-clipboard";
import Utils from "../core/utils";
import CaseHelper from "../core/case-helper";
import { AutoDispatch } from "../core/case-helper";

export interface DispatchSearchProps {}

export interface DispatchSearchState {
    query: string;
    results: AutoDispatch[];
}

class DispatchSearch extends React.Component<DispatchSearchProps, DispatchSearchState> {
    private input: HTMLInputElement | null = null;
    private container: HTMLDivElement | null = null;

    constructor(props: DispatchSearchProps) {
        super(props);
        this.state = { query: "", results: [] };
        this.search = this.search.bind(this);
        this.blur = this.blur.bind(this);
    }
    render() {
        return (
            <div id="dispatchSearch" ref={(el) => (this.container = el)} onBlur={this.blur}>
                <input
                    onChange={this.search}
                    onKeyUp={(e) => {
                        if (e.key === "Escape") {
                            e.preventDefault();
                            e.currentTarget.blur();
                        }
                    }}
                    ref={(el) => (this.input = el)}
                    type="text"
                    placeholder="[#] [plat] [lang] command [- params]"
                />
                <section>{this.renderSearchResults()}</section>
            </div>
        );
    }

    private search(e: ChangeEvent) {
        if (this.input) {
            const query = this.input.value.trim();
            if (!query) {
                this.setState({ results: [] });
            } else {
                try {
                    const results: AutoDispatch[] = [];
                    const search = query.match(
                        /^(?:(?<case>\d+)?\s+)?(?:(?<platform>PC|PS|PS4|XB)?\s+)?(?:(?<lang>\w\w)?\s+)?(?<search>.+?)(?: -\s+?(?<params>.+))?$/i
                    );
                    if (search && search.groups) {
                        let caseCardState: CaseCardState = {
                            id: -1,
                            rats: [] as any,
                            connected: true,
                            active: true,
                            cr: true,
                            nick: "",
                            system: "",
                            sysconf: false,
                            platform: "PC",
                            unread: true,
                            prep: false,
                            lang: "EN",
                        };
                        if (search.groups.case) {
                            const caseData = CaseController.caseData[parseInt(search.groups.case)];
                            if (caseData) {
                                const caseState = caseData.state;
                                if (caseState) {
                                    caseCardState = { ...caseState };
                                }
                            }
                        }
                        if (search.groups.platform) {
                            let platform = search.groups.platform.toUpperCase();
                            platform = platform === "PS" ? "PS4" : platform;
                            caseCardState.platform = platform as any;
                        }
                        if (search.groups.lang) {
                            caseCardState.lang = search.groups.lang.toUpperCase() as any;
                        }
                        if (search.groups.search) {
                            const autoSpatch = CaseHelper.buildAllAutoDispatch(caseCardState);
                            const searchRegex = new RegExp(search.groups.search, "i");
                            const params = this.parseSearchParams(search.groups.params);
                            for (const k in autoSpatch) {
                                try {
                                    const spatch = autoSpatch[k].call(autoSpatch, ...params);
                                    if (spatch.info.match(searchRegex) || spatch.clipboard.match(searchRegex)) {
                                        results.push(spatch);
                                    }
                                } catch (err) {}
                            }
                        }
                        this.setState({ results: results });
                    }
                } catch (err) {
                    EventDispatcher.dispatch("error", this, err.message);
                }
            }
        }
    }

    private blur() {
        setTimeout(() => {
            EventDispatcher.dispatch("dispatch-search.blur", this, null);
        }, 100);
    }

    private renderSearchResults() {
        return this.state.results.map((res) => {
            return (
                <CopyToClipboard key={Utils.getUniqueKey("CopyToClipboard")} text={res.clipboard}>
                    <div key={Utils.getUniqueKey("search-results-div")} title={res.clipboard}>
                        <strong>{res.info}</strong>
                        <span>{res.clipboard}</span>
                    </div>
                </CopyToClipboard>
            );
        });
    }

    private parseSearchParams(params: string = ""): any[] {
        try {
            const int = parseInt(params);
            if (!isNaN(int)) {
                return [int];
            }
            return params.split(",").map((p) => p.trim());
        } catch (err) {}
        return [];
    }

    componentDidMount() {
        if (this.input) {
            this.input.focus();
        }
    }
}

export default DispatchSearch;