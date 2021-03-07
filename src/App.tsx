import "./App.css";
import "./core/config";
import "./test/case-stats";
import "./test/test-dispatch";

import React from "react";

import CaseController from "./components/case.controller";
import Chat from "./components/chat";
import DispatchSearch from "./components/dispatch.search";
import Options from "./components/options";
import DatabaseUtil from "./core/database.util";
import { EventDispatcher } from "./core/event.dispatcher";
import { IRCReader } from "./core/irc.reader";
import LogParser from "./core/log.parser";
import Utils from "./core/utils";
import Config from "./core/config";
import TestDispatch from "./test/test-dispatch";

export interface AppProps {}

export interface AppState {
    logs: Array<any>;
    showSearch: boolean;
    showOptions: boolean;
    mechaDown: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public static isFocused: boolean = true;
    public static visibility: any = {
        hidden: null,
        handle: null,
    };

    constructor(props: AppProps) {
        super(props);
        this.state = {
            logs: [],
            showSearch: false,
            showOptions: false,
            mechaDown: false,
        };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSearchBlur = this.handleSearchBlur.bind(this);
        this.handleOptionsBlur = this.handleOptionsBlur.bind(this);
        this.handleMechaStatus = this.handleMechaStatus.bind(this);

        DatabaseUtil.init();
        const { hidden, visibilityChange } = Utils.getVisibilityChangeByBrowser();
        App.visibility.hidden = hidden;
        App.visibility.handle = visibilityChange;
    }

    render() {
        return (
            <>
                <Chat />
                <CaseController />
                <a
                    id="bugreport"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://git.stefanpuia.co.uk/stefan.puia/dispatch-helper/issues"
                >
                    Bugs/Feedback
                </a>
                {this.state.showSearch ? <DispatchSearch /> : ""}
                {this.state.showOptions ? <Options /> : ""}
                {this.renderMechaDown()}
            </>
        );
    }

    private handleFocus() {
        App.isFocused = !document[App.visibility.hidden as "hidden"];
    }

    private handleKeyUp(e: KeyboardEvent) {
        if (["k", "s"].includes(e.key) && e.ctrlKey) {
            e.preventDefault();
            this.setState({ showSearch: true });
            return false;
        } else if (e.key === "o" && e.ctrlKey) {
            e.preventDefault();
            this.setState({ showOptions: true });
            return false;
        } else if (e.key === "Escape") {
            this.setState({ showSearch: false, showOptions: false });
        }
    }

    private async handleSearchBlur() {
        this.setState({ showSearch: false });
    }

    private async handleOptionsBlur() {
        this.setState({ showOptions: false });
    }

    private async handleMechaStatus(status: boolean) {
        this.setState({ mechaDown: status });
    }

    private renderMechaDown() {
        if (!this.state.mechaDown) return <></>;
        return (
            <>
                <div id="mechaDownNotif" title="Running in Mecha-Down mode!"></div>
            </>
        );
    }

    componentWilUnmount() {
        document.removeEventListener(App.visibility.handle, this.handleFocus);
    }

    componentDidMount() {
        document.addEventListener(App.visibility.handle, this.handleFocus, false);
        document.addEventListener("keydown", this.handleKeyUp);
        document.body.addEventListener("click", (e: MouseEvent) => {
            if (e.target && (e.target as HTMLElement).classList.contains("main-ui-element")) {
                if (this.state.showOptions || this.state.showSearch) {
                    this.setState({ showOptions: false, showSearch: false });
                }
            }
        });
        EventDispatcher.listen("dispatch-search.blur", this.handleSearchBlur);
        EventDispatcher.listen("options.blur", this.handleOptionsBlur);
        EventDispatcher.listen("mecha.status", this.handleMechaStatus);
        Config.mechaDown = !!Config.mechaDown;

        // window.onbeforeunload = function (e: any) {
        //     e = e || window.event;
        //     const confirm = "Are you sure you want to exit?";
        //     // For IE and Firefox prior to version 4
        //     if (e) {
        //         e.returnValue = confirm;
        //     }
        //     // For Safari
        //     return confirm;
        // };

        LogParser.init();
        IRCReader.init();

        // setTimeout(async () => {
        //     TestDispatch.test(100, 10, 1, 100, true);
        // }, 200);
    }
}

export default App;
