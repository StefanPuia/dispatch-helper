import { CaseCardState } from "../components/case.card";
import { Coords } from "./utils";
import Utils from "./utils";
import { EventDispatcher } from "./event.dispatcher";
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
    ];

    public static async getClosestWaypoint(systemName: string): Promise<string> {
        try {
            const system = await Utils.getEDSMSystem(systemName);
            if (system && system.coords) {
                let closest: { dist: number; waypoint?: Waypoint } = { dist: Infinity };
                for (const waypoint of CaseHelper.WAYPOINTS) {
                    const dist = Utils.distanceBetween(waypoint.coords, system.coords);
                    if (dist < closest.dist) {
                        closest.dist = dist;
                        closest.waypoint = waypoint;
                    }
                }
                if (closest.waypoint) {
                    return `${closest.dist.toFixed(2)}LY to ${closest.waypoint.name}`;
                }
            }
        } catch (err) {
            EventDispatcher.dispatch("error", this, err.message);
        }
        return "no waypoint";
    }

    public static buildAutoDispatch(state: CaseCardState): AutoDispatch[] {
        const dispatchText = this.getDispatchText(state);
        const autoSpatch: AutoDispatch[] = [];

        if (state.lang !== "EN") {
            autoSpatch.push(this.buildADObject("EN", dispatchText.getEnglishCheck()));
        }

        // CODE RED
        if (state.cr) {
            if (!state.prep) {
                autoSpatch.push(this.buildADObject("PREP CR", dispatchText.getCRPrep(), dispatchText.getMMConf()));
            }
            autoSpatch.push(
                this.buildADObject(
                    "CR inst",
                    dispatchText.getCRPreInst(),
                    dispatchText.getCRInst(),
                    dispatchText.getBeacon(),
                    dispatchText.getWing(),
                    dispatchText.getPostCRInst()
                )
            );

            if (!state.sysconf) {
                autoSpatch.push(this.buildADObject("SYSCONF CR", dispatchText.getCRSysConf()));
            }

            autoSpatch.push(this.buildADObject("O2 CR", dispatchText.getCROxygen()));
            autoSpatch.push(this.buildADObject("POS CR", dispatchText.getCRPosition()));
        }

        // NORMAL RESCUE
        const allRats = Object.keys(state.rats);
        const assignedRats = allRats.filter((rat) => state.rats[rat].assigned === true);
        const fuelRats = assignedRats.filter((rat) => state.rats[rat].state.fuel === true);
        if (fuelRats.length > 0) {
            autoSpatch.push(this.buildADObject("SUCCESS", dispatchText.getSuccess()));
        }

        if (!state.prep && !state.cr) {
            autoSpatch.push(this.buildADObject("PREP", dispatchText.getWelcome(), dispatchText.getPrep()));
        }

        if (!state.sysconf && !state.cr) {
            autoSpatch.push(this.buildADObject("SYSCONF", dispatchText.getSysConf()));
        }

        const nonFrRats = assignedRats.filter((rat) => state.rats[rat].state.fr !== true);
        if (nonFrRats.length > 0) {
            if (nonFrRats.length === assignedRats.length) {
                autoSpatch.push(this.buildADObject("FR", dispatchText.getPreFR(), dispatchText.getFR()));
            } else {
                autoSpatch.push(this.buildADObject("ALSO FR", dispatchText.alsoFR(nonFrRats)));
            }
        }

        const nonWrRats = assignedRats.filter((rat) => state.rats[rat].state.wr !== true);
        if (nonWrRats.length > 0 && !state.cr) {
            if (nonWrRats.length === assignedRats.length) {
                autoSpatch.push(this.buildADObject("WR", dispatchText.getPreWing(), dispatchText.getWing()));
            } else {
                autoSpatch.push(this.buildADObject("ALSO WR", dispatchText.alsoWR(nonWrRats)));
            }
        }

        const bcRats = assignedRats.filter((rat) => state.rats[rat].state.bc === true);
        if (assignedRats.length > 0 && bcRats.length === 0) {
            autoSpatch.push(this.buildADObject("BC", dispatchText.getPreBeacon(), dispatchText.getBeacon()));
        }

        return autoSpatch;
    }

    private static buildADObject(info: string, ...text: string[]): AutoDispatch {
        return {
            info: info,
            clipboard: text.filter((t) => t && t.trim() !== "").join("\n"),
        };
    }

    private static getDispatchText(state: CaseCardState): DispatchTextAbstract {
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
                return new DispatchTextCZ(state);
            case "CS":
                return new DispatchTextCS(state);
            case "RO":
                return new DispatchTextRO(state);
            default:
                return new DispatchText(state);
        }
    }

    public static getSystemNote(system: string): string | undefined {
        return CaseHelper.LOCKED_SYSTEMS[(system || "").toUpperCase()];
    }
}

