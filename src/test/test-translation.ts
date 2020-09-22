import { saveAs } from "file-saver";
import JSZip from "jszip";

import { CaseCardState } from "../components/case.card";
import DispatchTextCN from "../core/dispatch-text/dispatch-text-cn";
import DispatchTextCS from "../core/dispatch-text/dispatch-text-cs";
import DispatchTextDE from "../core/dispatch-text/dispatch-text-de";
import DispatchTextEN from "../core/dispatch-text/dispatch-text-en";
import DispatchTextES from "../core/dispatch-text/dispatch-text-es";
import DispatchTextFR from "../core/dispatch-text/dispatch-text-fr";
import DispatchTextHU from "../core/dispatch-text/dispatch-text-hu";
import DispatchTextIT from "../core/dispatch-text/dispatch-text-it";
import DispatchTextNB from "../core/dispatch-text/dispatch-text-nb";
import DispatchTextNL from "../core/dispatch-text/dispatch-text-nl";
import DispatchTextPL from "../core/dispatch-text/dispatch-text-pl";
import DispatchTextPT from "../core/dispatch-text/dispatch-text-pt";
import DispatchTextRO from "../core/dispatch-text/dispatch-text-ro";
import DispatchTextRU from "../core/dispatch-text/dispatch-text-ru";
import DispatchTextTR from "../core/dispatch-text/dispatch-text-tr";

declare global {
    interface Window {
        TestTranslation: any;
        translate: Function;
    }
}

export default class TestTranslation {
    public static readonly SUPPORTED_LANGUAGES = [
        "CN",
        "CS",
        "DE",
        "EN",
        "ES",
        "FR",
        "HU",
        "IT",
        "NB",
        "NL",
        "PL",
        "PT",
        "RO",
        "RU",
        "TR",
    ];

