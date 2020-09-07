import DatabaseUtil from "./database.util";
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
        console.log("api");
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
        DatabaseUtil.storeEDSMSystem(system);
        return system;
    }

    private static async getSystemFromLocalCache(systemName: string): Promise<EDSMSystem | undefined> {
        console.log("local");
        if (window.indexedDB) {
            return (await DatabaseUtil.getEDSMSystem(systemName)) as EDSMSystem;
        }
        return;
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
