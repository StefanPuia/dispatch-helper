import { CaseCardState } from "../components/case.card";
import DispatchTextBase from "./dispatch-text/dispatch-text";
import DispatchTextCN from "./dispatch-text/dispatch-text-cn";
import DispatchTextCS from "./dispatch-text/dispatch-text-cs";
import DispatchTextDE from "./dispatch-text/dispatch-text-de";
import DispatchTextEN from "./dispatch-text/dispatch-text-en";
import DispatchTextES from "./dispatch-text/dispatch-text-es";
import DispatchTextFR from "./dispatch-text/dispatch-text-fr";
import DispatchTextHU from "./dispatch-text/dispatch-text-hu";
import DispatchTextIT from "./dispatch-text/dispatch-text-it";
import DispatchTextNB from "./dispatch-text/dispatch-text-nb";
import DispatchTextNL from "./dispatch-text/dispatch-text-nl";
import DispatchTextPL from "./dispatch-text/dispatch-text-pl";
import DispatchTextPT from "./dispatch-text/dispatch-text-pt";
import DispatchTextRO from "./dispatch-text/dispatch-text-ro";
import DispatchTextRU from "./dispatch-text/dispatch-text-ru";
import DispatchTextTR from "./dispatch-text/dispatch-text-tr";
import { EventDispatcher } from "./event.dispatcher";
import Utils, { Coords } from "./utils";
import Config from "./config";
import { EDSMSystem } from "./utils";

export default class CaseHelper {
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

    private static WAYPOINTS: Waypoint[] = [
        {
            name: "Sol",
            coords: {
                x: 0,
                y: 0,
                z: 0,
            },
        },
        {
            name: "Dromi",
            coords: {
                x: 25.40625,
                y: -31.0625,
                z: 41.625,
            },
        },
        {
            name: "Fuelum",
            coords: {
                x: 52,
                y: -52.65625,
                z: 49.8125,
            },
        },
        {
            name: "Rodentia",
            coords: {
                x: -9530.53125,
                y: -907.25,
                z: 19787.375,
            },
        },
        {
            name: "Sagittarius A*",
            coords: {
                x: 25.21875,
                y: -20.90625,
                z: 25899.96875,
            },
        },
        {
            name: "Beagle Point",
            coords: {
                x: -1111.5625,
                y: -134.21875,
                z: 65269.75,
            },
        },
        {
            name: "Anaconda's Graveyard",
            coords: {
                x: 1645.34375,
                y: 1728.3125,
                z: -2128.59375,
            },
        },
        {
            name: "Maia",
            coords: {
                x: -81.78125,
                y: -149.4375,
                z: -343.375,
            },
        },
        {
            name: "Sag A* side of Bubble",
            coords: {
                x: -67.40625,
                y: -7.40625,
                z: 150.0625,
            },
        },
        {
            name: "Dark side of Bubble",
            coords: {
                x: 29.40625,
                y: -22.09375,
                z: -159.53125,
            },
        },
        {
            name: "Maia side of Bubble",
            coords: {
                x: -154.53125,
                y: 21.1875,
                z: -11.1875,
            },
        },
        {
            name: "Fuelum side of Bubble",
            coords: {
                x: 23.5,
                y: -18.75,
                z: 146.875,
            },
        },
        {
            name: "Top side of Bubble",
            coords: {
                x: 7.1875,
                y: 135.65625,
                z: 3.0625,
            },
        },
        {
            name: "Bottom side of Bubble",
            coords: {
                x: 82.84375,
                y: -210.03125,
                z: 52.59375,
            },
        },
    ];

    public static async getClosestWaypoint(systemName: string, platform: "PC" | "PS4" | "XB"): Promise<string> {
        try {
            const system = await Utils.getEDSMSystem(systemName);
            if (system && system.coords) {
                let closest: { dist: number; waypoint?: Waypoint } = { dist: Infinity };
                if (Config.onlyRats) {
                    loopWaypoints(system, Config.getOwnRats(platform), closest);
                }
                if (!Config.onlyRats || !closest.waypoint) {
                    loopWaypoints(system, CaseHelper.WAYPOINTS, closest);
                }
                if (closest.waypoint) {
                    return `${closest.dist.toFixed(2)}LY to ${closest.waypoint.name}`;
                }
            }
        } catch (err) {
            EventDispatcher.dispatch("error", this, err.message);
        }
        return "";

        function loopWaypoints(
            system: EDSMSystem,
            waypoints: Waypoint[],
            closest: { dist: number; waypoint?: Waypoint }
        ) {
            for (const waypoint of waypoints) {
                const dist = Utils.distanceBetween(waypoint.coords, system.coords);
                if (dist <= closest.dist) {
                    closest.dist = dist;
                    closest.waypoint = waypoint;
                }
            }
        }
    }