    public static getDispatchLines(language: string = "EN") {
        const soloHelper = this.getDispatchHelper(language, this.getSingleRatState());
        const multiHelper = this.getDispatchHelper(language, this.getMultiRatState());
        return [
            `Dispatch Helper Lines - ${language}\n==========================`,
            this.buildOutputLine("Disable silent running", soloHelper.disableSilentRunning()),
            this.buildOutputLine("Stay at the main menu", soloHelper.getMMStay()),
            this.buildOutputLine("From main menu, remember oxygen", soloHelper.getCROxygen()),
            this.buildOutputLine("From main menu, remember position", soloHelper.getCRPosition()),
            this.buildOutputLine("CR pre-instructions", soloHelper.getCRPreInst()),
            this.buildOutputLine("From main menu, confirm system", soloHelper.getCRSysConf()),
            this.buildOutputLine("CR video", soloHelper.getCRVideo()),
            this.buildOutputLine("Send to #debrief channel", soloHelper.getDBChannel()),
            this.buildOutputLine("Check English", soloHelper.getEnglishCheck()),
            this.buildOutputLine("Confirm main menu", soloHelper.getMMConf()),
            this.buildOutputLine("CR post-instructions", soloHelper.getPostCRInst()),
            this.buildOutputLine("Prep ping", soloHelper.getPrepPing()),
            this.buildOutputLine("Refresh console social", soloHelper.getRefreshSocial()),
            this.buildOutputLine("Enter supercruise", soloHelper.getSCEnter()),
            this.buildOutputLine("Supercruise info", soloHelper.getSCInfo()),
            this.buildOutputLine("Leave supercruise", soloHelper.getSCLeave()),
            this.buildOutputLine("Confirm system", soloHelper.getSysConf()),
            this.buildOutputLine("Welcome", soloHelper.getWelcome()),
            this.buildOutputLine("Turn life support on", soloHelper.lifeSupport()),
            this.buildOutputLine("Log into open play", soloHelper.openPlay()),
            this.buildOutputLine("Check for oxygen timer", soloHelper.oxygenCheck()),

            this.buildOutputLine("Alternative beacon - 1 rat", soloHelper.getBeaconAlt()),
            this.buildOutputLine("Alternative beacon - 2 rats", multiHelper.getBeaconAlt()),

            this.buildOutputLine("Code red instructions - 1 rat", soloHelper.getCRInst()),
            this.buildOutputLine("Code red instructions - 2 rats", multiHelper.getCRInst()),

            this.buildOutputLine("Failure - 1 rat", soloHelper.getFailure()),
            this.buildOutputLine("Failure - 2 rats", multiHelper.getFailure()),

            this.buildOutputLine("Pre-Beacon - 1 rat", soloHelper.getPreBeacon()),
            this.buildOutputLine("Pre-Beacon - 2 rats", multiHelper.getPreBeacon()),

            this.buildOutputLine("Pre-Friend request - 1 rat", soloHelper.getPreFR()),
            this.buildOutputLine("Pre-Friend request - 2 rats", multiHelper.getPreFR()),

            this.buildOutputLine("Pre-Wing invite - 1 rat", soloHelper.getPreWing()),
            this.buildOutputLine("Pre-Wing invite - 2 rats", multiHelper.getPreWing()),

            this.buildOutputLine("Success - 1 rat", soloHelper.getSuccess()),
            this.buildOutputLine("Success - 2 rats", multiHelper.getSuccess()),

            this.buildOutputLine("Code red GO - 1 rat", soloHelper.getCRGO()),
            this.buildOutputLine("Code red GO - 2 rats", multiHelper.getCRGO()),

            this.buildOutputLine("Also friend request - 1 rat", soloHelper.alsoFR()),
            this.buildOutputLine("Also friend request - 2 rats", multiHelper.alsoFR()),

            this.buildOutputLine("Also wing invite - 1 rat", soloHelper.alsoWR()),
            this.buildOutputLine("Also wing invite - 2 rats", multiHelper.alsoWR()),

            this.buildOutputLine("ETA 1min", multiHelper.getEta(1)),
            this.buildOutputLine("ETA 2min", multiHelper.getEta(2)),
            this.buildOutputLine("ETA 10min", multiHelper.getEta(10)),
            this.buildOutputLine("ETA 22min", multiHelper.getEta(22)),
            this.buildOutputLine("ETA 23min", multiHelper.getEta(23)),
            this.buildOutputLine("ETA 50min", multiHelper.getEta(50)),
        ].join("\n\n");
    }

    private static buildOutputLine(name: string, autoSpatch: string) {
        return `## ${name}\n> ${autoSpatch}`;
    }

    public static getDispatchHelper(language: string, state: CaseCardState) {
        switch (language.toUpperCase()) {
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

    private static genericHelper(): CaseCardState {
        return {
            id: 0,
            rats: [] as any,
            connected: true,
            active: true,
            cr: true,
            nick: "Client",
            system: "Sol",
            sysconf: false,
            platform: "PS4",
            unread: true,
            prep: false,
            lang: "EN",
        };
    }

    private static getSingleRatState(): CaseCardState {
        return {
            ...this.genericHelper(),
            rats: {
                SoloRat15: {
                    assigned: true,
                    state: {},
                },
            },
        };
    }

    private static getMultiRatState(): CaseCardState {
        return {
            ...this.genericHelper(),
            rats: {
                FriendlyRat25: {
                    assigned: true,
                    state: {
                        fr: true,
                        wr: true,
                        bc: true,
                    },
                },
                TheOnlyRat19: {
                    assigned: true,
                    state: {
                        fr: true,
                        wr: false,
                    },
                },
                FriendlierRat34: {
                    assigned: true,
                    state: {
                        fr: false,
                        wr: false,
                    },
                },
            },
        };
    }

    public static async buildZIP() {
        try {
            const zip = new JSZip();
            const img = zip.folder("translations");
            if (img) {
                for (const lang of this.SUPPORTED_LANGUAGES) {
                    img.file(`${lang}.md`, this.getDispatchLines(lang));
                }
                const content = await zip.generateAsync({ type: "blob" });
                saveAs(content, "translations.zip");
            }
        } catch (err) {
            console.error(err);
        }
    }
}

window.TestTranslation = TestTranslation;
