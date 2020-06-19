import "./App.css";

import moment from "moment";
import React from "react";

import CaseController from "./components/case.controller";
import Chat from "./components/chat";
import { EventDispatcher } from "./core/event.dispatcher";
import { IRCReader } from "./core/irc.reader";
import LogParser from "./core/log.parser";

export interface AppProps {}

export interface AppState {
    logs: Array<any>;
}

class App extends React.Component<AppProps, AppState> {
    public static isFocused: boolean = true;

    constructor(props: AppProps) {
        super(props);
        this.state = { logs: [] };
        this.handleFocus = this.handleFocus.bind(this);
    }

    render() {
        return (
            <>
                <Chat />
                <CaseController />
            </>
        );
    }

    private handleFocus(focus: boolean) {
        return (e: any) => {
            App.isFocused = focus;
        };
    }

    componentWilUnmount() {
        window.addEventListener("focus", this.handleFocus(true));
        window.removeEventListener("blur", this.handleFocus(false));
    }

    componentDidMount() {
        window.addEventListener("focus", this.handleFocus(true));
        window.addEventListener("blur", this.handleFocus(false));
        LogParser.init();
        IRCReader.init();

        EventDispatcher.listen("error.parse", async (data) => {
            console.error(data);
        });
    }
}

export default App;
