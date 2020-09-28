import Utils from "./utils";
import { Waypoint } from "./case-helper";
import { EventDispatcher } from "./event.dispatcher";
export default class Config {
    private static INSTANCE: Config;
    private store: { [key: string]: any } = {
        rats: {},
    };

    private constructor() {}

    private static getInstance() {
        if (!this.INSTANCE) {
            this.INSTANCE = new Config();
        }
        return this.INSTANCE;
    }

    public static set(key: string, value: any) {
        this.getInstance().store[key] = value;
    }

    public static get(key: string) {
        return this.getInstance().store[key];
    }

    public static async setOwnRat(name: string, platform: string, systemName: string) {
        try {
            const system = await Utils.getEDSMSystem(systemName);
            if (system) {
                this.set("rats", {
                    ...this.get("rats"),
                    [name]: {
                        platform: platform,
                        name: name,
                        system: systemName,
                        coords: system.coords,
                    },
                });
            }
            this.addRatToLS(name, platform, systemName);
        } catch (err) {
            EventDispatcher.dispatch("error", this, err.message || err);
        }
    }

    public static getOwnRats(): RatWaypoint[];
    public static getOwnRats(platform: string): RatWaypoint[];
    public static getOwnRats(platform?: string): RatWaypoint[] {
        return Object.values(this.get("rats") || {}).filter((it: any) =>
            platform ? it.platform === platform : true
        ) as RatWaypoint[];
    }

    public static async getLSRats() {
        this.set("rats", {});
        const rats = localStorage["rats"];
        if (rats) {
            try {
                const parsed = JSON.parse(rats);
                for (const rat in parsed) {
                    await Config.setOwnRat(parsed[rat].name, parsed[rat].platform, parsed[rat].system);
                }
            } catch (err) {
                localStorage.rats = "{}";
                EventDispatcher.dispatch("error", this, err.message || err);
            }
        }
    }

    public static addRatToLS(name: string, platform: string, system: string) {
        let rats = localStorage["rats"];
        if (!rats) {
            rats = "{}";
        }
        try {
            const parsed = JSON.parse(rats);
            parsed[name] = {
                platform: platform,
                name: name,
                system: system,
            };
            localStorage["rats"] = JSON.stringify(parsed);
        } catch (err) {
            localStorage.rats = "{}";
            EventDispatcher.dispatch("error", null, err.message || err);
        }
    }

    public static get onlyRats() {
        return localStorage.onlyRats === "true" || Config.get("onlyRats");
    }

    public static set onlyRats(value: boolean) {
        Config.set("onlyRats", value);
        localStorage.onlyRats = value;
    }

    public static get mechaDown() {
        return localStorage.mechaDown === "true" || Config.get("mechaDown");
    }

    public static set mechaDown(value: boolean) {
        Config.set("mechaDown", value);
        localStorage.mechaDown = value;
        EventDispatcher.dispatch("mecha.status", this, value);
    }
}

declare global {
    interface Window {
        Config: any;
    }
}

interface RatWaypoint extends Waypoint {
    platform: "PC" | "PS4" | "XB";
    system: string;
}

window.Config = Config;

setTimeout(() => {
    Config.getLSRats();
}, 100);
