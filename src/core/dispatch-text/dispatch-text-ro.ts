import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextRO extends DispatchTextBase {
    public alsoFR(): string {
        return new DispatchTextEN(this.state).alsoFR();
    }

    public alsoWR(): string {
        return new DispatchTextEN(this.state).alsoWR();
    }

    public getBeaconAlt(): string {
        return new DispatchTextEN(this.state).getBeaconAlt();
    }

    public getCRGO(): string {
        return new DispatchTextEN(this.state).getCRGO();
    }

    public getCRInst(): string {
        return new DispatchTextEN(this.state).getCRInst();
    }

    public getMMStay(): string {
        return new DispatchTextEN(this.state).getMMStay();
    }

    public getCROxygen(): string {
        return new DispatchTextEN(this.state).getCROxygen();
    }

    public getCRPosition(): string {
        return new DispatchTextEN(this.state).getCRPosition();
    }

    public getCRPreInst(): string {
        return new DispatchTextEN(this.state).getCRPreInst();
    }

    public getCRSysConf(): string {
        return new DispatchTextEN(this.state).getCRSysConf();
    }

    public getCRVideo(): string {
        return new DispatchTextEN(this.state).getCRVideo();
    }

    public getDBChannel(): string {
        return new DispatchTextEN(this.state).getDBChannel();
    }

    public getEta(minutes: number): string {
        return new DispatchTextEN(this.state).getEta(minutes);
    }

    public getFailure(): string {
        return new DispatchTextEN(this.state).getFailure();
    }

    public getMMConf(): string {
        return new DispatchTextEN(this.state).getMMConf();
    }

    public getPostCRInst(): string {
        return new DispatchTextEN(this.state).getPostCRInst();
    }

    public getPreBeacon(): string {
        return new DispatchTextEN(this.state).getPreBeacon();
    }

    public getPreFR(): string {
        return new DispatchTextEN(this.state).getPreFR();
    }

    public getPreWing(): string {
        return new DispatchTextEN(this.state).getPreWing();
    }

    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getSCEnter(): string {
        return new DispatchTextEN(this.state).getSCEnter();
    }

    public getSCInfo(): string {
        return new DispatchTextEN(this.state).getSCInfo();
    }

    public getSCLeave(): string {
        return new DispatchTextEN(this.state).getSCLeave();
    }

    public getSuccess(): string {
        return new DispatchTextEN(this.state).getSuccess();
    }

    public lifeSupport(): string {
        return new DispatchTextEN(this.state).lifeSupport();
    }

    public openPlay(): string {
        return new DispatchTextEN(this.state).openPlay();
    }

    public getEnglishCheck() {
        return `${this.state.nick} vorbesti engleza?`;
    }

    public getWelcome() {
        return `Bine ai venit la FuelRats, ${this.state.nick}. Te rog sa ne spui cand ai terminat de dezactivat modulele, cu exceptia LIFE SUPPORT-ului, daca ai nevoie de ajutor cu ele, sau daca o numaratoare "Oxygen depleted in:" apare in coltul din dreapta sus.`;
    }

    public getPrepPing() {
        return `${this.state.nick} ai dezactivat toate modulele, in afara de LIFE SUPPORT?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} dezactiveaza "Silent running" imediat! Apasa DELETE sau, in panoul din dreapta > SHIP > FUNCTIONS, in dreapta - mijloc`;
    }

    public oxygenCheck() {
        return `${this.state.nick} vezi o "Oxygen Depleted in:" numaratoare in coltul din dreapta sus?`;
    }

    public getSysConf() {
        return `${this.state.nick} poti sa te uiti in panoul din stanga, sub NAVIGATION, si sa imi spui numele complet al sistemului care apare sub "System" in coltul din stanga sus?`;
    }
}