abstract class DispatchTextAbstract {
    abstract getWelcome(): string;
    abstract getPrep(): string;
    abstract getCRPreInst(): string;
    abstract getCRPrep(): string;
    abstract getCRInst(): string;
    abstract getPostCRInst(): string;
    abstract getMMConf(): string;
    abstract getPreFR(): string;
    abstract getFR(): string;
    abstract alsoFR(rats: string[]): string;
    abstract getPreWing(): string;
    abstract getWing(): string;
    abstract alsoWR(rats: string[]): string;
    abstract getPreBeacon(): string;
    abstract getBeacon(): string;
    abstract getSuccess(): string;
    abstract getCROxygen(): string;
    abstract getCRPosition(): string;
    abstract getSysConf(): string;
    abstract getCRSysConf(): string;
    abstract getEnglishCheck(): string;
}

class DispatchText implements DispatchTextAbstract {
    protected state: CaseCardState;

    public constructor(state: CaseCardState) {
        this.state = state;
    }

    protected localize(fact: string): string {
        if (this.state.lang !== "EN") return `${fact}-${this.state.lang.toLowerCase()}`;
        return fact;
    }

    protected consolize(fact: string): string {
        switch (this.state.platform) {
            case "PC":
                return `!pc${fact}`;
            case "PS4":
                return `!ps${fact}`;
            case "XB":
                return `!x${fact}`;
        }
    }

    protected fact(fact: string): string {
        return `${this.localize(this.consolize(fact))} ${this.state.nick}`;
    }

    public getEnglishCheck() {
        return `${this.state.nick} do you speak English?`;
    }

    public getCRPrep() {
        return this.fact("quit");
    }

    public getWing() {
        return this.fact("wing");
    }

    public getBeacon() {
        return this.fact("beacon");
    }

    public getPrep() {
        return `${this.localize("!prep")} ${this.state.nick}`;
    }

    public getFR() {
        if (this.state.cr && this.state.platform === "PC") {
            return this.fact("frcr");
        }
        return this.fact("fr");
    }

    public getWelcome() {
        return `${this.state.nick} welcome to the Fuel Rats, Please tell me when you have finished powering down modules (leaving Life Support ON) or if you need help with them.`;
    }

    public getCRPreInst() {
        return `${this.state.nick} i will give you a brief of what you have to do, DO NOT do any of this yet, try to remember these as you will have to do them very quick, let me know if you have any questions`;
    }

    public getCRInst() {
        return `${this.state.nick} when i give you the signal, you will log into OPEN play, turn on your wing beacon, then invite your rats to a wing, then come back here and let me know how much oxygen you have left.`;
    }

    public getPostCRInst() {
        return `${this.state.nick} again, DO NOT log in yet. just let me know if you understand the above.`;
    }

    public getMMConf() {
        return `${this.state.nick} please confirm you are at the main menu (where you can see your ship in the hangar)`;
    }

    public getPreFR() {
        return "";
    }

    public alsoFR(rats: string[]) {
        return `${this.state.nick} please also add: "${rats.join(`", "`)}"`;
    }

    public getPreWing() {
        return `${this.state.nick} now add your rats to a wing`;
    }

    public alsoWR(rats: string[]) {
        return `${this.state.nick} please also invite "${rats.join(`", "`)}" to your wing`;
    }

    public getPreBeacon() {
        return `${this.state.nick} lastly, enable your wing beacon so your rats can find you in the system`;
    }

    public getSuccess() {
        return `${this.state.nick} you should be receiving fuel now. Thank you for calling the FuelRats today. Please stick with your rat in game to get more tips about managing fuel :) Fly safe CMDR o7`;
    }

    public getSysConf() {
        return `${this.state.nick} can you take a look at the navigation panel to the left, and tell me the full system name in the top left corner?`;
    }

    public getCROxygen() {
        return `${this.state.nick} without logging in to check, do you remember how much oxygen you had left on the counter?`;
    }

