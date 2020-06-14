import "./App.css";
import "./core/hexchat.reader";
import "./core/log.parser";

import React from "react";
import moment from "moment";

import CaseController from "./components/case.controller";
import Chat from "./components/chat";
import { EventDispatcher } from "./core/event.dispatcher";

export interface AppProps {}

export interface AppState {
    logs: Array<any>;
}

class App extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { logs: [] };
    }

    render() {
        return (
            <>
                <Chat />
                <CaseController />
            </>
        );
    }

    componentDidMount() {
        EventDispatcher.listen("error.parse", async (data) => {
            console.error(data);
        });

        EventDispatcher.listen("pause", (length) => {
            return new Promise((resolve) => {
                setTimeout(resolve, parseInt(length));
            });
        });

        const test: Array<[string, string]> = [
            // [
            //     "fuelrats",
            //     "MechaSqueak[BOT] RATSIGNAL - CMDR client1" +
            //         " - Reported System: CORE SYS SECTOR XJ-R A4-0 (40.44 LY from Sol)" +
            //         " - Platform: PC - O2: OK - Language: English (en-GB) (Case #17) (PC_SIGNAL)",
            // ],
            // [
            //     "fuelrats",
            //     "MechaSqueak[BOT] RATSIGNAL - CMDR client2" +
            //         " - Reported System: CORE SYS SECTOR XJ-R A4-0 (not in Fuelrats System Database)" +
            //         " - Platform: PC - O2: OK - Language: English (en-GB) (Case #18) (PC_SIGNAL)",
            // ],
            // ["fuelrats", "Steph #18 3j"],
            // ["fuelrats", "Steph3 #18 3j"],
            // ["fuelrats", "Steph !close 17 Steph"],
            // ["fuelrats", "Steph https://google.com"],
            // ["fuelrats", "* client2 has quit (Quit: FuelRats Web IRC - Provided by KiwiIRC)"],
            // ["fuelrats", "* client2 (00000000@1574817D:D12402A2:D41C13F0:IP) has joined"],
            // ["fuelrats", "Steph !go 18 Steph Steph2"],
            // ["fuelrats", "Steph #18 fr+ wr+ bc+"],
            // ["fuelrats", "Steph2 #18 fr+ sysconf"],
            // ["fuelrats", "Steph3 #18 stdn"],
            // ["fuelrats", "Steph !unassign 18 Steph"],
            // ["fuelrats", "Steph2 !active 18"],
            // ["fuelrats", "Steph #18 fuel+"],
            // ["fuelrats", "Steph2 #18 fuel+"],
            // ["fuelrats", "Steph2 !cr 18"],
            // ["fuelrats", "Steph !sys 18 Maia"],
            // ["fuelrats", "Steph2 !active 18"],
            // ["fuelrats", "Steph2 #18 client in open like i told him to cause im speshul"],
            // ["fuelrats", "Lxcky_7x	ye thanks for help"],
            // [
            //     "fuelrats",
            //     "MechaSqueak[BOT] RATSIGNAL - CMDR Lxcky 7x - Reported System: V1396 cygni (49.89 LY from Sol) - Platform: XB - O2: OK - Language: English (en-GB) - IRC Nickname: Lxcky_7x (Case #6) (XB_SIGNAL)",
            // ],
            // ["fuelrats", "Velica_Foriana	Lxcky_7x, please add FeistyPizza6624 to a wing"],
            // [
            //     "fuelrats",
            //     "Velica_Foriana	Lxcky_7x: please open your navigation panel and select the first item from the list. Then try again",
            // ],
        ];

        EventDispatcher.queuePromises(
            test.map((t) => async () => {
                await EventDispatcher.dispatch("pause", null, "100");
                return EventDispatcher.dispatch(t[0], null, `${moment().format("YYYY-MM-DD HH:mm:ss")} ${t[1]}`);
            }),
            this,
            []
        );
    }
}

export default App;
