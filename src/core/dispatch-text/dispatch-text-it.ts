import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextIT extends DispatchTextBase {
    private yourRats = this.isPlural() ? "i tuoi Rat" : "il tuo Rat";
    private invite = this.isPlural() ? "invitato" : "invita";

    public alsoFR(): string {
        return new DispatchTextEN(this.state).alsoFR();
    }

    public alsoWR(): string {
        return new DispatchTextEN(this.state).alsoWR();
    }

    public getCRInst(): string {
        return new DispatchTextEN(this.state).getCRInst();
    }

    public getCRPreInst(): string {
        return new DispatchTextEN(this.state).getCRPreInst();
    }

    public getPostCRInst(): string {
        return new DispatchTextEN(this.state).getPostCRInst();
    }

    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getEnglishCheck() {
        return `${this.state.nick} lei parla inglese?`;
    }

    public getWelcome() {
        return `Benvenuto/a presso i Fuel Rats, ${this.state.nick}. Per cortesia avvisaci non appena hai disattivato tutti i moduli ECCETTO il "Life Support", in caso tu abbia bisogno di aiuto o se un avviso con su scritto "Oxygen depleted in:" e un timer appare nell'angolo in alto a destra.`;
    }

    public getPrepPing() {
        return `${this.state.nick} Hai disattivato tutti i moduli ECCETTO "Life Support"?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} per cortesia disattiva Silent Running immediatamente! Tasto di default Canc/Delete on nel pannello a destra Ship > Schermata funzioni a destra al centro`;
    }

    public oxygenCheck() {
        return `${this.state.nick} vedi una timer "Oxygen Depleted in:" in alto a destra dello schermo?`;
    }

    public getSysConf() {
        return `${this.state.nick} per cortesia, guarda nel pannello a sinistra dello schermo di navigazione e comunica il nome completo del sistema che trovi nell'angolo in basso a sinistra alla voce "System".`;
    }

    public getPreFR() {
        const theseNames = this.isPlural() ? "questi nomi" : "questo nome";
        return `${
            this.state.nick
        } per cortesia aggiungi ${theseNames} alla tua lista amici: ${this.getAssignedRatsQuote()}`;
    }

    public openPlay() {
        return `${this.state.nick} per cortesia, esci al menu principale e torna nel gioco in OPEN play, poi ri-disabilita i thrusters.`;
    }

    public getPreWing() {
        return `${this.state.nick} per cortesia ${this.invite} ${this.yourRats} in un "Wing".`;
    }

    public getPreBeacon() {
        const can = this.isPlural() ? "possano" : "possa";
        return `${this.state.nick} per finire, attiva il tuo beacon così ${this.yourRats} ${can} trovarti`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} per cortesia vai al menu comunicazioni in alto a sinistra, e dalla terza scheda(da cui hai ${this.invite} ${this.yourRats} al "Wing"), sotto a "Options" seleziona "enable Wing Beacon"`;
    }

    public lifeSupport() {
        return `${this.state.nick} per cortesia attiva "Life Support" immediatamente: vai nel menu a destra -> Modules , seleziona "Life support" e poi "Activate"`;
    }

    public getCRMenu() {
        return `${this.state.nick} da questo punto, rimani sulla schermata del menu principale! NON rientrare nel gioco finchè non ti dò il comando "GO GO GO"`;
    }

    public getMMConf() {
        return `${this.state.nick} per cortesia conferma che sei uscito al menu principale da cui puoi vedere la tua nave nell'hangar.`;
    }

    public getCRSysConf() {
        return `${this.state.nick} Rimanendo nel menu principale, puoi confermare il nome completo del sistema incluso il nome del settore? Guarda in alto a destra sotto al tuo nome CMDR dove c'è scritto "IDLE"`;
    }

    public getCROxygen() {
        return `${this.state.nick} senza rientrare nel gioco, ricordi quanto ossigeno avevi rimasto?`;
    }

    public getCRPosition() {
        return `${this.state.nick} senza rientrare nel gioco, ricordi DOVE eri nel sistema? Vicino alla stella, un pianeta, una stazione spaziale o viaggiando verso una?`;
    }

    public getCRGO() {
        return `${this.state.nick} GO GO GO! 1.Entra in OPEN - 2. attiva il Beacon - 3. ${this.invite} ${
            this.yourRats
        } ${this.getAssignedRatsQuote()} a un "Wing" - 4. Comunica il tempo rimasto nel tuo timer dell'ossigeno in questa chat e sii pronto a uscire dal gioco se te lo dico.`;
    }

    public getCRVideo() {
        return `${this.state.nick} quì c'è un breve video che spiega come farlo: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        const willBe = this.isPlural() ? "saranno" : "sarà";
        const minute = minutes === 1 ? "minuto" : "minuti";
        return `${this.state.nick} ${this.yourRats} ${willBe} con te in circa ${minutes} ${minute}, se vedi un timer blu dell'ossigeno comparire dimmelo immediatamente.`;
    }

    public getSCInfo() {
        return `${this.state.nick} sembra che tu sia troppo vicino ad un oggetto celeste, per cortesia segui queste istruzioni:`;
    }

    public getSCEnter() {
        return `${this.state.nick} per entrare in supercruise, apri il pannello a sinistra, scheda "navigation" e seleziona la stella principale del tuo sistema(sarà la prima della lista), poi seleziona il tasto "jump".`;
    }

    public getSCLeave() {
        return `${this.state.nick} per uscire dal Supercruise, rallenta fino a 30km/s,  apri il pannello a sinistra, scheda "navigation" e seleziona la stella principale del tuo sistema(sarà la prima della lista), poi seleziona il tasto "jump".`;
    }

    public getSuccess() {
        return `${this.state.nick} dovresti ricevere carburante ora. Per cortesia rimani con il tuo Rat per qualche rapido consiglio su come gestire il carburante.`;
    }

    public getDBChannel() {
        return `${this.state.nick} Per consigli e informazioni in Italiano, per cortesia entra nel canale → #debrief ← cliccando sul nome del canale o scrivendo /join #debrief, una scheda si aprirà sulla sinistra della chat, sulla quale puoi passare.`;
    }

    public getFailure() {
        const willBe = this.isPlural() ? "saranno" : "sarà";
        const them = this.isPlural() ? "loro" : "lui";
        return `${this.state.nick} ci dispiace di non averti raggiunto per tempo oggi, ${this.yourRats} ${willBe} li con te quando respawni per aiutarti con consigli e alcuni trucchi, per cortesia rimani con ${them} qualche minuto.`;
    }
}