    public static buildAllAutoDispatch(state: CaseCardState): { [key: string]: AutoDispatchFunction } {
        const dispatchText: DispatchTextBase = this.getDispatchText(state);
        return {
            ALSO_FR: () => this.buildADObject("ALSO FR", dispatchText.alsoFR()),
            ALSO_WR: () => this.buildADObject("ALSO WR", dispatchText.alsoWR()),
            SILENT: () => this.buildADObject("SILENT", dispatchText.disableSilentRunning()),
            BC_ALT: () => this.buildADObject("BC ALT", dispatchText.getBeaconAlt()),
            CR_GO: () =>
                this.buildADObject("CR GO", dispatchText.getCRGO(), dispatchText.getBeacon(), dispatchText.getWing()),
            CR_INST: () => this.buildADObject("CR INST", dispatchText.getCRPreInst(), dispatchText.getCRInst()),
            CR_FACTS: () => this.buildADObject("CR FACTS", dispatchText.getBeacon(), dispatchText.getWing()),
            CR_O2: () => this.buildADObject("O2 CR", dispatchText.getCROxygen()),
            CR_POS: () => this.buildADObject("POS CR", dispatchText.getCRPosition()),
            MM_STAY: () => this.buildADObject("MM STAY", dispatchText.getMMStay()),
            CR_SYSCONF: () => this.buildADObject("SYSCONF CR", dispatchText.getCRSysConf()),
            CR_VIDEO: () => this.buildADObject("CR VIDEO", dispatchText.getCRVideo()),
            DEBRIEF: () => this.buildADObject("DEBRIEF", dispatchText.getDBChannel()),
            EN: () => this.buildADObject("EN", dispatchText.getEnglishCheck()),
            ETA: (minutes: number) => this.buildADObject("ETA", dispatchText.getEta(minutes || 2)),
            FAILURE: () => this.buildADObject("FAILURE", dispatchText.getFailure()),
            MM_CONF: () => this.buildADObject("MM CONF", dispatchText.getMMConf()),
            CR_POST_INST: () => this.buildADObject("CR POST INST", dispatchText.getPostCRInst()),
            PRE_BEACON: () => this.buildADObject("PRE BEACON", dispatchText.getPreBeacon()),
            PRE_FR: () => this.buildADObject("PRE FR", dispatchText.getPreFR()),
            PRE_WING: () => this.buildADObject("PRE WING", dispatchText.getPreWing()),
            PREP_PING: () => this.buildADObject("PREP PING", dispatchText.getPrepPing()),
            SOCIAL_REFRESH: () => this.buildADObject("SOCIAL REFRESH", dispatchText.getRefreshSocial()),
            SC_ENTER: () => this.buildADObject("SC ENTER", dispatchText.getSCEnter()),
            SC_INFO: () => this.buildADObject("SC INFO", dispatchText.getSCInfo(), dispatchText.getSC()),
            SC_LEAVE: () => this.buildADObject("SC LEAVE", dispatchText.getSCLeave()),
            SUCCESS: () => this.buildADObject("SUCCESS", dispatchText.getSuccess()),
            SYSCONF: () => this.buildADObject("SYSCONF", dispatchText.getSysConf()),
            WELCOME: () => this.buildADObject("WELCOME", dispatchText.getWelcome()),
            LIFE_SUPPORT: () => this.buildADObject("LIFE SUPPORT", dispatchText.lifeSupport()),
            OPEN_PLAY: () => this.buildADObject("OPEN PLAY", dispatchText.openPlay()),
            OXYGEN_CHECK: () => this.buildADObject("OXYGEN CHECK", dispatchText.oxygenCheck()),
            PREP: () => this.buildADObject("PREP", dispatchText.getPrep(), dispatchText.getWelcome()),
            PREP_CR: () => this.buildADObject("PREP CR", dispatchText.getCRPrep(), dispatchText.getMMConf()),
            FR: () => this.buildADObject("FR", dispatchText.getPreFR(), dispatchText.getFR()),
            WR: () => this.buildADObject("WR", dispatchText.getPreWing(), dispatchText.getWing()),
            BC: () => this.buildADObject("BC", dispatchText.getPreBeacon(), dispatchText.getBeacon()),
        };
    }