    public getCRPosition() {
        return `${this.state.nick} without logging in to check, do you remember how close you were to any landmark (main star, planet, station etc)?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} can you take a look at the top-right corner of your screen, where your ship is in the hangar, and tell me the full system name?`;
    }
}

class DispatchTextRU extends DispatchText {
    public getWelcome() {
        return `Добро пожаловать к Топливным крысам, ${this.state.nick}. Пожалуйста, сообщите нам, когда вы отключите все модули, кроме системы жизнеобеспечения, или если вам нужна помощь в этом.`;
    }

    public getEnglishCheck() {
        return `${this.state.nick} ты говоришь по-английски?`;
    }

    public getCRPreInst() {
        return `${this.state.nick} Вот что вам нужно будет сделать. НЕ ДЕЛАЙТЕ этого пока я не скажу. Это только инструкции. Их нужно будет выполнять только когда я напишу вам «GO». После прочтения, скажите мне что вы всё прочитали и готовы продолжать.`;
    }

    public getCRInst() {
        return `${this.state.nick} 1 – войдите в ОТКРЫТУЮ игру, 2 – установите Маяк на КРЫЛО, 3 – пригласите всех Заправщиков в крыло, 4 – сообщите время на отсчете здесь и будьте готовы выйти, если я скажу.`;
    }

    public getPostCRInst() {
        return `${this.state.nick} Вам понятны эти инструкции? Если вам что-то непонятно, пожалуйста напишите "Doubt at:" и номер пункта, где нужно пояснение. Если всё понятно и вы готовы, напишите "I'm ready"`;
    }

    public getMMConf() {
        return `${this.state.nick} Не могли бы вы подтвердить, что вы вышли в Главное Меню.`;
    }

    public getPreFR() {
        const rats = Object.keys(this.state.rats).filter((rat) => this.state.rats[rat].assigned === true);
        return `${this.state.nick} Пожалуйста добавьте следующие имена в список друзей: "${rats.join(`", "`)}"`;
    }

    public alsoFR(rats: string[]) {
        return `${this.state.nick} пожалуйста, также добавь этих крыс в друзья: "${rats.join(`", "`)}"`;
    }

    public getPreWing() {
        return `${this.state.nick} Теперь добавьте ваших заправщиков в крыло`;
    }

    public alsoWR(rats: string[]) {
        return `${this.state.nick} пожалуйста, также пригласите этих крыс в крыло: "${rats.join(`", "`)}"`;
    }

    public getPreBeacon() {
        return `${this.state.nick} И наконец зажгите пожалуйста маяк крыла`;
    }

    public getSuccess() {
        return `${this.state.nick} Спасибо за ваше обращение к Fuel rats; мы рады, что смогли вам помочь. Вы можете включить ваши борт-системы. Пожалуйста оставайтесь в чате для полезных советов. Для русского языка наберите /join #debrief здесь - слева о`;
    }

    public getSysConf() {
        return `${this.state.nick} Можете ли вы посмотреть на панель навигации слева и сообщить мне полное имя системы в верхнем левом углу?`;
    }

    public getCROxygen() {
        return `${this.state.nick} если ты помнишь (не заходите в игру, чтобы проверить), Не могли бы вы сказать сколько времени оставалось на вашем отсчете кислорода?`;
    }

    public getCRPosition() {
        return `${this.state.nick} если ты помнишь (не заходите в игру, чтобы проверить), Не могли бы вы сказать мне, где в системе вы находились, когда у вас кончилось топливо?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} Можете ли вы взглянуть на правый верхний угол экрана, где в ангаре находится ваш корабль, и назвать мне полное имя системы?`;
    }
}

class DispatchTextDE extends DispatchText {
    public getWelcome() {
        return `${this.state.nick} Willkommen bei den Fuel Rats. Bitte lassen Sie mich wissen, wann Sie die Module ausgeschaltet haben (Lebenserhaltung eingeschaltet lassen) oder ob Sie Hilfe benötigen.`;
    }

    public getEnglishCheck() {
        return `${this.state.nick} sprechen Sie Englisch?`;
    }

    public getCRPreInst() {
        return `${this.state.nick} Hier ist eine Zusammenfassung der Dinge, die Du gleich tun musst! JETZT NOCH NICHT, wir sagen Dir, wann! Mach diese Dinge dann, wenn wir Dir "GO" senden. Nachdem Du das alles gelesen hast, sag mir bitte, dass Du soweit und bereit bist`;
    }

