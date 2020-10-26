import { CaseCardState } from "../../components/case.card";
import Config from "../config";

export default abstract class DispatchTextBase {
    protected state: CaseCardState;

    public constructor(state: CaseCardState) {
        this.state = state;
    }

    protected localize(fact: string): string {
        if (this.state.lang !== "EN") return `${fact}-${this.state.lang.toLowerCase()}`;
        return fact;
    }

    protected consolize(fact: string): string {
        if (["wing", "beacon", "fr", "quit", "modules"].includes(fact)) {
            return fact;
        }
        switch (this.state.platform) {
            case "PC":
                return `pc${fact}`;
            case "PS4":
                return `ps${fact}`;
            case "XB":
                return `x${fact}`;
        }
    }

    protected mechaDownFact(fact: string) {
        const localized = this.localize(fact);
        const en = `${fact}-en`;
        const factText = this.MechaFacts[localized] || this.MechaFacts[en];
        return factText ? `${this.state.nick} ${factText}` : "";
    }

    protected fact(fact: string, consolize: boolean = true): string {
        if (Config.mechaDown) {
            return consolize ? this.mechaDownFact(this.consolize(fact)) : this.mechaDownFact(fact);
        } else {
            return `!${this.localize(consolize ? this.consolize(fact) : fact)} ${this.state.nick}`;
        }
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

    public getSC() {
        return this.fact("sc", false);
    }

    public getPrep() {
        return this.fact("prep", false);
    }

    public getClose() {
        if (!Config.mechaDown) {
            return `!close ${this.state.id} ${this.getFirstLimpet() || ""}`;
        }
        return "";
    }

    public getFR() {
        if (this.state.cr && this.state.platform === "PC") {
            return this.fact("frcr");
        }
        return this.fact("fr");
    }

    protected fixRatNicks(rats: string[] = []) {
        return rats.map((rat) => rat.replace(/\[.+?\]/gi, ""));
    }

    public getAssignedRats() {
        if (Config.mechaDown) {
            return Object.keys(this.state.rats);
        }
        return Object.keys(this.state.rats).filter((rat) => this.state.rats[rat].assigned === true);
    }

    protected getAssignedRatsQuote() {
        return `"${this.fixRatNicks(this.getAssignedRats()).join(`", "`)}"`;
    }

    protected getRatNicksQuote(rats: string[] = []) {
        return `"${this.fixRatNicks(rats).join(`", "`)}"`;
    }

    public getCRVideoLink() {
        return "https://fuelrats.cloud/s/YYzSy2K2QKPfr4X";
    }

    public ratCount() {
        return this.getAssignedRats().length;
    }

    public isPlural() {
        return this.ratCount() !== 1;
    }

    public getFuelRats() {
        return this.getAssignedRats().filter((rat) => this.state.rats[rat] && this.state.rats[rat].state.fuel === true);
    }

    public getFirstLimpet() {
        return this.getAssignedRats().find((rat) => this.state.rats[rat].limpet === 0);
    }

    public getBCRats() {
        return this.getAssignedRats().filter(
            (rat) =>
                this.state.rats[rat] &&
                this.state.rats[rat].state.bc === true &&
                this.state.rats[rat].state.fuel !== true
        );
    }

    public getRatsNeedingFR() {
        return this.getAssignedRats().filter(
            (rat) =>
                this.state.rats[rat] &&
                this.state.rats[rat].state.fr !== true &&
                this.state.rats[rat].state.fuel !== true
        );
    }

    protected getRatsNeedingFRQuote() {
        return this.getRatNicksQuote(this.getRatsNeedingFR());
    }

    public getRatsNeedingWR() {
        return this.getAssignedRats().filter(
            (rat) =>
                this.state.rats[rat] &&
                this.state.rats[rat].state.wr !== true &&
                this.state.rats[rat].state.fuel !== true
        );
    }

    protected getRatsNeedingWRQuote() {
        return this.getRatNicksQuote(this.getRatsNeedingWR());
    }

    abstract alsoFR(): string;
    abstract alsoWR(): string;
    abstract disableSilentRunning(): string;
    abstract getBeaconAlt(): string;
    abstract getCRGO(): string;
    abstract getCRInst(): string;
    abstract getMMStay(): string;
    abstract getCROxygen(): string;
    abstract getCRPosition(): string;
    abstract getCRPreInst(): string;
    abstract getCRSysConf(): string;
    abstract getCRVideo(): string;
    abstract getDBChannel(): string;
    abstract getEnglishCheck(): string;
    abstract getEta(minutes: number): string;
    abstract getFailure(): string;
    abstract getMMConf(): string;
    abstract getPostCRInst(): string;
    abstract getPreBeacon(): string;
    abstract getPreFR(): string;
    abstract getPreWing(): string;
    abstract getPrepPing(): string;
    abstract getRefreshSocial(): string;
    abstract getSCEnter(): string;
    abstract getSCInfo(): string;
    abstract getSCLeave(): string;
    abstract getSuccess(): string;
    abstract getSysConf(): string;
    abstract getWelcome(): string;
    abstract lifeSupport(): string;
    abstract openPlay(): string;
    abstract oxygenCheck(): string;

    private MechaFacts: any = {
        "fueltank-cs": "Návod jak číst ukazatel paliva najdete zde: https://t.fuelr.at/fueltanken",
        "psrelog-cs":
            'Stiskněte OPTIONS a vyberte "Save and Exit to Main Menu" pro náležité odlogování. Pak stiskněte a držte tlačítko PS pro otevření menu rychlé volby a vyberte "Close application" a potvrďte OK. Pak znovu spusťte hru a připojte se do OPEN.',
        "xquit-cs":
            'Odhlašte se prosím okamžitě ze hry stisknutím MENU a vybráním možnosti "Save and Exit to Main Menu"!',
        "pcbeacon-cs":
            "Pro zapnutí majáku letky (BEACON) jděte do pravého panelu (standardně klávesou 4). Zvolte stránku SHIP (standardně klávesou Q), v podsekci FUNCTIONS pak vyberte BEACON a zvolte možnost WING.",
        "pcwing-cs":
            "Pro zaslání Pozvání do letky (WING INVITE) otevřete Comms Panel (standardně klávesou 2), stiskněte ESC pro ukončení vkládání textu a vyberte třetí panel (standardně klávesou E). Vyberte jméno hráče (CMDR) kterého chcete přizvat do letky a zvolte [Invite to Wing]",
        "xrelog-cs":
            'Stiskněte start a vyberte "Save and Exit to Main Menu" pro náležité odlogování. Pak stiskněte tlačítko XBox, stiskněte start a vyberte "Quit game". Pak znovu spusťte hru a připojte se do OPEN.',
        "reboot-cs":
            "Každá loď má schopnost základní opravy modulů. Pro restart/opravu jděte do pravého panelu, zvolte stránku SHIP. V sekci FUNCTIONS najděte volbu REBOOT/REPAIR. Vyberte ji a potvrďte. Loď se pokusí opravit zničené moduly na 1%.",
        "kgbfoam-cs": "Jak najít hvězdy, ze kterých lze čerpat palivo: https://t.fuelr.at/kgbfoamcs",
        "prepcr-cs":
            "Prosím zaznamenejte si svou herní lokaci a poté se okamžitě odpojte do herního menu pomocí klávesy ESC a volby Save and Quit to Main Menu",
        "sc-cs":
            "Aktivujte opět své motory a Frameshift Drive, zrušte zaměření Jump systému a skočte do Super Cruise. Leťte od hvězdy asi tak 5 LS a pak se vraťte zpět do normálního vesmíru.",
        "pcquit-cs":
            'Odhlašte se prosím okamžitě ze hry stisknutím ESC a vybráním možnosti "Save and Exit to Main Menu"!',
        "xbeacon-cs":
            "Pro zapnutí majáku letky (BEACON) podržte X a stiskněte DOPRAVA na D-PADu. Zvolte stránku SHIP (standardně tlačítky LB/RB), v podsekci FUNCTIONS pak vyberte BEACON a zvolte možnost WING.",
        "xwing-cs":
            "Pro zaslání Pozvání do letky (WING INVITE) podržte X a zmáčkněte nahoru na D-PADu, zvolte třetí stránku (standardně klávesou RB). Vyberte jméno hráče (CMDR), kterého chete přizvat do letky a zvolte [Invite to Wing]",
        "crinst-cs":
            "Až ti řekneme (NE TEĎ!), prosim připoj se do OPEN PLAY, zapni svůj maják letky (Wing Beacon) a poté pozvi všechny své krysy do letky (Wing)",
        "psquit-cs":
            'Odhlašte se prosím okamžitě ze hry stisknutím OPTIONS a vybráním možnosti "Save and Exit to Main Menu"!',
        "xmodules-cs":
            "Pro vypnutí modulů jděte do pravého panelu (podržte X a stiskněte vpravo na D-PADu), zvolte stránku MODULES (standardně tlačítky LB/RB) a postupně vyberte a deaktivujte všechny moduly KROMĚ PODPORY ŽIVOTA (Life support). Nelze vypnout Power plant a Canopy.",
        "prep-cs":
            "Prosím vyskočte ze SuperCruise a zastavte loď. Vypněte všechny moduly kromě LIFE SUPPORTu (instrukce jak na to jsou k dispozici). Pokud se kdykoliv objeví nouzový odpočet kyslíkové rezervy, dejte nám okamžitě vědět.",
        "pswing-cs":
            "Pro zaslání Pozvání do letky (WING INVITE) podržte čtverec a stiskněte nahoru na D-PADu, zvolte třetí stránku (standardně tlačítkem R1). Vyberte jméno hráče (CMDR) kterého chcete přizvat do letky a zvolte [Invite to Wing]",
        "psfr-cs":
            "Pro zaslání žádosti o přátelství zmáčkněte PS tlačítko, otevřete funkce -> přátelé, vyhledejte jméno přidělené Krysy a přidejte ji do přátel.",
        "pcmodules-cs":
            "Pro vypnutí modulů, jděte do pravého panelu (standardně klávesou 4), zvolte stránku MODULES (standardně klávesami Q, E) a postupně vyberte a deaktivujte všechny moduly KROMĚ PODPORY ŽIVOTA (Life support). Nelze vypnout Power plant a Canopy.",
        "xfr-cs":
            "Pro zaslání žádosti o přátelství stiskněte XBOX tlačítko, poté DOLEVA na D-PADu, poté 4x DOLŮ na D-PADu a vyhledejte jméno Krysy. Je nutné přidat Krysu jako OBLÍBENÉHO přítele (FAVORITE).",
        "psmodules-cs":
            "Pro vypnutí modulů jděte do pravého panelu (poklepejte na pravý spodní roh touchpadu), zvolte stránku MODULES (standardně tlačítky L1/R1) a postupně vyberte a deaktivujte všechny moduly KROMĚ PODPORY ŽIVOTA (Life support). Nelze vypnout Power plant a Canopy.",
        "psbeacon-cs":
            "Pro zapnutí majáku letky (BEACON) jděte do pravého panelu (poklepejte na pravý spodní roh touchpadu). Zvolte stránku SHIP (standardně tlačítky L1/R1), v podsekci Functions pak vyberte BEACON a zvolte možnost WING.",
        "multi-cs":
            "Prosím nevěnujte pozornost zprávám, které neobsahují vaše jméno - pravděpodobně nejsou určeny vám. Často probíhá několik záchran najednou, takže ne vše je směřováno na vás.",
        "pqueue-cs":
            "Vítejte u Fuel Rats! Právě máme plné ruce práce s jinými záchranami. Prosím odhlašte se ze hry abychom předešli zbytečnému plýtvání paliva. Budeme se vám věnovat během několika minut.",
        "o2synth-cs":
            "Pro doplnění zásob kyslíku otevřete pravý panel, stránku INVENTORY, vyberte podsekci SYNTHESIS (ikona molekuly, pátá v pořadí) a LIFE SUPPORT. Pro doplnění potřebujete 2x železo (iron) a 1x nikl (nickel). Doplnění trvá přibližně 20 sekund.",
        "pcfr-cs":
            "Pro zaslání žádosti o přátelství jděte do Menu (stiskněte ESC), vyberte SOCIAL. Vyhledejte jméno přidělené Krysy a klikněte ADD FRIEND.",
        "xbeacon-de":
            "Um das Geschwadersignal zu aktivieren, Halte die X-Taste und drücke RECHTS auf dem Steuerkreuz. Gehe zum SCHIFF-Menü (Tasten LB/RB), dann im FUNKTIONEN-Untermenü wähle SIGNAL und setze es auf GESCHWADER.",
        "pcmodules-de":
            "Um deine Module auszuschalten, gehe bitte zu deinem rechten Panel (Standardtaste 4), wechsle zu MODULEN (Standardtasten E/Q), wähle jedes Modul einzeln an und deaktiviere es. (Du kannst dein Kraftwerk nicht abschalten, das ist normal und du solltest deine Lebenserhaltung an lassen!)",
        "reboot-de":
            "Um Dein Schiff zu reparieren, gehe ins rechte Panel, öffne das SCHIFF-Menü, gehe zu Neustart/Reparieren. Klicke darauf und bestätige den Neustart.",
        "o2synth-de":
            'Um Deinen Sauerstoff aufzufüllen, gehe ins rechte Panel, Inventar-Menü, dann scrolle zum Synthese-Untermenü runter (5tes Untermenü). Scrolle zur Lebenserhaltung runter und klicke auf "Lebenserhaltung auffüllen". Es benötigt 2 Eisen, 1 Nickel und braucht 20sec Zeit.',
        "pcbeacon-de":
            "Um das Geschwadersignal zu aktivieren, gehe zum rechten Menü (Taste 4), gehe zum SCHIFF-Menü (Taste Q), dann im FUNKTIONEN-Untermenü wähle SIGNAL und setze es auf GESCHWADER.",
        "crinst-de":
            "Sobald es dir gesagt wird, (NICHT JETZT!) logge dich bitte in OFFENES SPIEL (OPEN PLAY) ein, setzte dein SIGNAL auf GESCHWADER und lade alle deine zugewiesenen Rats zu deinem Geschwader ein!",
        "invite-de":
            "Klicke hier für eine Anleitung, wie man Geschwadereinladungen annimmt: https://marenthyu.de/invites.png",
        "rc-de":
            "HEY! #fuelrats ist nur für Rettungsoperationen, wenn du/ihr reden möchtest, tritt bitte #RatChat bei indem du '/join #RatChat' in den Chat schreibst.",
        "ratchat-de":
            "HEY! #fuelrats ist nur für Rettungsoperationen, wenn du/ihr reden möchtest, tritt bitte #RatChat bei indem du '/join #RatChat' in den Chat schreibst.",
        "kgbfoam-de":
            "Um zu lernen wie man die Galaxiekarte filtert, klicke auf diesen Link: https://t.fuelr.at/kgbfoamde",
        "pw-de": "Zeit für den Papierkram! https://www.fuelrats.com/paperwork/",
        "galnet-de": "Hier ist ein Link zum GalNet: https://community.elitedangerous.com/galnet",
        "pcquit-de":
            "Bitte logge dich SOFORT aus dem Spiel aus, indem du ESC drückst und Speichern und zum Hauptmenü auswählst!",
        "pcwing-de":
            "Um eine Geschwadereinladung zu senden, gehe zum Kommunikationsmenü (Taste 2), drücke ESC um das Chat Eingabefeld zu schließen, und gehe dann zum dritten Reiter (Taste E). Dann wähle den CMDR aus, dem du die Winganfrage senden willst, drücke die Leertaste und wähle Geschwadereinladung.",
        "xwing-de":
            'Um eine Geschwadereinladung zu senden, halte die X-Taste und drücke "hoch" auf dem Steuerkreuz. Gehe zum dritten Reiter (Taste RB). Dann wähle den CMDR aus, dem du die Winganfrage senden willst und wähle Geschwadereinladung.',
        "xquit-de": "Bitte logge dich SOFORT aus, indem du MENU drückst und Speichern und zum Hauptmenü!",
        "prepcr-de":
            "Bitte gehe sofort aus dem Spiel raus ins Hauptmenü von Elite Dangerous, wo du dein Schiff im Hangar siehst.",
        "psfr-de":
            "Um die Rats zu deiner Freundesliste hinzuzufügen drücke einmal auf den PS-Knopf, dann öffne den Freundesbildschirm im Funktionsbereich, suche nach dem Namen der Rats und füge die Rats als Freund hinzu.",
        "multi-de":
            "Bitte ignoriere Nachrichten, in denen dein Name nicht vorkommt! Wir retten normalerweise mehrere Leute gleichzeitig, weshalb nicht alles an dich gerichtet ist!",
        "pcfr-de":
            "Um eine Freundesanfrage zu senden, gehe zum Menü (Drücke ESC), klicke auf SOZIAL und suche oben rechts nach dem Namen. Klicke darauf und klicke dann auf FREUND HINZUFÜGEN.",
        "pg-de":
            "Um einer privaten Gruppe beizutreten, gehe ins Hauptmenü, klicke auf START und dann auf Private Gruppe. Danach klicke auf den Namen der Rat oder der Name der dir gesagt wurde um in die Private Gruppe zu starten.",
        "xmodules-de":
            "Um deine Module auszuschalten, gehe bitte zu deinem rechten Panel (Taste X und rechts auf dem Steuerkreuz), wechsle zu MODULEN (Tasten LB/RB), wähle jedes Modul einzeln an und deaktiviere es. (Du kannst dein Kraftwerk nicht abschalten, das ist normal und du solltest deine Lebenserhaltung an lassen!)",
        "psquit-de":
            "Bitte logge unverzüglich aus, indem du die OPTIONS-Taste drückst und Speichern und zum Hauptmenü auswählst!",
        "psbeacon-de":
            "Um das Geschwadersignal zu aktivieren, gehe zum rechten Menü (berühre die untere rechte Ecke des Touchpads), gehe zum SCHIFF-Menü (Tasten L1/R1), dann im FUNKTIONEN-Untermenü wähle SIGNAL und setze es auf GESCHWADER.",
        "pswing-de":
            'Um eine Geschwadereinladung zu senden, halte die "Viereck"-Taste und drücke "hoch" auf dem Steuerkreuz. Gehe zum dritten Reiter (Taste R1). Dann wähle den CMDR aus, dem du die Winganfrage senden willst und wähle Geschwadereinladung.',
        "psmodules-de":
            "Um deine Module auszuschalten, gehe bitte zu deinem rechten Panel (berühre die untere rechte Ecke des Touchpads), wechsle zu MODULEN (Tasten L1/R1), wähle jedes Modul einzeln an und deaktiviere es. (Du kannst dein Kraftwerk nicht abschalten, das ist normal und du solltest deine Lebenserhaltung an lassen!)",
        "prep-de":
            "Bitte falle vom Supercruise in den Normalraum und komme zum Stehen. Deaktiviere alle Module AUSSER der LEBENSERHALTUNG (Instruktionen sind bereit, falls nötig). Falls irgendwann der Sauerstoff-Countdown beginnt, lasse es uns sofort wissen.",
        "xfr-de":
            "Um die Ratte(n) zu deiner Freundesliste hinzuzufügen drücke einmal auf den Xbox-Knopf, dann auf dem digitalen Steuerkreuz einmal nach RECHTS und viermal nach UNTEN. Jetzt drücke auf A und suche nach dem Namen der Ratte. Bitte füge die Ratte(n) als FAVORIT hinzu.",
        "sc-de":
            "Bitte reaktiviere deine Schubdüsen und Frameshiftantrieb, wähle alle Ziele AB und gehe in den Supercruise. Flieg circa 5 Ls weit weg vom Stern des Systems, dann falle zurück in den normalen Raum.",
        "sysnames-en": "Common system and sector names: https://t.fuelr.at/sysnames",
        "pcbeacon-en":
            "To light your wing beacon, go to the right panel (Default key 4), navigate to the SHIP tab (Default key Q), then in the FUNCTIONS sub-screen select BEACON and set it to WING",
        "reboot-en":
            "To reboot/repair your ship, go to the right side panel, open the ship menu then scroll down to reboot/repair. Click and confirm reboot",
        "xmodules-en":
            "To power down your modules, please go to your right panel (default X + right on the D-pad), switch to the MODULES tab (default key LB/RB), select every Module once and deactivate it. (You can not deactivate your Power Plant and should not deactivate your Life Support!)",
        "squadron-en":
            "To join the Fuel Rats squadron you must both apply in-game (FUEL) and fill out the form at https://t.fuelr.at/squadronapply using your Fuel Rats account. Please read the terms of squadron membership carefully.",
        "pcfrcr-en":
            "To send a friend request, stay in the Main Menu, click SOCIAL, search for your rat(s) in the top right and click to add",
        "pcwing-en":
            "To send a wing request, go to the comms panel (Default key 2), hit ESC to get out of the chat box, and move to the third panel (Default key E). Then select your Rat(s) and select Invite to wing",
        "donate-en":
            "Although our service is entirely free, if you wish you can help us cover expenses such as server cost by donating at https://fuelrats.com/donate",
        "ircfaq-en": "https://t.fuelr.at/ircfaq",
        "netlog-en":
            "Hello honoured client and thank you for helping us help Frontier help us help you. Here is how to find your netlog https://t.fuelr.at/netlog",
        "rc-en":
            "Hello, #fuelrats is reserved for active rescues, if you wish to chat please join #ratchat by typing '/join #ratchat'",
        "requestdrill-en":
            "Please read all the steps on the https://t.fuelr.at/join including linked pages and the final step 6.",
        "ps4stats-en": "https://t.fuelr.at/ps4stats",
        "tfrm-en":
            "The Fuel Rats HQ is located in Fuelum, Local Bubble. Located there is also our own in-game faction The Fuel Rats Mischief https://confluence.fuelrats.com/display/BGS/TFRM+BGS+Task",
        "social-en": "Connect with Us and Be Alerted about rescues: https://t.fuelr.at/social",
        "media-en": "Fuel Rats in the Media https://t.fuelr.at/media",
        "status-en": "Check our service status here: https://status.fuelrats.com",
        "summoncase-en": "Too quiet? Summon a case: https://t.fuelr.at/summon",
        "shipregistry-en": "https://confluence.fuelrats.com/display/FRKB/Fuel+Rats+Ship+Registry",
        "frkb-en": "Fuel Rats Knowledge Base: https://t.fuelr.at/frkb",
        "changes-en": "For a changelog, please check https://github.com/FuelRats/pipsqueak/releases",
        "o2synth-en":
            "To refill your oxygen supply: Go to your right side panel, Modules tab. Scroll down to 'Life Support' select it and click 'Resupply Life Support'. Requires 2 Iron and 1 Nickel, and takes 20 seconds to complete",
        "sc-en":
            "Reactivate your thrusters and Frameshift drive, then Un-target everything and jump to supercruise. Fly away from the star for about 5 Ls, then drop back down into normal space.",
        "pw-en":
            "Paperwork is auto-generated from case info, and each pw link is unique. Miss your link? Go to your account page on the website to access the rescue manually.",
        "debrief-en": "Guide for debriefing clients: https://t.fuelr.at/debrief",
        "stats-en": "Fuel Rats' Statistics: https://t.fuelr.at/stats",
        "xbeacon-en":
            "To light your wing beacon hold X and press RIGHT on the D-pad. Navigate to the SHIP tab (default LB/RB) then in the FUNCTIONS sub-screen select beacon and set it to WING",
        "xwing-en":
            "To add the rats to your wing hold the X button and press up on the D-pad, move to the third tab (default using RB), then select the name of a rat and select [Invite to wing]",
        "idea-en": "https://t.fuelr.at/idea",
        "lexicon-en": "https://t.fuelr.at/lexicon",
        "xbtrouble-en": "Xbox troubleshooting guide: https://t.fuelr.at/xbtrouble",
        "sop-en": "Here are our Standard Operating Procedures: https://t.fuelr.at/sop",
        "findsystem-en":
            "View this article to help the client find their star system using log files in an emergency https://t.fuelr.at/findsystem",
        "roster-en": "People Who Do Stuff: https://confluence.fuelrats.com/display/FRKB/People+Who+Do+Stuff",
        "xquit-en": "Please log out of the game immediately by pressing MENU and selecting Exit to Main Menu!",
        "kgbfoam-en": "To learn about Filtering the Galaxy Map, click here: https://t.fuelr.at/kgbfoam",
        "ns-en":
            "Switch to the FuelRats tab in the top left corner (Or your Status window) and identify with NickServ with the following command, but replace <password> with your password: /msg NickServ IDENTIFY <password>",
        "tos-en": "Please consult our Terms of Service and Code of Conduct here https://fuelrats.com/terms-of-service",
        "hexchatalerts-en":
            "https://t.fuelr.at/hexchatalerts Custom highlights and alerts for Hexchat! See pings without needing to change tabs! Different sounds for different alerts! Quiet r-signals while off-duty without deleting them! NEW/BETA Nickname/hostmask filtering! Exclamation points! (New release 0.6 2016-12-01)",
        "nominate-en":
            "Please use the following form to nominate a fellow Rat for an EPIC rescue: https://t.fuelr.at/epic",
        "mechacmd-en": "https://t.fuelr.at/mechacmd",
        "rattracker-en":
            "RatTracker is a rescue tracking app for Windows that allows you to track rescues and call status updates to IRC. You can find it at https://t.fuelr.at/ratt - Please note that this is an in-development app.",
        "store-en": "Awesome Fuel Rats merchandise at your fingertips at https://fuelrats.com/store/products",
        "pg-en":
            "To Log into a Private Group: From the main menu click Continue, then Private Group Session, then the rat's or otherwise told name and finally: Connect to Private Group Session.",
        "scanner-en": "Looking for materials on planet? See the useful guide here https://www.wavescanner.net/",
        "ratchat-en":
            "Hello, #fuelrats is reserved for active rescues, if you wish to chat please join #ratchat by typing '/join #ratchat'",
        "ircguides-en": "Here are some guides to setting up IRC clients: https://t.fuelr.at/ircguide",
        "training-en": "Check out our training opportunities: https://t.fuelr.at/training",
        "loadouts-en":
            "For a rudimentary guide on how to construct a Rat-capable ship, please read through our documentation here: https://t.fuelr.at/loadouts",
        "psfr-en":
            "To add the rats to your friends list, press the PS button, open the friends screen from the functions area, search for your rat's name, and add them as a friend.",
        "nsgroup-en":
            "If you add tags on your nick, make sure it gets 'grouped' with nickserv to your basenick. This just needs to be done once. Command is: /msg nickserv group <nickname> <password> (without the < > ofcourse, and best done in the private status tab)",
        "neutron-en":
            "Cruise the outer galaxy with style using Spansh's neutron star plotting tool https://www.spansh.co.uk with this https://u.cubeupload.com/I9i9mq.jpg and the caveats mentioned here https://imgur.com/FWY2gSm",
        "leaderboard-en": "https://fuelrats.com/leaderboard",
        "russia-en": "https://confluence.fuelrats.com/display/FRKB/Connection+problems+with+Russians",
        "psquit-en": "Please log out of the game immediately by pressing OPTIONS and selecting Exit to Main Menu!",
        "board-en":
            "Fuel Rats dispatch board: https://dispatch.fuelrats.com/ Did you know web browsers have a feature to save pages you need often for easy access?",
        "founder-en":
            'The Fuel Rats Mischief was founded by Surly Badger on 2nd June, 3301 https://t.fuelr.at/forum. The station "Surly\'s Nest" was built in the Rodentia system in his honour.',
        "psbeacon-en":
            "To light your wing beacon go to the right panel (default tap the bottom right corner of the touchpad). Switch to the SHIP tab (default L1/R1), then in the FUNCTIONS sub-screen select beacon and set it to WING",
        "pswing-en":
            "To add the rats to your wing hold the square button and press up on the D-pad, move to the third tab (default using R1), then select the name of a rat and select [Invite to wing]",
        "psmodules-en":
            "To power down your modules, please go to your right panel (default tap the bottom right corner of the touchpad), switch to the MODULES tab (default key L1/R1), select every Module once and deactivate it, EXCEPT LIFE SUPPORT. (You can not deactivate your Power Plant or Canopy and should not deactivate your Life Support!)",
        "pqueue-en":
            "Hello, and welcome to the Fuel Rats rescue service! Please log out to main menu at this time, as we have quite a few people looking for help right now. We'll get to you real soon!",
        "guide-en":
            "For a not so brief guide on how to conduct a rescue, please refer to the following: https://t.fuelr.at/guiderat",
        "pstrouble-en": "PS4 Troubleshooting Guide: https://t.fuelr.at/ps4trouble",
        "fueltank-en": "Please take a look at this for reading the fuel gauge: https://t.fuelr.at/fueltanken",
        "planets-en": "https://i.redd.it/kxi8qyzcuery.jpg",
        "allfacts-en": "The full list is here: https://t.fuelr.at/allfacts",
        "pcmodules-en":
            "To power down your modules, please go to your right panel (default key 4), switch to the MODULES tab (default keys e or q), select every Module once and deactivate it. (You can not deactivate your Power Plant and should not deactivate your Life Support!)",
        "invite-en": "See this short guide on how to accept wing invites: https://t.fuelr.at/invite",
        "mdguide-en": "Not sure how a case should be closed? https://t.fuelr.at/caseguide",
        "caseguide-en": "Not sure how a case should be closed? https://t.fuelr.at/caseguide",
        "boardbeta-en": "https://beta.dispatch.fuelrats.com/",
        "privacy-en": "You can find the Fuel Rats Privacy policy here https://fuelrats.com/privacy-policy",
        "rumanual-en": "RU Dispatch Manual: https://t.fuelr.at/rumanual",
        "drillrequest-en":
            "Please read all the steps on the https://t.fuelr.at/join including linked pages and the final step 6.",
        "prep-en":
            "Please exit supercruise and come to a stop. Keep Life Support ON, and disable all other modules you can disable (you can't disable them all - instructions available if needed). If an oxygen countdown timer appears at all let us know right away.",
        "xfr-en":
            "To add the rats to your friends list, tap the XBOX button, then press RIGHT on the D-PAD. Now press DOWN on the D-PAD 4 TIMES and search for the rat's name. Make sure to add the rat(s) as a FAVORITE friend.",
        "founded-en":
            'The Fuel Rats Mischief was founded by Surly Badger on 2nd June, 3301 https://t.fuelr.at/forum. The station "Surly\'s Nest" was built in the Rodentia system in his honour.',
        "sctimes-en":
            "Trying to work out how long to get to a client in supercruise? Check out this link for a rough guide: https://t.fuelr.at/sctimes",
        "repairs-en": "Repair case? Take a look at our guide on how to handle repair cases: https://t.fuelr.at/ojh",
        "newrat-en": "There are a few links on this page you should read => https://t.fuelr.at/join",
        "navcheck-en":
            "In order to check if client has Fuel, wing them and in their system check your local navpanel. It should say exceeds wing. If this is not the case, the client has fuel and can jump. Fuel Needed: https://t.fuelr.at/pwz Able to Jump: https://t.fuelr.at/px5",
        "signals-en": "Don't know who to call, or how to get a hold of them? https://t.fuelr.at/signals",
        "coc-en": "Please consult our Terms of Service and Code of Conduct here https://fuelrats.com/terms-of-service",
        "donatesop-en":
            "Donations are back! Clients who ask whether they can pay for our services can be told that although the service is free, they can donate to help cover our running costs. Donation link: https://t.fuelr.at/donate. You can also use the !donate fact.",
        "snickers-en": "What is our obsession with Snickers? https://t.fuelr.at/snickers",
        "stream-en": "Please read and follow our Streaming and Recording Guidelines: https://t.fuelr.at/stream",
        "shirts-en": "Look stylish with Fuel Rats t-shirts 😎 https://t.fuelr.at/shirts",
        "pcfr-en":
            "To send a friend request, go to the menu (Hit ESC), click SOCIAL, and search for a friend in the upper right. Click them, then click ADD FRIEND.",
        "r2r-en":
            "Spansh's Road to Riches is a route plotter that will take you through the most valuable known systems and lists planets to map. Make sure you have a detailed surface scanner, then use the following link to plot your Road to Riches: https://spansh.co.uk/riches",
        "cert-en":
            "If you need to generate a SSL client certificate for identifying with Nickserv, you can generate one at http://marenthyu.de/cgi-bin/sslcertgen.cgi",
        "redeem-en":
            "To redeem your Fuel Rats Decal code go here: https://user.frontierstore.net/code/redeem - Make sure to login with the respective platform service that you want to redeem the decal on.",
        "pcquit-en":
            "Please log out of the game immediately by pressing ESC and selecting Exit followed by Exit to Main Menu!",
        "report-en":
            "Need to report the behaviour of an on-duty Fuel Rat, or a Fuel Rats squadron member? Email ops@fuelrats.com",
        "prepcr-en": "Please immediately exit to the Elite Dangerous Main Menu, where you see your ship in the hangar.",
        "rcclient-en": "=================== CLIENT IN RATCHAT, KEEP CHANNEL CLEAR ===================",
        "nltt-en":
            "NLTT 48288 is positioned right where you will run out of fuel if you plot a route in a particular direction from the old starting station in a stock sidewinder. Because of this it was the most common system for rescues. If you see a signal from this system, take a drink!",
        "pcbeacon-es":
            "Para activar tu baliza, ve al panel de la derecha (Tecla 4), ve hacia la pestaña NAVE (tecla Q), selecciona BALIZA en la pantalla FUNCIONES y cámbiala de DESACTIVADA a ESCUADRÓN",
        "psmodules-es":
            "Para desactivar tus módulos, ve al panel derecho (por defecto presiona la esquina inferior derecha del touchpad), ve a la pestaña de MÓDULOS (por defecto L1/R1), selecciona cada módulo y desactívalo EXCEPTO tu SOPORTE VITAL. (No es posible desactivar el Núcleo de Energía o la Cúpula de la Cabina y no deberías desactivar tu Soporte Vital!)",
        "o2synth-es":
            'Para recargar tu suministro de oxígeno, ve al panel de la derecha (Tecla 4), ve hacia la pestaña CARGA y baja hasta la 5ta pantalla: SÍNTESIS (el panal). Desplázate hacia abajo hasta "Soporte Vital" y pulsa "Recargar el Soporte Vital". Necesita 2 unidades de Hierro y 1 de Níquel, y tarda 20 segundos en completarse',
        "xbeacon-es":
            "Para activar tu baliza mantén pulsado X y presiona DERECHA en la cruceta. Ve a la pestaña NAVE (botones LB/RB), selecciona BALIZA en la pantalla FUNCIONES y cámbiala de DESACTIVADA a ESCUADRÓN.",
        "xmodules-es":
            "Para desactivar tus módulos, ve al panel derecho (por defecto X + DERECHA en la cruceta), ve a la pestaña de MÓDULOS (por defecto LB/RB), selecciona cada módulo y desactívalo. (No es posible desactivar el Núcleo de Energía y no deberías desactivar tu Soporte Vital!)",
        "pcwing-es":
            "Para enviar una invitación a escuadrón, ve al panel de comunicaciones (Tecla 2), pulsa ESC para salir del cuadro de chat, muévete al tercer panel (tecla E). Selecciona el COMANDANTE al que quieras invitar a tu escuadrón y selecciona “Invitar al escuadrón”",
        "reboot-es":
            "Para reiniciar/reparar tu nave, ve al panel de la derecha (Tecla 4), ve hacia la pestaña NAVE (tecla Q), selecciona REINCIAR en la pantalla FUNCIONES y confirma el reinicio",
        "pcfrcr-es":
            "Para enviar una solicitud de amistad, permanece en el menu principal, clic en amigos y grupos privados, y busca el nombre del comandante a añadir. Por último haz clic en él y selecciona AÑADIR AMIGO",
        "pcquit-es":
            "Por favor, sal del juego inmediatamente presionando ESC y seleccionando Salvar y Salir al Menu Principal",
        "prepcr-es": "Por favor salga al Menu Principal de Elite Dangerous, dónde puede ver su nave en el hangar.",
        "ratchat-es":
            "OYE! #fuelrats es sólo para operaciones de rescate, si quieres chatear, por favor, entra en #RatChat escribiendo '/join #RatChat’",
        "rc-es":
            "OYE! #fuelrats es sólo para operaciones de rescate, si quieres chatear, por favor, entra en #RatChat escribiendo '/join #RatChat’",
        "kgbfoam-es":
            "Para aprender sobre el filtrado en el mapa de la Galaxia click aquí: https://t.fuelr.at/kgbfoames",
        "xwing-es":
            'Para añadir tus "fuelrats" a tu escuadrón, mantén pulsado el botón X y presiona ARRIBA en la cruceta, ve al tercer panel (botón RB), selecciona el nombre del "fuelrat" y selecciona [Invitar al escuadrón]',
        "xquit-es":
            "Por favor, sal del juego inmediatamente presionando el botón MENU y selecciona Guardar y Salir al Menu Principal!",
        "xfr-es":
            "Para añadir a las Rats a tu lista de amigos, pulsa el botón XBOX, luego pulsa DERECHA en la CRUCETA, luego ABAJO 4 veces, y busca el nombre de la rat. Asegurate de añadirlas como AMIGO FAVORITO.",
        "pcfr-es":
            "Para enviar una solicitud de amistad, ve al menu (tecla ESC), clic en SOCIAL, y busca el nombre del comandante a añadir. Por último haz clic en él y selecciona AÑADIR AMIGO",
        "sc-es":
            "Reactiva tus propulsores y el motor de salto, entonces deselecciona todo y salta a supercrucero. Vuela lejos de la estrella al menos 5 sl, entonces baja de nuevo al estado normal.",
        "psquit-es":
            "Por favor sal del juego inmediatamente presionando OPCIONES y seleccionando “Guardar y Salir al Menú Principal”!",
        "psfr-es":
            "Para añadir las ratas a tu lista de amigos, presiona el botón PS, abre la ventana de amigos desde el apartado de funciones, busca el nombre de tu rata y añádelo como amigo.",
        "psrelog-es":
            "Presiona OPCIONES y selecciona “Guardar y Salir al Menú Principal” para salir del juego correctamente. Luego mantén pulsado el botón PS para abrir el menú rápido, selecciona “Cerrar Aplicación” y dale a OK. Después, abre el juego y entra en juego ABIERTO",
        "psbeacon-es":
            "Para activar tu baliza ve al panel derecho (por defecto presiona la esquina inferior derecha del touchpad). Luego ve a la pestaña NAVE (botones L1/R1), selecciona BALIZA en la pantalla FUNCIONES y cámbiala de DESACTIVADA a ESCUADRÓN.",
        "pswing-es":
            'Para añadir tus "fuelrats" a tu escuadrón mantén pulsado CUADRADO y pulsa flecha hacia arriba, ve al tercer panel (botón R1), selecciona el nombre del "fuelrat" y selecciona [Invitar al escuadrón]',
        "crinst-es":
            "Cuando te lo digamos (AHORA NO!), por favor entra en JUEGO ABIERTO, activa tu BALIZA DE ESCUADRÓN y finalmente INVITA tus ratas al escuadrón!",
        "prep-es":
            "Por favor, sal de supercrucero, detente completamente y desactiva todos los módulos EXCEPTO el soporte vital (instrucciones disponibles si es necesario). ¡Si aparece una cuenta regresiva de oxígeno de emergencia, infórmenos inmediamente!",
        "xrelog-es":
            'Presiona Start, elige Salir al menú principal para salir de forma apropiada. Luego presiona el botón de Xbox, presiona Start, y elige "Salir del Juego". Cuando eso termine, abre Elite Dangerous de nuevo y entra en juego abierto',
        "pcmodules-es":
            "Para desactivar tus módulos, ve al panel derecho (por defecto la tecla 4), ve a la pestaña de MÓDULOS (por defecto E o Q), selecciona cada módulo y desactívalo. (No es posible desactivar el Núcleo de Energía y no deberías desactivar tu Soporte Vital!)",
        "galnet-fr": "Voici un lien vers Galnet: https://community.elitedangerous.com/galnet",
        "kgbfoam-fr":
            "Pour apprendre comment filtrer la Carte de la Galaxie, cliquez ici: https://t.fuelr.at/kgbfoamfr",
        "sc-fr":
            "Réactivez vos propulseurs et votre Réacteur FSD, ensuite Désélectionnez toutes vos cibles / destinations, et allez en supercruise (Touche J). Éloignez vous de l'étoile d'environ 5 sl, puis retourner en navigation normal, et arrêtez vous.",
        "pw-fr": "Il est temps de remplir la paperasse! https://www.fuelrats.com/paperwork/",
        "psbeacon-fr":
            "Pour activer votre balise d'escadrille, tenez le bouton Carré et appuyez sur DROITE de la croix directionnelle. Naviguez jusqu'à l'onglet VAISSEAU (défaut : L1/R1) puis dans le sous-menu FONCTIONS sélectionnez BALISE et réglez la sur ESCADRILLE.",
        "xwing-fr":
            "Pour ajouter le(s) rat(s) à votre escadrille, tenez le bouton X enfoncé et pressez le bouton \"Haut\" de la croix directionnelle. Déplacez-vous sur le troisième onglet (défaut : LB/RB), puis sélectionnez le nom d'un rat et cliquez sur [Inviter dans l'escadrille].",
        "pcquit-fr":
            "Retournez immédiatement au Menu Principal en appuyant sur ESC et en sélectionnant Sauvegarder et Revenir au Menu Principal!",
        "ratchat-fr":
            "HÉ! #fuelrats est réservé au opérations de sauvetage, Si vous voulez chattez, prière de rejoindre #RatChat en tapant '/join #RatChat'",
        "rc-fr":
            "HÉ! #fuelrats est réservé aux opérations de sauvetage. Si vous voulez chatter, prière de rejoindre #RatChat en tapant '/join #RatChat'",
        "xquit-fr":
            "Sortez immédiatement du jeu en appuyant sur MENU et en sélectionnant Sauvegarder et Revenir au Menu Principal!",
        "prep-fr":
            "Nous vous prions de sortir du mode \"supercruise\", de vous arrêter complètement et de désactiver tous les modules SAUF les Systèmes de survie (instructions disponibles si nécessaire). Si un compteur d'oxygène devait apparaître, à n'importe quel moment, merci de nous en informer immédiatement.",
        "pcbeacon-fr":
            "Pour activer votre balise d'escadrille, allez sur le panneau droit (défaut : touche 4), allez sur l'onglet VAISSEAU (défaut : touche Q), puis dans le sous-menu FONCTIONS sélectionnez BALISE et réglez la sur ESCADRILLE.",
        "xbeacon-fr":
            "Pour activer votre balise d'escadrille, tenez le bouton X et appuyez sur DROITE de la croix directionnelle. Naviguez jusqu'à l'onglet VAISSEAU (défaut : LB/RB) puis dans le sous-menu FONCTIONS sélectionnez BALISE et réglez la sur ESCADRILLE.",
        "pcwing-fr":
            "Pour Envoyer une demande d'escadrille, allez sur le panneau du haut (Par défaut touche 2), Appuyez sur ESC pour sortir du chat, et allez au troisième panneau (Par défaut touche E). Puis sélectionnez le nom du Commandant, et sélectionnez Inviter dans l'Escadrille.",
        "pcfr-fr":
            "Pour envoyer une demande d'amis, ouvrez le menu (Appuyez sur ESC), cliquez sur SOCIAL puis cherchez le nom. Cliquez sur le nom, puis AJOUTER AMI.",
        "prepcr-fr":
            "Allez au Menu Principal de Elite Dangerous immédiatement, ou ce que vous pouvez voir votre vaisseau dans le hangar.",
        "xfr-fr":
            'Pour ajouter le(s) rat(s) à votre liste d\'amis, appuyez sur le bouton XBOX, puis "Droite" sur la croix directionnelle. Appuyez maintenant sur "Bas" quatre fois et cherchez le(s) nom(s) du/des rats. Prenez bien soin d\'ajouter ce(s) rat(s) en tant qu\'ami FAVORI',
        "psquit-fr":
            "Sortez immédiatement du jeu en appuyant sur START et en sélectionnant Sauvegarder et Revenir au Menu Principal!",
        "psmodules-fr":
            "Pour éteindre vos modules, ouvrez votre panneau de droite (défaut : Carré + droite sur croix directionnelle), passez à l'onglet MODULES (défaut : boutons L1/R1), sélectionnez chaque Module une fois et désactivez-le. (Vous ne pouvez pas désactiver votre Réacteur et ne devez PAS désactiver votre Support de vie!)",
        "pswing-fr":
            "Pour ajouter le(s) rat(s) à votre escadrille, tenez le bouton Carré enfoncé et pressez le bouton \"Haut\" de la croix directionnelle. Déplacez-vous sur le troisième onglet (défaut : L1/R1), puis sélectionnez le nom d'un rat et cliquez sur [Inviter dans l'escadrille].",
        "pcmodules-fr":
            "Pour éteindre vos modules, ouvrez votre panneau de droite (défaut : touche 4), passez à l'onglet MODULES (défaut : touches E et Q), sélectionnez chaque Module une fois et désactivez-le. (Vous ne pouvez pas désactiver votre Réacteur et ne devez PAS désactiver votre Support de vie!)",
        "xmodules-fr":
            "Pour éteindre vos modules, ouvrez votre panneau de droite (défaut : X + droite sur croix directionnelle), passez à l'onglet MODULES (défaut : boutons LB/RB), sélectionnez chaque Module une fois et désactivez-le. (Vous ne pouvez pas désactiver votre Réacteur et ne devez PAS désactiver votre Support de vie!)",
        "reboot-fr":
            "Pour redémarrer/réparer votre vaisseau, allez sur votre panneau de droite, sur l'onglet VAISSEAU, et descendez jusqu'à \"redémarrer/réparer\". Cliquez et confirmez.",
        "crinst-fr":
            "Quand nous vous le dirons (PAS MAINTENANT !), connectez-vous en mode JEU OUVERT, activez votre balise d'escadrille et ensuite INVITEZ tous les rats qui vous sont assignés dans une escadrille.",
        "psfr-fr":
            "Pour ajouter les rats à votre liste d'amis, appuyez sur le bouton PS, sélectionnez Amis à partir de l'écran de fonction, cherchez le nom de votre rat, et ajoutez-le en tant qu'ami.",
        "o2synth-fr":
            "Pour recharger votre réserve d'oxygène, allez sur votre panneau droit, sur l'onglet Inventaire puis descendez jusqu'à Synthèse (5ème onglet). Descendez sur \"Système de survie\". Cela demandera 2 Fer et 20 Nickel, et prendra 20 secondes à s'effectuer.",
        "pqueue-fr":
            "Bonjour, et bienvenue sur le service de sauvetage des Fuel Rats! Merci de revenir au menu principal pour l'instant, car il semblerait qu'il y ait pas mal de personnes en attente d'aide en ce moment. Nous nous occuperons de vous dès que possible!",
        "multi-fr":
            "Merci d'ignorer les messages qui ne contiennent pas votre nom, ils ne vous sont probablement pas destinés! Nous avons généralement plusieurs sauvetages en même temps, alors pas tout ne vous concerne!",
        "pg-fr":
            "Pour vous connecter en Groupe Privé, cliquez sur Commencer (depuis le menu principal), puis Groupe Privé, et enfin sur le nom du rat ou le nom qui vous a été donné",
        "donate-fr":
            "Même si notre service est complètement gratuit, si vous le souhaitez, vous pouvez nous faire un don pour nous aider à couvrir nos frais serveurs sur https://t.fuelr.at/donate. Merci beaucoup pour votre aide!",
        "shirts-fr": "Soyez stylé avec les t-shirt Fuel Rats 😎 https://t.fuelr.at/shirts",
        "pcfrcr-fr":
            "Pour envoyer une demande d'amis, restez dans le menu principal, cliquez sur SOCIAL puis cherchez les noms des rats à ajouter en haut à droite. Cliquez sur le nom, puis sur AJOUTER AMI.",
        "xfr-hu":
            "Ha az üzemanyagpatkányokat a barátlistádhoz szeretnéd adni, duplán nyomd az XBOX gombot, majd BALRA a D-PADen, és A gomb. Keress rá a patkány nevére.",
        "xwing-hu":
            "A patkányok kötelékbe hívásához tartsd nyomva az X-et, majd nyomj FEL-t a D-PADon, nyomd meg az RB gombot egyszer, és válaszd ki a patkány nevét. Válaszd az INVITE TO WING-et (meghívás kötelékbe).",
        "pcquit-hu":
            "Kérlek azonnal jelentkezz ki a játékból az ESC gomb megnyomásával, majd válaszd a SAVE AND EXIT TO MAIN MENU-t (mentés és kilépés a főmenübe).",
        "pcwing-hu":
            "Kötelék-kérelem küldéséhez a kommunikációs panelen (alapbeállítás: 2-es gomb), a chatből kilépve (ESC gomb), a második panelen (alapbeállítás: E gomb) meg kell jelölni a meghívandó parancsnok nevét, és az INVITE TO WING-t (meghívás kötelékbe) kell válasszuk.",
        "prep-hu":
            "Kérlek válj le frameshift drive-ról és állítsd meg a hajót. Kapcsold le az összes modult, KIVÉVE a létfenntartót.",
        "prepcr-hu": "Kérlek jegyezd fel pontos tartózkodási helyed, majd mentés és kilépés a főmenübe!",
        "sc-hu":
            "Kapcsold vissza a fúvókákat és a frameshift driveot,szüntess meg minden célpont megjelölést, majd aktiváld is az FSD 1-es fokozatát. Távolodj el a csillagtól körülbelül 5 fénymásodpercnyire, majd válj le az FSD-ről.",
        "xbeacon-hu":
            "A kötelékjeladó bekapcsolásához tartsd nyomva az X-et, és nyomd meg a JOBBRÁT a D-padon. Nyomd meg az LB gombot, majd a BEACON-t (jeladó) állítsd WING-re (kötelék).",
        "pcbeacon-hu":
            "A kötelék többi tagja felé közölt pozíció jeladónak bekapcsolásához a jobb oldali panelen (alapbeállítás: 4-es gomb), a funkciók lapon található BEACON-t (JELADÓ) WING-re (KÖTELÉK) kell állítani.",
        "pcfr-hu":
            "A barátok felvételéhez lépj ki a menübe (ESC gomb), válaszd a FRIENDS AND PRIVATE GROUPS-t (barátok és privát csoportok), és kattints az ADD FRIENDS (barátok hozzáadása) menüpontra.",
        "kgbfoam-hu": "a galaxistérkép szűrőinek beállításaival kapcsolatban kattints ide: http://t.fuelr.at/kgbfoamhu",
        "xquit-hu":
            "Kérlek jelentkezz ki azonnal a játékból, a MENU gomb megnyomásával, majd a SAVE AND EXIT TO MAIN MENU választásával!",
        "pg-it":
            "Per accedere in un Gruppo Privato, per favore, dal menù principale, scegli START, poi FRIENDS AND PRIVATE GROUPS (amici e gruppi privati), poi il nome del ratto o altro che ti viene detto.",
        "prepcr-it": "Per cortesia, esci al menu principale di Elite Dangerous dove appare la tua nave in un hangar.",
        "kgbfoam-it":
            "Come filtrare la Mappa della Galassia per trovare stelle dalle quali raccogliere carburante! https://t.fuelr.at/kgbfoamit",
        "pcbeacon-it":
            'Per attivare il BEACON (faro per gruppo di volo), vai al pannello di destra (tasto predefinito: 4), scegli la scermata "FUNCTIONS" (funzioni) (tasto predefinito: Q), seleziona BEACON e scegli l\'opzione WING (gruppo di volo)',
        "netlog-it":
            "Ciao cliente diretto verso casa e grazie per aiutarci ad aiutare Frontier auitarci ad aiutarti. Il tuo netlog lo trovi qui: https://t.fuelr.at/netlog",
        "multi-it":
            "Perfavore ignora qualsiasi messaggio senza il tuo nome, probabilmente non sono intesi per te! Stiamo spesso conducendo molteplici operazioni di salvataggio, non tutto è diretto a te!",
        "crinst-it":
            "Quando ti viene detto (NON ORA), accedi in modalità GIOCO APERTO, attiva il tuo WING BEACON (faro per il gruppo di volo) e invita tutti i ratti a te assegnati alla tua WING (gruppo di volo)!",
        "pcquit-it":
            "Perfavore esci dal gioco immediatamente premendo ESC e selezionando l'opzione SAVE AND EXIT TO MAIN MENU (salva ed esci al menu principale)!",
        "prep-it":
            "Si prega di uscire dalla supercruise, fermarsi completamente e disattivare tutti i moduli TRANNE il supporto vitale (istruzioni disponibili se necessario). Se appare un conto alla rovescia dell'ossigeno di emergenza, informaci immediatamente!",
        "pcmodules-it":
            "Per spegnere i tuoi moduli, vai al pannello di destra(tasto di default 4), apri la scheda MODULES(tasto di default E o Q), seleziona ogni modulo e disattivalo(non puoi disattivare il Power Plant o il canopy e non DEVI disattivare Life Support!)",
        "pcwing-it":
            'Per inviare una richiesta di squadrone, vai al pannello comunicazioni(pulsante di default 2), premi ESC per uscire dalla chat, e spostati al terzo pannello(tasto di default E). Ora seleziona i tuoi Rat e poi "INVITE TO WING"',
        "pcfr-it":
            'Per inviare una richiesta di amicizia, vai al menu(premi ESC), clicca su "SOCIAL" e cerca amici nella barra di ricerca in alto a destra. Clicca sul loro nome e poi su "ADD FRIEND"',
        "pcfrcr-it":
            'Per inviare una richiesta di amicizia, rimani al menu principale, clicca su "SOCIAL" e cerca amici nella barra di ricerca in alto a destra. Clicca sul loro nome e poi su "ADD FRIEND"',
        "o2synth-it":
            "Per riempire la riserva di ossigeno: Vai al pannello di destra, scheda MODULES. Seleziona LIFE SUPPORT, e clicca RESUPPLY LIFE SUPPORT. Richiede 2 Iron e 1 Nickel, e impiega 20 secondi per completare la procedura.",
        "reboot-it":
            "Per riavviare/riparare la tua nave, vai al pannello di destra, apri il menu SHIP e poi seleziona REBOOT/REPAIR. Clicca e conferma il riavvio.",
        "psmodules-it":
            "Per spegnere i tuoi moduli, vai al pannello di destra(tasto di tap sull'angolo in basso a destra del touchpad), apri la scheda MODULES(tasto di default R1 o L1), seleziona ogni modulo e disattivalo(non puoi disattivare il Power Plant o il Canopy e non DEVI disattivare Life Support!)",
        "xmodules-it":
            "Per spegnere i tuoi moduli, vai al pannello di destra(tasto di default X+destra sul pad direzionale), apri la scheda MODULES(tasto di default RB o LB), seleziona ogni modulo e disattivalo(non puoi disattivare il Power Plant o il canopy e non DEVI disattivare Life Support!)",
        "psfr-it":
            "Per aggiungere i Rat alla lista amici, premi il pulsante PS, apri la schermata amici dall'area funzioni, cerca il nome del tuo Rat e aggiungilo come amico.",
        "pswing-it":
            'Per aggiungere i Rat allo squadrone, tieni premuto il tasto quadrato e premi SU sul pad direzionale, spostati alla terza scheda(tasto di default R1), poi seleziona il nome del rat e infine seleziona "INVITE TO WING"',
        "psbeacon-it":
            'Per accendere il BEACON(radiofaro) vai al pannello di destra(tap sull\'angolo in basso a destra sul touchpad). Vai alla scheda "SHIP" (pulsanti L1/R1) ) poi nella schermata "FUNCTIONS" seleziona "BEACON" e impostalo a "WING"',
        "xwing-it":
            'Per aggiungere i Rat allo squadrone, tieni premuto il tasto X e premi SU sul pad direzionale, spostati alla terza scheda(tasto di default RB), poi seleziona il nome del rat e infine seleziona "INVITE TO WING"',
        "xbeacon-it":
            'Per accendere il BEACON(radiofaro) tieni premuto il tasto X e premi DESTRA sul pad direzionale. Naviga alla scheda "SHIP" (pulsanti LB/RB) poi nella schermata "FUNCTIONS" seleziona "BEACON" e impostalo a "WING"',
        "xfr-it":
            "Per aggiungere i Rat alla lista amici, premi il pulsante xbox, poi DESTRA sul pad direzionale. Ora premi GIU sul pad direzionale 4 volte e cerca il nome del Rat. Assicurati di aggiungere il Rat tra gli amici PREFERITI.",
        "sc-it":
            "Riattiva i propulsori(thrusters) e il Frame Shift Drive, deseleziona qualsiasi bersaglio o marker di navigazione tu abbia selezionato e attiva la Supercruise. Vola allantonandoti dalla stella per circa 5 Ls, poi rallenta e torna nello spazio normale.",
        "prep-nl":
            "Verlaat 'super cruise', kom tot stilstand, en zet al je modules uit, BEHALVE 'life support' (instructies beschikbaar indien nodig). Indien ineens een zuurstof-timer wordt getoond, gelieve ons onmiddelijk hierover te informeren.",
        "xmodules-nl":
            "Om je modules uit te zetten ga je naar het rechterscherm (standaard X + rechts op D-pad), en navigeer je naar het tabblad MODULES (standaard toets LB/RB), selecteer elke Module één keer en deactiveer deze. (Je Power Plant kun je niet deactiveren en Life Support moet je NIET deactiveren!).",
        "pcmodules-nl":
            "Om je modules uit te zetten ga je naar het rechterscherm (standaard toets 4), en navigeer je naar het tabblad MODULES (standaard toets E of Q), selecteer elke Module één keer en deactiveer deze. (Je Power Plant kun je niet deactiveren en Life Support moet je NIET deactiveren!).",
        "reboot-nl":
            "Om je schip te herstarten/repareren ga naar het rechterscherm (standaard toest 4), open het SHIP menu en navigeer naar 'reboot/repair. Klik en bevestig herstart.",
        "o2synth-nl":
            "Om je zuurstofvoorraad bij te vullen ga je naar het rechterscherm (standaard toest 4), navigeer naar de INVENTORY-tab en selecteer dan het SYNTHESIS ondermenu (5e menu, honingraat-icoon). Navigeer dan naar beneden naar 'Life Support' en klik 'Resupply Life Support'. Hiervoor heb je 2 Iron en 1 Nickel nodig en het duurt 20 seconden om uit te voeren.",
        "psfr-nl":
            "Om de rats toe te voegen in je vriendenlijst druk je op de PS knop, open je het vrienden scherm vanuit het functies scherm, zoek je de naam van jouw toegewezen rat op, en voeg je hem toe als vriend.",
        "psrelog-nl":
            "Druk OPTIONS, en druk vervolgens \"Save and Exit to Main Menu\" om correct uit te loggen. Houd vervolgens de PS knop ingedrukt om naar het snelmenu te gaan en selecteer 'Applicatie sluiten' en druk op OK. Open vervolgens de game opnieuw en log in op OPEN play.",
        "pcquit-nl":
            "Log alsjeblieft onmiddelijk uit naar het hoofdmenu, door op ESC te drukken, en daarna op 'Save and Exit to Main Menu' te klikken!",
        "prepcr-nl":
            "Noteer je locatie in het spel (linker scherm, linker kolom), en log onmiddelijk uit naar het hoofdmenu!",
        "psmodules-nl":
            "Om je modules uit te zetten ga je naar je rechterscherm (standaard druk je daarvoor rechtsonder op het touchpad van je controller), vervolgens ga je naar de MODULES tab (standaard met de L1/R1 knoppen) en selecteer je elk module en deactiveer je deze, BEHALVE LIFE SUPPORT. (Je kan je Power Plant niet uitschakelen, en je moet je Life Support niet uitschakelen!)",
        "xwing-nl":
            "Om iemand aan je 'Wing' toe te voegen, houd je de X knop ingedrukt, en druk je op 'omhoog' op de D-Pad. Druk nu op RB, en selecteer de CMDR die je aan je 'wing' wil toevoegen. Selecteer nu 'Invite to wing'",
        "galnet-nl": "Hier is een link naar Galnet https://community.elitedangerous.com/galnet",
        "ratchat-nl":
            "Hoi! #Fuelrats wordt gebruikt voor reddingsacties. Als je met ons wil chatten, kun je dit doen door met het kanaal #RatChat te verbinden. Typ hiervoor '/join #ratchat'",
        "pw-nl": "Tijd om het papierwerk te doen. https://fuelrats.com/paperwork",
        "rc-nl":
            "Hoi! #Fuelrats wordt gebruikt voor reddingsacties. Als je met ons wil chatten, kun je dit doen door met het kanaal #RatChat te verbinden. Typ hiervoor '/join #ratchat'",
        "xfr-nl":
            "Om je rat toe te voegen aan je vrienden lijst, druk op de XBOX knop, druk daarna naar LINKS op de D-pad en dan 4 maal naar BENEDEN, zoek dan de naam op van je rat die jou is toegewezen. Zorg er ook zeker voor dat je hen toevoegd aan he FAVORIETE vrienden.",
        "xquit-nl":
            "Log alsjeblieft onmiddelijk uit naar het hoofdmenu, door op MENU te drukken, en daarna 'Save and Exit to Main Menu' te selecteren!",
        "sc-nl":
            "Zou je je 'Thrusters' en 'Frame Shift Drive' modules willen activeren? (rechter scherm, tabblad 'modules') Zorg ervoor dat je geen ander zonnestelsel geselecteerd hebt, en ga naar 'super cruise'. Vlieg 5 Ls van de ster weg, en verlaat 'super cruise' weer.",
        "pcbeacon-nl":
            "Om je 'wing beacon' te activeren, ga je naar het rechterscherm (standaard toets 4), en navigeer je naar het tabblad 'SHIP' (standaard toets Q) en dan in het onderscherm 'FUNCTIONS' selecteer 'BEACON' en kies de optie 'WING'.",
        "xbeacon-nl":
            "Om je 'wing beacon' te activeren, houd je X knop ingedrukt, en druk je op 'RECHTS' op de D-Pad. Navigeer naar het tabblad 'SHIP' (standaard LB/RB) en dan in het onderscherm 'FUNCTIONS' selecteer 'BEACON' en kies de optie 'WING'.",
        "pcwing-nl":
            "Om iemand aan je 'Wing' toe te voegen, ga je naar het communicatiescherm (standaard toets 2), en druk je op ESC om uit het tekstvak te gaan. Navigeer nu naar het tweede tabblad (standaard toets E), en selecteer de rat(ten) die je aan je 'wing' wil toevoegen. Selecteer nu 'Invite to wing'.",
        "pcfr-nl":
            "Om een vriendenverzoek te sturen, ga je naar het menu (druk op ESC), en klik je op 'SOCIAL' en zoek dan de naam van de aan jou toegewezen rat op. Klik op 'ADD FRIEND'.",
        "psquit-nl":
            'Log uit van de game door op OPTIONS te drukken en vervolgens te drukken op "Save and Exit to Main Menu"!',
        "kgbfoam-nl":
            "Om te leren hoe je de 'galaxy map' kunt filteren om scoopbare sterren te vinden, klik hier: https://t.fuelr.at/kgbfoamnl",
        "psbeacon-nl":
            "Om je wing beacon te activeren ga je naar het rechterscherm (standaard druk je daarvoor rechtsonder op het touchpad van je controller). Navigeer naar het tabblad 'SHIP' (standaard L1/R1) en dan in het onderscherm 'FUNCTIONS' selecteer 'BEACON' en kies de optie 'WING'.",
        "pswing-nl":
            "Om de rats toe te voegen aan je wing hou je de VIERKANT knop ingedrukt, vervolgens druk je omhoog op de D-pad, beweeg nu naar de derde tab (standaard met R1), selecteer de naam van een rat en selecteer nu 'Invite to wing'.",
        "multi-nl":
            "Wil je de berichten waarin je naam niet staat alsjeblieft negeren! We zijn meestal met meerdere reddingen tegelijkertijd bezig, waardoor niet alle berichten voor jou bestemd zijn.",
        "crinst-nl":
            "Zodra je het signaal krijgt moet je het volgende doen (NOG NIET UITVOEREN), log alsjeblieft in in OPEN PLAY, activeer je WING BEACON, en als laatste INVITE voeg alle geassigneerde ratten toe aan je wing!",
        "psbeacon-pl":
            "By uruchomić swój BEACON, przejdź do prawego panelu (domyślnie należy dotknąć prawego, dolnego roku touchpada). Przejdź do panelu SHIP (domyślnie L1/R1), po czym w podpanelu FUNCTIONS przestaw opcję BEACON na WING.",
        "pcwing-pl":
            "By wysłać zaproszenie do WING'a, przejdź do panelu COMMS (domyślnie klawisz 2), naciśnij ESC by wyjść z okienka czatu, a następnie przejść do trzeciej zakładki panelu (domyślnie klawisz E). Następnie wybierz FuelRata którego chcesz zaprosić do swojego WING'a i naciśnij opcję INVITE TO WING.",
        "psmodules-pl":
            "By dezaktywować moduły statku, uruchom prawy panel (dotknij prawego, dolnego rogu touchpad'a), przejdź do zakładki MODULES (domyślnie L1/R1), oraz wybierz po kolei każdy moduł i dezaktywuj go (Nie możesz wyłączyć swojego POWER PLANT'a i CANOPY, oraz nie powinienś wyłączać LIFE SUPPORT!).",
        "pcmodules-pl":
            "By wyłączyć moduły statku, uruchom prawy panel (domyślnie klawisz 4), po czym przejdź do zakładki MODULES (domyślnie E bądź Q), oraz wybierz po kolei każdy moduł i dezaktywuj go (Nie możesz wyłączyć swojego POWER PLANT'a, oraz nie powinienś wyłączać LIFE SUPPORT!).",
        "o2synth-pl":
            "By napełnić swój zapas tlenu, uruchom prawy panel, przejdź do zakładki INVENTORY, zjedź do opcji SYNTHESIS, wewnątrz niej znajdź opcję LIFE SUPPORT i naciśnij RESUPPLY LIFE SUPPORT. Wymaga to 2 szt. Iron, 1 szt. Nickel i zajmuje 20 sekund.",
        "psfr-pl":
            "By wysłać zaproszenie do przyjaciół, naciśnij przycisk PS, otwórz w ekranie funkcji pozycję znajomi i wpisz nick gracza i dodaj go do znajomych.",
        "xwing-pl":
            "Om iemand aan je 'Wing' toe te voegen, houd je de X knop ingedrukt, en druk je op 'omhoog' op de D-Pad, beweeg nu naar de derde tab (standaard med RB), selecteer de naam van een rat en selecteer nu 'Invite to wing'",
        "kgbfoam-pl":
            "Aby dowiedzieć się na temat filtrowania mapy galaktyki, kliknij tutaj: https://t.fuelr.at/kgbfoampl",
        "crinst-pl":
            "Kiedy zostaniesz poproszony (NIE TERAZ!), zaloguj się w trybie OTWARTEJ GRY, włącz swój NADAJNIK SKRZYDŁOWY i ZAPROŚ wszystkie przydzielone Szczury do skrzydła!",
        "multi-pl":
            "Proszę nie zwracać uwagi na wiadomości, gdzie nie ma twojego nicku, prawdopodobnie nie są skierowane do ciebie! Zwykle mamy wiele wezwań, więc nie wszystko jest skierowane do ciebie!",
        "pcquit-pl": "Proszę wylogować się z gry naciskając ESC i wybierając Zapisz i wyjdź do menu głównego!",
        "pg-pl":
            "Aby zalogować się do grupy prywatnej, naciśnij Start w menu głównym, następnie Znajomi i grupy prywatne, następnie nick szczura lub inny, jeśli został podany.",
        "pcbeacon-pl":
            "By włączyć swój BEACON, uruchom prawy panel (Domyślnie klawisz 4), przejdź do panelu SHIP (Domyślnie klawiszem Q), potem w podpanelu FUNCTIONS wybierz opcję BEACON i ustaw ją na opcję WING.",
        "xbeacon-pl":
            "By włączyć swój BEACON, przytrzymaj X i naciśniej guzik w prawo na D-Padzie. Przejdź do panelu SHIP (domyślnie LB/RB), potem w podpanelu FUNCTIONS wybierz opcję BEACON i ustaw ją na WING.",
        "sc-pl":
            "Włącz ponownie swoje thrustery oraz FSD, następnie odznacz oznaczony cel i wskocz w supercruise. Odleć od gwiazdy na odległość 5ls, po czym wróć do normalnej przestrzeni.",
        "xquit-pl": "Proszę wylogować się z gry naciskając MENU i wybierając Zapisz i wyjdź do menu głównego!",
        "xmodules-pl":
            "By wyłączyć moduły statku, uruchom prawy panel (domyślnie X + prawy przycisk na D-Padzie), przejdź do zakładki MODULES (domyślnie LB/RB), oraz wybierz po kolei każdy moduł i dezaktywuj go (Nie możesz wyłączyć swojego POWER PLANT'a, oraz nie powinienś wyłączać LIFE SUPPORT!).",
        "pswing-pl":
            "By dodać FuelRata do swojego WING'a, przytrzymaj kwadrat i naciśnij przycisk w górę na D-Padzie, przejdź do trzeciego panelu (domyślnie R1), po czym wybierz nick FuelRata i naciśnij INVITE TO WING.",
        "prepcr-pl":
            "Proszę natychmiast zanotować swoje położenie (panel po lewej stronie-> Navigation) a następnie Esc -> Save and Exit to Main menu jak najszybciej!",
        "xfr-pl":
            "Żeby dodać szczura do twojej listy przyjaciół, wciśnij przycisk Xbox, nastepnę naciskij LEWO na D-pad, Teraz wcisnij cztery razy DÓŁ na D-padzie i wyszukaj nick szczura(ów). Upewnij się, że dodałeś szczura(ów) do listy Favorite.",
        "reboot-pl":
            "By uruchomić ponownie/naprawić swój statek, uruchom prawy panel, otwórz zakładkę SHIP i naciśnij REBOOT/REPAIR oraz zatwierdź.",
        "prep-pl":
            "Prosze wyjść z trybu supercruise, zatrzymać się i wyłączyć wszystkie moduły ZA WYJĄTKIEM podtrzymania życia - life support(dostępne dalsze instrukcje w razie potrzeby). Jeżeli w dowolnym momencie ratunku pojawi się awaryjne odliczanie tlenu - oxygen depleted - prosimy to nam przekazać natychmiastowo.",
        "pqueue-pl":
            "Witamy w galaktycznym serwisie ratunkowym FuelRats! Proszę się wylogować do głównego menu, ponieważ mamy aktualnie sporą ilość osób szukających pomocy. Postaramy się wrócić do Ciebie jak najszybciej!",
        "donate-pl":
            "Chociaż nasza usługa jest całkowicie darmowa, jeśli chcesz, możesz przekazać darowiznę na pokrycie kosztów utrzymania serwerów pod adresem https://t.fuelr.at/donate. Dziękujemy za chęć pomocy!",
        "pcfr-pl":
            "By wysłać zaproszenie do przyjaciół, przejdź do menu pauzy (domyślnie ESC), naciśniej opcję SOCIAL i znajdź gracza w umieszczonej tam wyszukiwarce. Naciśnij go, po czym naciśnij opcję ADD FRIEND.",
        "pcfrcr-pt":
            "Para enviar uma solicitação de amizade, permaneça no Menu Principal, selecione Amigos e Grupos Privados, clique em Adicionar Amigo, e procure pelo seu(s) rato(s)",
        "xmodules-pt":
            "Para desativar os seus módulos, vá para o painel direito (por padrão pressione X + direita no D-PAD), vá para a aba MÓDULOS (por padrão LB/RB), selecione os módulos e desative todos EXCETO O SUPORTE VITAL. (Não é possível desativar o gerador de energia ou a canopla da cabine, e não desative o suporte vital!).",
        "o2synth-pt":
            "Para recarregar o seu suprimento de oxigênio, vá para o painel direito, navegue até a guia Inventário, e então sob a aba Síntese (quinta aba), selecione Suporte de Vida, e então clique Recarregar Suporte de Vida. A recarga usa 2 unidades de Ferro e 1 unidade de Níquel, e leva 20 segundos para completar.",
        "reboot-pt":
            "Para reiniciar/reparar a sua nave, vá para o painel direito, abra a guia Nave, e sob a aba Funções, selecione Reiniciar/Reparar, e então escolha Confirmar",
        "sc-pt":
            "Reative seus propulsores e o motor de distorção de fase. Certifique-se de não ter nenhum alvo selecionado e pule para a velocidade de cruzeiro. Voe para longe da estrela por cerca de 5 sL, e , então, saia do cruzeiro e volte ao espaço normal.",
        "prepcr-pt": "Por favor anote sua localização atual e então salve e saia para o menu principal imediatamente",
        "ratchat-pt":
            "Hey! #fuelrats é somente para operações de resgate , se você deseja conversar por favor entre no #RatChat digitando /join #RatChat",
        "rc-pt":
            "Hey! #fuelrats é somente para operações de resgate , se você deseja conversar por favor entre no #RatChat digitando /join #RatChat",
        "kgbfoam-pt": "para aprender sobre como filtrar o mapa galático, clique aqui: https://t.fuelr.at/kgbfoampt",
        "xbeacon-pt":
            "Para ligar o seu sinalizador, pressione X e Direita no D-PAD, navegue até a guia Nave (por padrão LB/RB), e então na aba lateral FUNÇÕES selecione Sinalizador, e escolha Esquadrão",
        "xwing-pt":
            "Para mandar um convite para o esquadrão, pressione o botão X e então a seta para cima no D-PAD, então selecione a terceira aba (por padrão RB), selecione o nome do rato e selecione Chamar para o esquadrão (abreviado para Chamar p o esq.)",
        "pcquit-pt":
            "Por favor saia imediatamente do jogo clicando ESC e selecione Salvar e sair para o menu principal!",
        "xfr-pt":
            "Para adicionar o rato que irá te resgatar à sua lista de amigos, aperte o botão central do controle XBOX, então pressione a seta para a esquerda no D-PAD. Agora, pressione a seta para baixo no D-PAD 4 VEZES, e então procure pelo nome do rato. Certifique-se de adicionar o(s) rato(s) como um amigo FAVORITO.",
        "xquit-pt":
            "Por favor saia imediatamente do jogo pressionando o botão MENU e escolhendo Save and Exit to the Main Menu!",
        "pcbeacon-pt":
            "Para ligar o seu sinalizador, vá para o painel direito (tecla padrão 4), abra a guia Nave (tecla padrão Q), e então na aba lateral FUNÇÕES selecione Sinalizador, e escolha Esquadrão",
        "pcwing-pt":
            "Para mandar um convite para o esquadrão, vá para o painel de comunicações (tecla padrão 2), clique ESC para fechar a janela de conversa e vá até o terceiro painel (tecla padrão E). Selecione então o comandante que você deseja e então clique em Chamar para o esquadrão (abreviado para Chamar p o esq.)",
        "psrelog-pt":
            'Aperte OPÇÕES, e selecione "Save and Exit to Main Menu" para sair do jogo corretamente. Então, pressione o botão PS e abra o menu rápido, escolhendo "Fechar aplicação", e então apertando OK. Depois disso, inicie o jogo no modo OPEN.',
        "psquit-pt":
            'Por favor, saia do jogo imediatamente apertando o botão de OPÇÕES e escolhendo "Save and Exit to Main Menu"!',
        "pcfr-pt":
            "Para enviar uma solicitação de amizade, vá para o menu (aperte Esc), selecione SOCIAL, e procure por um amigo no canto superior direito. Clique no nome, e então em + ADICIONAR AMIGO",
        "psbeacon-pt":
            "Para ligar o seu sinalizador, vá para o painel direito (por padrão toque no canto inferior direito do touchpad), abra a guia Nave (por padrão L1/R1), e então na aba lateral FUNÇÕES selecione Sinalizador, e escolha Esquadrão",
        "psfr-pt":
            "Para adicionar os Rats à sua lista de amigos, pressione o botão PS, abra a tela de amigos na área de funções, procure pelo nome do rato, e o adicione como amigo.",
        "pswing-pt":
            "Para mandar um convite para o esquadrão segure o botão QUADRADO e pressione ACIMA no direcional, aperte R1 duas vezes para selecionar a terceira guia, e então selecione o nome do rato e selecione Chamar para o esquadrão (abreviado para Chamar p o esq.)",
        "psmodules-pt":
            "Para desligar seus módulos, por favor vá até seu painel direito (por padrão, apertando o lado inferior direito do touchpad), vá para a guia Módulos (por padrão, L1/R1), escolha cada um dos módulos e o desative, EXCETO O SUPORTE VITAL (Não é possível desativar o gerador de energia ou a canopla da cabine, e não desative o suporte vital!",
        "crinst-pt":
            "Quando lhe dissermos (MAS NÃO AGORA!), por favor entre no jogo aberto, ative seu SINALIZADOR e, então, CONVIDE todos os Ratos do seu caso para um ESQUADRÃO!",
        "prep-pt":
            "Por favor saia da velocidade de cruzeiro, pare completamente a nave e desative todos os módulos exceto o suporte vital (instruções disponíveis se necessário). Se a contagem regressiva de oxigênio de emergência aparecer a qualquer momento, nos avise o mais rápido possível.",
        "donate-pt":
            "Apesar do nosso serviço ser completamente gratuito, se desejar, você pode fazer uma doação pra ajudar a cobrir os nossos custos de operação no site https://t.fuelr.at/donate (em inglês). Obrigado por nos ajudar!",
        "pcmodules-pt":
            "Para desativar os seus módulos, vá para o painel direito (por padrão a tecla 4), vá para a aba MÓDULOS (por padrão as teclas E ou Q), selecione os módulos e desative todos EXCETO O SUPORTE VITAL. (Não é possível desativar o gerador de energia ou a canopla da cabine, e não desative o suporte vital!).",
        "xmodules-ru":
            "Чтобы отключить модули, зайдите в правую панель (по умолчанию X + ВПРАВО), затем во вкладку МОДУЛИ (LB/RB) и отключите каждый модуль КРОМЕ системы жизнеобеспечения. (Силовую Установку не отключить).",
        "pcwing-ru":
            "Чтобы отправить запрос на добавление в крыло, откройте окно связи (по умолчанию 2), нажмите ESC и перейдите на 3 вкладку (по умолчанию E). Выберите кого вы хотите добавить в крыло и нажмите Пригласить в крыло.",
        "xwing-ru":
            "Чтобы добавить пилота в список друзей, зажмите клавишу X и нажмите на стрелочку вверх, перейдите в третью вкладку (Клавиша по умолчанию RB), затем выберите имя пилота и нажмите [Добавить в крыло] (Invite to wing)",
        "reboot-ru":
            "Чтобы перезагрузить/починить ваш корабль, откройте правую панель, откройте меню Корабль, затем пролистайте до Перезагрузка/починка (справа-вверху). Нажмите и подтвердите перезагрузку.",
        "psmodules-ru":
            "Чтобы отключить модули, зайдите в правую панель (правый нижний угол тачпада), зайдите во вкладку МОДУЛИ (L1/R1) и отключите каждый модуль КРОМЕ системы жизнеобеспечения. (Силовую Установку не отключить).",
        "pcquit-ru":
            'Пожалуйста, НЕМЕДЛЕННО выйдите из игры: нажмите ESC и выберите "сохранить и выйти в главное меню" (Save and Exit to Main Menu)!',
        "galnet-ru": "Вот ссылка на Galnet: https://community.elitedangerous.com/galnet",
        "ratchat-ru":
            "Здравствуйте! #fuelrats - канал для чрезвычайных ситуаций и для спасательных операций, если вы хотите поговорить с нами, пожалуйста, присоединитесь к #ratchat (введите '/join #ratchat')",
        "kgbfoam-ru":
            "для того, чтобы узнать, как отфильтровать карту галактики для звезд, которые отдают топливо, нажмите здесь: https://t.fuelr.at/kgbfoamru",
        "rc-ru":
            "Здравствуйте! #fuelrats - канал для чрезвычайных ситуаций и для спасательных операций, если вы хотите поговорить с нами, пожалуйста, присоединитесь к #ratchat (введите '/join #ratchat')",
        "prepcr-ru":
            "Пожалуйста, незамедлительно выйдите в главное меню игры , где вы можете видеть свой корабль в ангаре.",
        "pcbeacon-ru":
            "Чтобы включить маяк, откройте правую панель (по умолчанию 4), затем вкладку КОРАБЛЬ (по умолчанию У, 3 раза), затем в подменю Функции выберите Маяк (слева-внизу на схеме) и переключите его на КРЫЛО.",
        "xbeacon-ru":
            "Чтобы зажечь маяк, зажмите клавижу Х и нажмите ВПРАВО на стрелочках. Откройте вкладку Корабль (по умолчанию LB/RB), в подменю Функции выберите Маяк (слева-внизу на схеме) и переключите его на Крыло.",
        "crinst-ru":
            "По нашему сигналу (но не сейчас) нам нужно чтобы ты вошёл в открытую игру, включил МАЯК КРЫЛА и только после этого пригласил всех назначенных спасателей в КРЫЛО.",
        "invite-ru":
            "Посмотрите это короткое руководство о том как принять приглашение в крыло: https://marenthyu.de/invites.png",
        "pcmodules-ru":
            "Чтобы выключить модули, откройте правую панель (по умолчанию 4), пройдите во вкладку МОДУЛИ (по умолчанию У), выберите и отключите каждый Модуль (КРОМЕ Сист. Жизнеобеспечения - это не выключайте).",
        "multi-ru":
            "Пожалуйста игнорируйте сообщения без Вашего ника в нём. У нас часто происходит несколько спасений одновременно поэтому не всё адресовано Вам!",
        "psfr-ru":
            "Чтобы добавить пилота в список друзей, нажмите кнопку PS, откройте список друзей, в текстовое поле впишите имя пилота и добавьте в друзья.",
        "psquit-ru":
            'Пожалуйста, НЕМЕДЛЕННО выйдите из игры: нажмите кнопку OPTIONS и выберите "Сохранить и выйти в главное меню"',
        "psrelog-ru":
            'Нажмите OPTIONS, выберите "Сохранить и выйти в главное меню". После этого задержите кнопку PS и выберите "Закрыть приложение". После этого запустите игру и войдите в Открытую игру.',
        "fueltank-ru":
            "Не могли бы вы сообщить сколько топлива осталось в обоих ваших баках? Вот графическое руководство топливной панели: https://t.fuelr.at/fueltankru",
        "prep-ru":
            "Cбросьте скорость до 30км/c, выйдите из межзвезд. круиза, остановитесь и выключите все модули КРОМЕ жизнеобеспечения (если нужно, дадим инструкции). Если в любое время появится отсчёт кислорода, сразу же сообщите нам.",
        "xfr-ru":
            "Чтобы добавить пилота в список друзей, нажмите на значок XBOX и нажмите ВПРАВО на стрелочках. Затем ВНИЗ на стрелочках 4 РАЗА и добавьте пилота с помощью поиска.",
        "pqueue-ru":
            "Добро пожаловать в канал заправки службы Fuel Rats! На данный момент у нас много вызовов, поэтому для ожидания вашей очереди в безопасности пожалуйста выйдите в главное меню. Мы заправим вас как можно скорее!",
        "xquit-ru":
            'Пожалуйста, НЕМЕДЛЕННО выйдите из игры: нажмите MENU и выберите "сохранить и выйти в главное меню" (Save and Exit to Main Menu)!',
        "sc-ru":
            "Пожалуйста включите обычный и рамочно-сместительный двигатели, снимите выделение с системы и нажмите на кнопку прыжка чтобы попасть в супер-круиз. Отлетите от звезды примерно на 5 св. сек. и выйдите из круиза.",
        "o2synth-ru":
            'Для пополнения запаса кислорода, откройте правую панель, вкладка Снаряжение, пролистайте вниз до Синтез (слева, предпоследняя снизу). Вниз до "Система жизнеобеспечения" и "Пополнить запас". Нужно 2 Железа и 1 Никель.',
        "pcfr-ru":
            'Чтобы отправить запрос на добавление в друзья, откройте меню (ESC), нажмите на "Общение", введите имя в поле сверху и нажмите на кнопку Поиск. Нажмите на имя и затем нажмите "Добавить в друзья".',
        "pcfrcr-ru":
            'Чтобы отправить запрос в друзья, ОСТАВАЯСЬ В ГЛАВНОМ МЕНЮ, нажмите на "Общение", введите имя в поле сверху и нажмите на кнопку Поиск. Нажмите на имя и затем нажмите "Добавить в друзья".',
        "pswing-ru":
            "Чтобы добавить пилота в крыло, зажмите квадрат и нажмите на стрелочку вверх, перейдите в третью вкладку (клавиша по умолчанию R1), затем выберите имя пилота и нажмите [Добавить в крыло] (Invite to wing)",
        "psbeacon-ru":
            "Чтобы зажечь маяк, откройте правую панель (правый нижний угол тачпада). Перейдите во вкладку Корабль (по умолчанию L1/R1), в подменю Функции выберите Маяк (слева-внизу на схеме) и переключите на Крыло.",
        "pcfr-tr":
            "Arkadaşlık isteği göndermek için menüye (Hit ESC) gidin, friends and private groups'a tıklayın ve ADD FRIEND'e tıklayın.",
        "sc-tr":
            "Thruster’larını ve Frameshift drive’ini tekrardan aktif et ve çalıştır, ardından hedef seçiminini boşalt ve supercruise’e çık. Yıldızdan 5 ışık saniye(light second) uzaklaştıktan sonra supercruise’den normal uzaya çık.",
        "xwing-tr":
            "Yakıt Farelerini senin uçuş koluna(Wing)’e eklemek için X tuşuna basılı tutarak D-pad’de yukarı tuşuna tıkla, ardından 1 kere RB ye tıkladıktan sonra Fare’nin ismini seç ve [Invite to wing]’e tıkla",
        "pcquit-tr":
            "Acilen oyundan Log out olmak için lütfen ESC tuşuna bas ve ardından Save and Exit tuşu ile ana ekrana çık",
        "xbeacon-tr":
            "Uçuş kolu uyarı işaretini açmak için X tuşuna basılı tutarken D-pad’den sağ tuşuna bas, ardından LB tuşuna bastıktan sonra Beacon ayarını OFF’ tan WING’e çevir.",
        "pcwing-tr":
            "Uçuş koluna davet etmek için Comm panel’ini aç(klavyede 2’ye basarak), chat kutusundan çıkmak için 1 kere ESC’ye bas ve 2. panele geç. Ardından uçuş koluna davet etmek istediğin oyuncuyu seç ve Invite to Wing’e bas",
        "prepcr-tr":
            "Sol Panelde Navigasyon bilgisinden yerinizi bir yere kaydedin ve acilen Save and Exit tuşu ile ana ekrana çıkın.",
        "pcbeacon-tr":
            "Uçuş kolu işaretini(Wing Beacon) açmak için sağ panel açıp(klavyede 4 tuşuna basarak) ve en sağ alt panele gidip BEACON’ı seçip WING yapın.",
        "crinst-tr":
            "Size söylendiğinde (ŞİMDİ DEĞİL), lütfen OPEN PLAY’e tıklayıp oyuna giriş yapın, WING BEACON’I aktive edip size atanmış Fare’yi uçuş koluna davet edin.",
        "xrelog-tr":
            "Start tuşuna basıp oyundan çıkış yapın, Xbox tuşuna basıp oyunu QUIT GAME ile tamamen kapattıktan sonra Elite Dangerous’u tekrardan açın ve Open Play’e girin",
        "xfr-tr":
            "Fareleri arkadaş listenize eklemek için Xbox tuşuna 1 kere basın ve D-Pad’de önce yukarı ardından sağ tuşuna basın. Ardından A tuşuna basın ve arama kısmına eklemek istediğiniz fare veya farelerin isimlerini yazın. Fareleri eklerken Favori olarak seçmeyi ihmal etmeyin.",
        "psbeacon-tr":
            "Uçuş kolu işaretini(Wing Beacon) açmak için sağ panel açıp ve en sağ alt panele gidip(1 kere L1 tuşuna basın) BEACON’ı seçip OFF’tan WING’e çevirin.",
        "psrelog-tr":
            "OPTION tuşuna basın ve “Save and Exit to Main Menu”’ya tıklayarak ana ekrana çıkın, ardından PS tuşunu basılı tutarak açılan küçük ekranda “Close Application”’ı seçerek oyunu tamamen kapatın. Son olarak oyunu tekrardan açın ve OPEN PLAY’i seçerek oyuna tekrardan giriş yapın.",
        "psfr-tr":
            "Fareleri arkadaş listenize eklemek için PS tuşuna basın ve üst menu(functions)’den arkadaşlar kısmına gelin, arama kısmına eklemek istediğiniz farelerin isimlerini yazıp, arkadaş olarak ekleyin.",
        "psmodules-tr":
            "MODULES ekranına gelip(Varsayılan tuşu R1), LIFE SUPPORT dışında bütün Gemi Modullerini kapatın(Power Plant ve Canopy kapatılamaz, LIFE SUPPORT’U ASLA kapatmayın)",
        "psquit-tr":
            "Kumanda üzerindeki OPTIONS tuşuna basıp açılan menu’den “Save and Exit to Main Menu”ya tıklayarak oyundan log out olun.",
        "pswing-tr":
            "Fareleri uçuş kolunuza eklemek için KARE tuşuna basılı tutarken D-Pad üzerindeki Aşşağı tuşuna basın ve ardından 1 kere R1 tuşuna basın. Ardından açılan listeden Fare’nin isminin üzerine basıp [Invite to Wing]’e tıklayın.",
        "pcmodules-tr":
            "Gemi modulelerini kapatmak için sağ panele gidin (4’e tıkayarak) ve Modules alt paneline gidin(Q veya E tuşu ile alt paneller arasında geçiş yapın) ardından LIFE SUPPORT HARIÇ bütün gemi module’lerini kapatın(Power plant ve Canopy kapatılamaz).",
        "xmodules-tr":
            "Gemi modulelerinizi kapatmak için sağ panele gidip, MODULES alt paneline girip bütün gemi module’lerini teker teker seçip(LIFE SUPPORT HARIÇ) DEACTIVATE’i seçip kapatın. (Power Plant ve Canopy kapatılamaz).",
        "xquit-tr":
            "Acilen oyundan Log out olmak için lütfen MENU tuşuna bas ve ardından Save an Exit tuşu ile ana ekrana çık.",
        "kgbfoam-tr":
            "Oyun içindeki Galaksi haritasının kendiliğinden yakıt toplanabilir yıldızları seçmeniz için filtresi mevcuttur: https://t.fuelr.at/kgbfoamtr",
        "prep-tr":
            "Gemi modulelerinizi kapatmak için sağ panele gidip, MODULES alt paneline girip bütün gemi module’lerini teker teker seçip(LIFE SUPPORT HARIÇ) DEACTIVATE’i seçip kapatın. (Power Plant ve Canopy kapatılamaz).",
    };
}
