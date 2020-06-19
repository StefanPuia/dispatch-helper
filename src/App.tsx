import "./App.css";

import React from "react";

import CaseController from "./components/case.controller";
import Chat from "./components/chat";
import { EventDispatcher } from "./core/event.dispatcher";
import { IRCReader } from "./core/irc.reader";
import LogParser from "./core/log.parser";
import Utils from "./core/utils";

export interface AppProps {}

export interface AppState {
    logs: Array<any>;
}

class App extends React.Component<AppProps, AppState> {
    public static isFocused: boolean = true;
    public static visibility: any = {
        hidden: null,
        handle: null,
    };

    constructor(props: AppProps) {
        super(props);
        this.state = { logs: [] };
        this.handleFocus = this.handleFocus.bind(this);

        const { hidden, visibilityChange } = Utils.getVisibilityChangeByBrowser();
        App.visibility.hidden = hidden;
        App.visibility.handle = visibilityChange;
    }

    render() {
        return (
            <>
                <Chat />
                <CaseController />
            </>
        );
    }

    private handleFocus() {
        App.isFocused = !document[App.visibility.hidden as "hidden"];
    }

    componentWilUnmount() {
        document.removeEventListener(App.visibility.handle, this.handleFocus);
    }

    componentDidMount() {
        document.addEventListener(App.visibility.handle, this.handleFocus, false);
        LogParser.init();
        IRCReader.init();

        EventDispatcher.listen("error.parse", async (data) => {
            console.error(data);
        });
    }
}

export default App;
