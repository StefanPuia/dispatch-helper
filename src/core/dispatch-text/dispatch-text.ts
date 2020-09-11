import { CaseCardState } from "../../components/case.card";

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
        return `${this.localize("!sc")} ${this.state.nick}`;
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

    protected fixRatNicks(rats: string[] = []) {
        return rats.map((rat) => rat.replace(/\[.+?\]/gi, ""));
    }

    public getAssignedRats() {
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
}
