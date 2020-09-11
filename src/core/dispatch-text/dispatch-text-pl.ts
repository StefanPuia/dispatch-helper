import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextPL extends DispatchTextBase {
    public alsoFR(): string {
        return new DispatchTextEN(this.state).alsoFR();
    }

    public alsoWR(): string {
        return new DispatchTextEN(this.state).alsoWR();
    }

    public disableSilentRunning(): string {
        return new DispatchTextEN(this.state).disableSilentRunning();
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

    public getCRMenu(): string {
        return new DispatchTextEN(this.state).getCRMenu();
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

    public getPrepPing(): string {
        return new DispatchTextEN(this.state).getPrepPing();
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

    public getSysConf(): string {
        return new DispatchTextEN(this.state).getSysConf();
    }

    public getWelcome(): string {
        return new DispatchTextEN(this.state).getWelcome();
    }

    public lifeSupport(): string {
        return new DispatchTextEN(this.state).lifeSupport();
    }

    public openPlay(): string {
        return new DispatchTextEN(this.state).openPlay();
    }

    public oxygenCheck(): string {
        return new DispatchTextEN(this.state).oxygenCheck();
    }

    public getEnglishCheck() {
        return `${this.state.nick} czy mówisz po angielsku?`;
    }
}
