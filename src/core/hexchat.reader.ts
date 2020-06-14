import { EventDispatcher } from "./event.dispatcher";

export class HexchatReader {
    private static INSTANCE: HexchatReader;
    private static PORT: number;
    private static WEBSOCKET: WebSocket;

    private constructor() {
        try {
            const port = parseInt(window.prompt("Please enter your server port (1000 - 65535): ") || "");
            if (port && !isNaN(port) && port >= 1000 && port <= 65535) {
                HexchatReader.PORT = port;
                HexchatReader.connectWS();
            } else {
                EventDispatcher.dispatch(
                    "error",
                    this,
                    "Please make sure the the port number is a valid number between 1000 and 65535 and that your server is turned on. After that, refresh the page."
                );
            }
        } catch (err) {}
    }

    private static connectWS() {
        HexchatReader.WEBSOCKET = new WebSocket(`ws://localhost:${HexchatReader.PORT}`, "echo-protocol");
        HexchatReader.WEBSOCKET.onmessage = (evt: MessageEvent) => {
            const data: string = evt.data;
            EventDispatcher.dispatch("fuelrats", this, data).catch(console.error);
        };
        HexchatReader.WEBSOCKET.onclose = () => {
            EventDispatcher.dispatch(
                "error",
                this,
                `Could not connect to your local server. Please make sure it is on and broadcasting on port ${HexchatReader.PORT}`
            );
            setTimeout(() => {
                HexchatReader.connectWS();
            }, 2000);
        };
    }

    private static getInstance() {
        if (!HexchatReader.INSTANCE) {
            HexchatReader.INSTANCE = new HexchatReader();
        }
        return HexchatReader.INSTANCE;
    }

    public static init() {
        HexchatReader.getInstance();
    }
}
