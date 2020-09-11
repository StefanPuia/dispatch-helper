import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextDE extends DispatchTextBase {
    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getWelcome() {
        return `Willkommen bei den Fuel Rats, ${this.state.nick}. Bitte sage bescheid, wenn du alle Module AUßER der Lebenserhaltung ausgeschaltet hast, wenn du hilfe brauchst oder wenn ein "Sauerstoff aufgebraucht in:" Zähler in der oberen rechten Ecke auftaucht.`;
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
        return `${this.state.nick} bitte bestätige, dass du im Haupmenü bist wo du dein Schiff im Hangar siehst.`;
    }

    public getPreFR() {
        return `${this.state.nick} bitte füge diese Namen deiner Freundesliste hinzu: ${this.getAssignedRatsQuote()}`;
    }

    public alsoFR() {
        return `${
            this.state.nick
        } Bitte füge diese Ratten auch deiner Freundesliste hinzu: ${this.getRatsNeedingFRQuote()}`;
    }

    public getPreWing() {
        return `${this.state.nick} bitte lade deine ratten in ein Geschwader ein.`;
    }

    public alsoWR() {
        return `${
            this.state.nick
        } Bitte füge diese Ratten auch deinem Geschwader hinzu: ${this.getRatsNeedingWRQuote()}`;
    }

    public getPreBeacon() {
        return `${this.state.nick} als letztes aktiviere dein Signal, damit deine Ratten dich finden können.`;
    }

    public getSuccess() {
        return `${this.state.nick} du solltest jetzt treibstoff bekommen. Bitte bleibe noch bei deiner Ratte für ein paar nüzliche Tipps.`;
    }

    public getSysConf() {
        return `${this.state.nick} bitte schau ins linke Pannel im Navigationsreiter und sag mir den kompletten Systemnamen unter "System" in der oberen linken Ecke.`;
    }

    public getCROxygen() {
        return `${this.state.nick} ohne dich anzumelden, kannst du dich erinnern, wie viel Zeit noch auf dem Sauerstofftimer war?`;
    }

    public getCRPosition() {
        return `${this.state.nick} ohne dich anzumelden, kannst du dich erinnern WO im System du warst? In der Nähe von einem Stern oder auf dem Weg zu einer Station oder Planet?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} kannst du bitte deinen kompletten Systemnamen mit Sektornamen bestätigen? Schaue im Hauptmenü in die obere rechte Ecke unter deinen Kommandantennamen wo / Leerlauf steht.`;
    }

    public getPrepPing() {
        return `${this.state.nick} hast du alle Module AUßER die Lebenserhaltung ausgeschaltet?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} bitte deaktiviere sofort Schleichfahrt! Standardtaste dafür ist 'Entf'. Oder im rechten Holopanel, Registerkarte Schiff, in den Funktionen (Mitte rechts)`;
    }

    public oxygenCheck() {
        return `${this.state.nick} siehst du einen blauen "Sauerstoff verbraucht in..." countdown oben rechts auf deinem HUD?`;
    }

    public openPlay() {
        return `${this.state.nick} bitte gehe ins Hauptmenü und logge dich in OFFENES spiel ein, danach schalte deine Schubdüsen wieder aus.`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} Bitte gehe ins Kommunikationsmenü (oben links), wechsel zum dritten Reiter (dort wo du deine Ratten in das Geschwader eingeladen hast) und dann wähle unter Optionen "Geschwadersignal Aktivieren".`;
    }

    public lifeSupport() {
        return `${this.state.nick} bitte schalte deine Lebenserhaltung sofort wieder an: im rechten Menü -> Reider Module, wähle die Lebenserhaltung aus und wähle aktivieren`;
    }

    public getCRMenu() {
        return `${this.state.nick} bleib bitte ab jetzt im Hauptmenü! Logge dich NICHT ein bis ich dir das "GO GO GO" Kommando gebe.`;
    }

    public getCRGO() {
        return `${
            this.state.nick
        } GO GO GO! 1. logge dich in OFFENES Spiel ein - 2. aktiviere dein Geschwadersignal - 3. lade deine Ratten ${this.getAssignedRatsQuote()} in ein Geschwader ein.`;
    }

    public getCRVideo() {
        return `${this.state.nick} hier ist ein kurzes video dazu: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        return `${this.state.nick} deine Ratten sind in etwa ${minutes} Minuten da, falls ein blauer Sauerstofftimer auftaucht sage mir sofort bescheid.`;
    }

    public getSCInfo() {
        return `${this.state.nick} scheint als wärst du zu nah an einem Stern, bitte mache das folgende:`;
    }

    public getSCEnter() {
        return `${this.state.nick} um in den Supercruse zu gehen öffne das linke Menü, gehe zum Reiter "Navigation" und wähle dort den Hauptstern aus (der oberste Eintrag in der Liste), dann drücke den Sprung Knopf.`;
    }

    public getSCLeave() {
        return `${this.state.nick} um den Supercruse zu verlassen bremse auf 30km/s, gehe ins linke Menü auf den Reiter "Navigation" und wähle den Hauptstern aus (der oberste Eintrag in der Liste), dann drücke den Sprung Knopf.`;
    }

    public getDBChannel() {
        return `${this.state.nick} für Tipps und Hinweise in Deutsch betritt bitte den Kanal → #debrief ← entweder, in dem Du darauf klickst, oder in dem Du /join #debrief eingibst. Ein neuer Tab mit dem Raum wird dann oben erscheinen.`;
    }

    public getFailure() {
        return `${this.state.nick} tut uns leid, dass wir dir nicht helfen konnten. Deine Ratten können dir trotzdem ein paar Tips geben.`;
    }
}
