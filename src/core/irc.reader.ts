import { EventDispatcher } from "./event.dispatcher";
import sha256 from "sha256";

export class IRCReader {
    private static INSTANCE: IRCReader;
    private static WEBSOCKET: WebSocket;

    private constructor() {
        IRCReader.connectWS();
    }

    private static connectWS() {
        IRCReader.WEBSOCKET = new WebSocket(`wss://dispatchws.stefanpuia.co.uk/`, "echo-protocol");
        IRCReader.WEBSOCKET.onmessage = (evt: MessageEvent) => {
            try {
                const data: any = JSON.parse(evt.data);
                data.uid = sha256(evt.data + new Date().getTime());
                EventDispatcher.dispatch("irc.incoming", this, data).catch(console.error);
            } catch (err) {
                EventDispatcher.dispatch("error", this, err.message);
            }
        };
        IRCReader.WEBSOCKET.onopen = () => {
            EventDispatcher.dispatch("error", this, `Connected to the fuelrats webchat.`);
        };
        IRCReader.WEBSOCKET.onclose = () => {
            EventDispatcher.dispatch("error", this, `Could not connect to fuelrats webchat. Retrying...`);
            setTimeout(() => {
                IRCReader.connectWS();
            }, 5000);
        };
    }

    private static getInstance() {
        if (!IRCReader.INSTANCE) {
            IRCReader.INSTANCE = new IRCReader();
        }
        return IRCReader.INSTANCE;
    }

    public static init() {
        IRCReader.getInstance();
    }
}