    public static buildAutoDispatch(state: CaseCardState): AutoDispatch[] {
        const dispatchText: DispatchTextBase = this.getDispatchText(state);
        const dispatchFacts = this.buildAllAutoDispatch(state);
        const autoSpatch: AutoDispatch[] = [];

        const assignedRats = dispatchText.getAssignedRats().length;
        const ratsAreAssigned = assignedRats > 0;
        const ratsNeedFR = dispatchText.getRatsNeedingFR().length;
        const allRatsNeedFR = ratsNeedFR === assignedRats;
        const ratsNeedWR = dispatchText.getRatsNeedingWR().length;
        const allRatsNeedWR = ratsNeedWR === assignedRats;
        const needBeacon = ratsAreAssigned && dispatchText.getBCRats().length === 0;
        const gotFuel = dispatchText.getFuelRats().length > 0;

        if (state.lang !== "EN") {
            autoSpatch.push(dispatchFacts.EN());
        }

        // CODE RED
        if (state.cr) {
            if (!state.prep) {
                autoSpatch.push(dispatchFacts.PREP_CR());
            }

            if (!state.sysconf) {
                autoSpatch.push(dispatchFacts.CR_SYSCONF());
            }

            autoSpatch.push(dispatchFacts.CR_O2());
            autoSpatch.push(dispatchFacts.CR_POS());

            if (ratsAreAssigned && !allRatsNeedFR) {
                autoSpatch.push(dispatchFacts.CR_INST());
                autoSpatch.push(dispatchFacts.CR_GO());
            }
        }

        // NORMAL RESCUE
        if (gotFuel) {
            autoSpatch.push(dispatchFacts.SUCCESS());
        }

        if (!state.prep && !state.cr) {
            autoSpatch.push(dispatchFacts.PREP());
        }

        if (!state.sysconf && !state.cr) {
            autoSpatch.push(dispatchFacts.SYSCONF());
        }

        if (ratsNeedFR) {
            autoSpatch.push(allRatsNeedFR ? dispatchFacts.FR() : dispatchFacts.ALSO_FR());
        }

        if (ratsNeedWR && !state.cr && !allRatsNeedFR) {
            autoSpatch.push(allRatsNeedWR ? dispatchFacts.WR() : dispatchFacts.ALSO_WR());
        }

        if (needBeacon && !allRatsNeedWR) {
            autoSpatch.push(dispatchFacts.BC());
        }

        return autoSpatch;
    }

    private static buildADObject(info: string, ...text: string[]): AutoDispatch {
        return {
            info: info,
            clipboard: text.filter((t) => t && t.trim() !== "").join("\n"),
        };
    }

    public static getDispatchText(state: CaseCardState): DispatchTextBase {
        switch (state.lang) {
            case "RU":
                return new DispatchTextRU(state);
            case "DE":
                return new DispatchTextDE(state);
            case "ES":
                return new DispatchTextES(state);
            case "FR":
                return new DispatchTextFR(state);
            case "NB":
                return new DispatchTextNB(state);
            case "HU":
                return new DispatchTextHU(state);
            case "PL":
                return new DispatchTextPL(state);
            case "PT":
                return new DispatchTextPT(state);
            case "IT":
                return new DispatchTextIT(state);
            case "NL":
                return new DispatchTextNL(state);
            case "CZ":
            case "CS":
                return new DispatchTextCS(state);
            case "RO":
                return new DispatchTextRO(state);
            case "TR":
                return new DispatchTextTR(state);
            case "CN":
            case "ZH":
                return new DispatchTextCN(state);
            case "EN":
            default:
                return new DispatchTextEN(state);
        }
    }

    public static getSystemNote(system: string): string | undefined {
        return CaseHelper.LOCKED_SYSTEMS[(system || "").toUpperCase()];
    }
}

interface AutoDispatchFunction {
    (arg?: any): AutoDispatch;
}

export interface AutoDispatch {
    info: string;
    clipboard: string;
}

export interface Waypoint {
    name: string;
    coords: Coords;
}
