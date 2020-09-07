import "./App.css";

import React from "react";

import CaseController from "./components/case.controller";
import Chat from "./components/chat";
import { IRCReader } from "./core/irc.reader";
import LogParser from "./core/log.parser";
import Utils from "./core/utils";
import DispatchSearch from "./components/dispatch.search";
import { EventDispatcher } from "./core/event.dispatcher";

export interface AppProps {}

export interface AppState {
    logs: Array<any>;
    showSearch: boolean;
}

class App extends React.Component<AppProps, AppState> {
    public static isFocused: boolean = true;
    public static visibility: any = {
        hidden: null,
        handle: null,
    };

    constructor(props: AppProps) {
        super(props);
        this.state = { logs: [], showSearch: false };
        this.handleFocus = this.handleFocus.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleSearchBlur = this.handleSearchBlur.bind(this);

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
        }
    }

    private async handleSearchBlur() {
        this.setState({ showSearch: false });
    }

    componentWilUnmount() {
        document.removeEventListener(App.visibility.handle, this.handleFocus);
    }

    componentDidMount() {
        document.addEventListener(App.visibility.handle, this.handleFocus, false);
        document.addEventListener("keydown", this.handleKeyUp);
        EventDispatcher.listen("dispatch-search.blur", this.handleSearchBlur);

        window.onbeforeunload = function (e: any) {
            e = e || window.event;
            const confirm = "Are you sure you want to exit?";
            // For IE and Firefox prior to version 4
            if (e) {
                e.returnValue = confirm;
            }
            // For Safari
            return confirm;
        };

        LogParser.init();
        IRCReader.init();
    }
}

export default App;
