import { EventDispatcher } from "./event.dispatcher";

export class HexchatReader {
    private static INSTANCE: HexchatReader;

    private constructor() {
        let ws = this.openWS();
        ws.onclose = () => {
            setTimeout(() => {
                ws = this.openWS();
            }, 2000);
        };
    }

    private openWS() {
        const ws = new WebSocket("ws://localhost:6969", "echo-protocol");
        ws.onmessage = (evt: MessageEvent) => {
            const data: string = evt.data;
            EventDispatcher.dispatch("fuelrats", this, data).catch(
                console.error
            );
        };
        return ws;
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

HexchatReader.init();
