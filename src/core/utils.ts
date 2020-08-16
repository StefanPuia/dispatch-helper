export default class Utils {
    private static LOCKED_SYSTEMS: { [system: string]: string } = {
        AZOTH: "Starter Area",
        DROMI: "Starter Area",
        "LIA FAIL": "Starter Area",
        MATET: "Starter Area",
        ORNA: "Starter Area",
        OTEGINE: "Starter Area",
        SHARUR: "Starter Area",
        TARNKAPPE: "Starter Area",
        TYET: "Starter Area",
        WOLFSEGEN: "Starter Area",

        SOL: "Federation Petty Officer",
        "BETA HYDRI": "Federation Petty Officer",
        VEGA: "Federation Petty Officer",
        "PLX 695": "Federation Warrant Officer",
        "ROSS 128": "Federation Ensign",
        EXBEUR: "Federation Lieutenent",
        HORS: "Federation Lieutenent Commander",
        "4 SEXTANTIS": "Federation Unknown",
        "CD-44 1695": "Federation Unknown",
        "LFT 509": "Federation Unknown",
        MINGFU: "Federation Unknown",
        "HIP 54530": "Federation Unknown",

        ACHENAR: "Empire Squire",
        SUMMERLAND: "Empire Lord",
        FACECE: "Empire Earl",

        ALIOTH: "Alliance Alioth Independents",

        "SHINRARTA DEZHRA": "Independent Permit",
        "CD-43 11917": "Independent Permit",
        "TERRA MATER": "Independent Permit",
        JOTUN: "Independent Permit",
        SIRIUS: "Independent Permit",
        "VAN MAANEN'S STAR": "Independent Permit",
        "LUYTEN 347-14": "Independent Permit",
        PEREGRINA: "Independent Permit",
        HODACK: "Independent Permit",
        CROM: "Independent Permit",
        "LTT 198": "Independent Permit",
        NASTROND: "Independent Permit",
        TILIALA: "Independent Permit",
        "PI MENSAE": "Independent Permit",
        ISINOR: "Independent Permit",
    };

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

    public static getSystemNote(system: string): string | undefined {
        return Utils.LOCKED_SYSTEMS[(system || "").toUpperCase()];
    }

    public static ternary(condition: boolean, ifTrue: any, ifFalse: any = ""): any {
        return condition ? ifTrue : ifFalse;
    }
}
