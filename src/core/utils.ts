import DatabaseUtil from "./database.util";
import sha256 from "sha256";
import { EventDispatcher } from "./event.dispatcher";
export default class Utils {
    public static getUniqueKey(prefix: string = "x") {
        return `${prefix}-${new Date().getTime()}-${Math.random() * 1000}`.replace(/\./, "");
    }

    public static getVisibilityChangeByBrowser() {
        let hidden = null;
        let visibilityChange = null;
        if (typeof document.hidden !== "undefined") {
            // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (document.hasOwnProperty("msHidden")) {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (document.hasOwnProperty("webkitHidden")) {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        return { hidden: hidden, visibilityChange: visibilityChange };
    }

    public static ternary(condition: boolean, ifTrue: any, ifFalse: any = ""): any {
        return condition ? ifTrue : ifFalse;
    }

    public static distanceBetween({ x: x1, y: y1, z: z1 }: Coords, { x: x2, y: y2, z: z2 }: Coords): number {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
    }

    public static async getEDSMSystem(systemName: string): Promise<EDSMSystem> {
        let system = (await this.getSystemFromLocalCache(systemName)) || (await this.getSystemFromEDSMApi(systemName));
        if (system) {
            return system;
        } else {
            throw new Error("System not found");
        }
    }

    private static async getSystemFromEDSMApi(systemName: string): Promise<EDSMSystem> {
        const res = await fetch("https://www.edsm.net/api-v1/system", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                showCoordinates: 1,
                systemName: systemName,
            }),
        });
        const system = await res.json();
        if (system && system.name) {
            DatabaseUtil.storeEDSMSystem(system);
        }
        return system;
    }

    private static async getSystemFromLocalCache(systemName: string): Promise<EDSMSystem | undefined> {
        if (window.indexedDB) {
            return (await DatabaseUtil.getEDSMSystem(systemName)) as EDSMSystem;
        }
        return;
    }

    public static shuffle(arra1: any[]) {
        let ctr = arra1.length;
        let temp;
        let index;
        while (ctr > 0) {
            index = Math.floor(Math.random() * ctr);
            ctr--;
            temp = arra1[ctr];
            arra1[ctr] = arra1[index];
            arra1[index] = temp;
        }
        return arra1;
    }

    public static toHHMMSS(sec_num: number) {
        let hours = Math.floor(sec_num / 3600);
        let minutes = Math.floor((sec_num - hours * 3600) / 60);
        let seconds = sec_num - hours * 3600 - minutes * 60;
        return `${append(hours)}:${append(minutes)}:${append(seconds)}`;
        function append(number: number) {
            return number < 10 ? "0" + number : number;
        }
    }

    public static makeArray(start: number, end: number) {
        let i = start;
        const array = [];
        while (i < end) {
            array.push(i++);
        }
        return array;
    }

    public static sanitizeNickname(nick: string = "") {
        return nick.replace(/[\s.]/g, "_").replace(/[^\w\d_]/i, "");
    }

    public static getLangFromLocale(locale: string = "") {
        return locale ? (locale.split("-")[0] || "").toUpperCase() : "EN";
    }

    public static makeMessageEvent(from: string, message: string) {
        return {
            event: "irc.message",
            data: {
                user: from,
                text: message,
                time: new Date(),
                type: "message",
                uid: sha256(`${message}${new Date().getTime()}${Math.random()}`),
            },
        };
    }

    public static sendMessage(from: string, message: string) {
        const t = this.makeMessageEvent(from, message);
        return EventDispatcher.dispatch(t.event, this, t.data);
    }
}

export interface Coords {
    x: number;
    y: number;
    z: number;
}

export interface EDSMSystem {
    name: string;
    coords: Coords;
}
