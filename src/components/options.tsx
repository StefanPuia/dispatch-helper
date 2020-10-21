import React from "react";
import Config from "../core/config";
import Utils from "../core/utils";
import { EventDispatcher } from "../core/event.dispatcher";
export interface OptionsProps {}

export interface OptionsState {}

class Options extends React.Component<OptionsProps, OptionsState> {
    constructor(props: OptionsProps) {
        super(props);
        this.state = {};
        this.saveMyRat = this.saveMyRat.bind(this);
        this.removeRat = this.removeRat.bind(this);
    }
    render() {
        return (
            <div id="options" key={Utils.getUniqueKey("options-div")}>
                <h2 style={{ marginTop: 0 }}>Options</h2>
                <h3>My Rats</h3>
                {this.renderMyRats()}
                <div>
                    <label>
                        <input
                            type="checkbox"
                            {...{ checked: !!Config.onlyRats }}
                            onChange={(e) => {
                                Config.onlyRats = e.currentTarget.checked;
                                this.forceUpdate();
                            }}
                        />
                        Only show distances to rats
                    </label>
                </div>
                <h3>Misc</h3>
                <div className="option-block columns">
                    <label>
                        <input
                            type="checkbox"
                            {...{ checked: !!Config.mechaDown }}
                            onChange={(e) => {
                                Config.mechaDown = e.currentTarget.checked;
                                this.forceUpdate();
                            }}
                        />
                        Mecha is down
                    </label>
                    <div className="option-entry option-entry-radio">
                        <span>Mark case as read on:</span>
                        <label>
                            <input
                                type="radio"
                                name="case_read-on-event"
                                {...{ checked: Config.caseReadOnEvent === "mouseenter" }}
                                onChange={(e) => {
                                    Config.caseReadOnEvent = "mouseenter";
                                    this.forceUpdate();
                                }}
                            />
                            Mouseover
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="case_read-on-event"
                                {...{ checked: Config.caseReadOnEvent === "click" }}
                                onChange={(e) => {
                                    Config.caseReadOnEvent = "click";
                                    this.forceUpdate();
                                }}
                            />
                            Click
                        </label>
                    </div>
                </div>
            </div>
        );
    }

    private renderMyRats() {
        return (
            <table id="my-rats">
                <thead>
                    <tr>
                        <td>Rat</td>
                        <td>Platform</td>
                        <td>System</td>
                    </tr>
                </thead>
                <tbody>
                    {Config.getOwnRats().map((ratWaypoint) => {
                        return (
                            <tr key={Utils.getUniqueKey("option-rats-tr")}>
                                <td>
                                    <input
                                        onBlur={(e) => this.saveMyRat(ratWaypoint.name, "name", e.currentTarget.value)}
                                        type="text"
                                        defaultValue={ratWaypoint.name}
                                    />
                                </td>
                                <td>
                                    <input
                                        onBlur={(e) =>
                                            this.saveMyRat(ratWaypoint.name, "platform", e.currentTarget.value)
                                        }
                                        type="text"
                                        defaultValue={ratWaypoint.platform}
                                    />
                                </td>
                                <td>
                                    <input
                                        onBlur={(e) =>
                                            this.saveMyRat(ratWaypoint.name, "system", e.currentTarget.value)
                                        }
                                        type="text"
                                        defaultValue={ratWaypoint.system}
                                    />
                                </td>
                                <td>
                                    <button onClick={(e) => this.removeRat(ratWaypoint.name)}>X</button>
                                </td>
                            </tr>
                        );
                    })}
                    <tr key={Utils.getUniqueKey("option-rats-tr")}>
                        <td>
                            <input onBlur={(e) => this.saveMyRat("", "name", e.currentTarget.value)} type="text" />
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    private async removeRat(rat: string) {
        const rats = localStorage["rats"];
        if (rats) {
            try {
                const parsed = JSON.parse(rats);
                delete parsed[rat];
                localStorage.rats = JSON.stringify(parsed);
                await Config.getLSRats();
                this.forceUpdate();
            } catch (err) {
                localStorage.rats = "{}";
                EventDispatcher.dispatch("error", null, err.message || err);
            }
        }
    }

    private async saveMyRat(oldName: string, key: string, value: string) {
        if (!value) return;
        let rat: any = Config.getOwnRats().find((it) => it.name === oldName);
        if (!rat) {
            rat = {
                name: value,
                system: "Sol",
                platform: "PC",
            };
        } else {
            rat[key] = value;
        }
        await this.removeRat(oldName);
        await Config.setOwnRat(rat.name, rat.platform, rat.system);
        await Config.getLSRats();
        this.forceUpdate();
    }
}

export default Options;