    public getCRInst() {
        return `${this.state.nick} 1 – einloggen in "offenes spiel", 2 – Signal einschalten. suche den Eintrag "Signal" (normalerweise 4. Zeile), 3 – Ratten ins Geschwader einladen, 4 – Deinen Sauerstoff hier reporten und bereit sein, Dich auszuloggen, wenn ich es Dir sage`;
    }

    public getPostCRInst() {
        return `${this.state.nick} Hast Du diese Anweisungen verstanden? Falls Du Dir nicht sicher bist, schreib bitte "Doubt at:" und die Nummer des Punktes, für welchen Du Fragen hast. Wenn Du alles verstanden hast und bereit bist, schreib mir: "I'm ready"`;
    }

    public getMMConf() {
        return `${this.state.nick} Kannst Du mir bitte bestätigen, dass Du im Hauptmenü bist?`;
    }

    public getPreFR() {
        const rats = Object.keys(this.state.rats).filter((rat) => this.state.rats[rat].assigned === true);
        return `${this.state.nick} Bitte füge diese Namen zu Deiner Freundeliste hinzu: "${rats.join(`", "`)}"`;
    }

    public alsoFR(rats: string[]) {
        return `${this.state.nick} Bitte füge diese Ratten auch deiner Freundesliste hinzu: "${rats.join(`", "`)}"`;
    }

    public getPreWing() {
        return `${this.state.nick} Jetzt lade Deine Ratten bitte in ein Geschwader ein`;
    }

    public alsoWR(rats: string[]) {
        return `${this.state.nick} Bitte füge diese Ratten auch deinem Geschwader hinzu: "${rats.join(`", "`)}"`;
    }

    public getPreBeacon() {
        return `${this.state.nick} Zum Abschluss schalte bitte Dein Geschwader-Leuchtfeuer ein.`;
    }

    public getSuccess() {
        return `${this.state.nick} Danke, dass Du die Fuel Rats gerufen hast! Wir freuen uns, dass wir Dir helfen konnten. Bitte schalte jetzt Deine Module wieder ein – fang am Besten mit dem Schild an. Bitte bleib noch eingeloggt und in diesem Chat, wir haben noch ein paar Tipps für Dich. Bitte gib /join #debrief ein und ein neuer Tab mit dem Raum für die Nachbesprechung wird oben erscheinen`;
    }

    public getSysConf() {
        return `${this.state.nick} Können Sie sich den Navigationsbereich links ansehen und mir den vollständigen Systemnamen in der oberen linken Ecke mitteilen?`;
    }

    public getCROxygen() {
        return `${this.state.nick} Wenn Sie sich erinnern (betreten Sie das Spiel nicht, um zu überprüfen), Kannst Du mir bitte sagen, wieviel Zeit noch auf dem Restsauerstoff-Zähler übrig war?`;
    }

    public getCRPosition() {
        return `${this.state.nick} Wenn Sie sich erinnern (betreten Sie das Spiel nicht, um zu überprüfen), Kannst DU mir sagen, wo Du im System warst, als Dir der Treibstoff ausging?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} Können Sie einen Blick in die obere rechte Ecke des Bildschirms werfen, in der sich Ihr Schiff im Hangar befindet, und mir den vollständigen Systemnamen mitteilen?`;
    }
}

class DispatchTextES extends DispatchText {
    public getEnglishCheck() {
        return `¿ ${this.state.nick} hablas inglés?`;
    }
}

class DispatchTextFR extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} parlez-vous anglais?`;
    }
}

class DispatchTextNB extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} snakker du engelsk?`;
    }
}

class DispatchTextTR extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} İngilizce biliyor musunuz?`;
    }
}

class DispatchTextPT extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} você fala inglês?`;
    }
}

class DispatchTextCZ extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} mluvíš anglicky?`;
    }
}

class DispatchTextPL extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} czy mówisz po angielsku?`;
    }
}

class DispatchTextCS extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} mluvíš anglicky?`;
    }
}

class DispatchTextHU extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} beszélsz angolul?`;
    }
}

class DispatchTextNL extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} spreek je engels?`;
    }
}

class DispatchTextIT extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} lei parla inglese?`;
    }
}

class DispatchTextRO extends DispatchText {
    public getEnglishCheck() {
        return `${this.state.nick} vorbesti engleza?`;
    }
}

export interface AutoDispatch {
    info: string;
    clipboard: string;
}

interface Waypoint {
    name: string;
    coords: Coords;
}
