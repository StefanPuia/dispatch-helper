import DispatchTextBase from "./dispatch-text";

export default class DispatchTextEN extends DispatchTextBase {
    private getRatWord() {
        return this.isPlural() ? "rats" : "rat";
    }

    public getEnglishCheck() {
        return `${this.state.nick} do you speak English?`;
    }

    public getWelcome() {
        return `Welcome to the Fuel Rats, ${this.state.nick}. Please tell us once you've powered down all of your modules EXCEPT life support, need help with it or if an "Oxygen depleted in:" timer appear in the upper right.`;
    }

    public getCRPreInst() {
        return `${this.state.nick} i will give you a brief of what you have to do, DO NOT do any of this yet, try to remember these as you will have to do them very quick, let me know if you have any questions`;
    }

    public getCRInst() {
        return `${
            this.state.nick
        } when i give you the signal, you will log into OPEN play, turn on your wing beacon, then invite your ${this.getRatWord()} to a wing, then come back here and let me know how much oxygen you have left.`;
    }

    public getPostCRInst() {
        return `${this.state.nick} again, DO NOT log in yet. just let me know if you understand the above.`;
    }

    public getMMConf() {
        return `${this.state.nick} please confirm you are at the main menu (where you can see your ship in the hangar)`;
    }

    public getPreFR() {
        const theseNames = this.isPlural() ? "these names" : "this name";
        return `${this.state.nick} please add ${theseNames} to your friend list: ${this.getAssignedRatsQuote()}`;
    }

    public alsoFR() {
        return `${this.state.nick} please also add: ${this.getRatsNeedingFRQuote()}`;
    }

    public getPreWing() {
        return `${this.state.nick} now invite your ${this.getRatWord()} to a wing`;
    }

    public alsoWR() {
        return `${this.state.nick} please also invite ${this.getRatsNeedingWRQuote()} to your wing`;
    }

    public getPreBeacon() {
        return `${
            this.state.nick
        } lastly, enable your wing beacon so your ${this.getRatWord()} can find you in the system`;
    }

    public getSuccess() {
        return `${
            this.state.nick
        } you should be receiving fuel now. Please remain with your ${this.getRatWord()} for some quick and helpful tips on fuel management.`;
    }

    public getSysConf() {
        return `${this.state.nick} please look in the left panel in the navigation tab and give me the full system name under "System" in the top left corner.`;
    }

    public getCROxygen() {
        return `${this.state.nick} without logging in to check, do you remember how much oxygen you had left on the counter?`;
    }

    public getCRPosition() {
        return `${this.state.nick} without logging in to check, do you remember how close you were to any landmark? By the star, a planet or station or on the way to one?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} can you take a look at the top-right corner of your screen, where your ship is in the hangar, and tell me the full system name?`;
    }

    public getPrepPing() {
        return `${this.state.nick} did you turn off all your modules EXCEPT life support?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} please disable Silent Running Immediately! Default key: Delete, or in the Right-hand side Panel > SHIP tab > Functions Screen - Middle Right`;
    }

    public oxygenCheck() {
        return `${this.state.nick} do you see a "oxygen depleted in ..." timer in the top right of your HUD?`;
    }

    public openPlay() {
        return `${this.state.nick} please exit to the main menu and log back in to OPEN play, then re-disable your thrusters.`;
    }

    public lifeSupport() {
        return `${this.state.nick} please turn your Life Support on immediately: go to the right menu -> Modules tab, select Life Support and select Activate`;
    }

    public getMMStay() {
        return `${this.state.nick} from THIS point onwards, remain logged out in the Main Menu please! Do NOT login until I give you the "GO GO GO" command.`;
    }

    public getCRGO() {
        return `${
            this.state.nick
        } GO GO GO! 1. Login to OPEN - 2. light your beacon - 3. invite your ${this.getRatWord()}: ${this.getAssignedRatsQuote()} to a wing - 4. report your o2 time in this chat and be ready to logout if I tell you to.`;
    }

    public getCRVideo() {
        return `${this.state.nick} here is a short video on how to do it: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        return `${
            this.state.nick
        } your ${this.getRatWord()} will be with you in about ${minutes} minutes, if you see a blue oxygen timer pop up at any time tell me immediately.`;
    }

    public getSCInfo() {
        return `${this.state.nick} looks like you're too close to a stellar body, please do the following:`;
    }

    public getBeaconAlt() {
        return `${
            this.state.nick
        } please go to the Comms Menu on the top left, and from the third tab (where you invited your ${this.getRatWord()} to the wing) under Options use 'Enable Wing Beacon'.`;
    }

    public getSCEnter() {
        return `${this.state.nick} to enter supercruise open your left menu, navigation tab and select the main star in your current system (will be the first entry in the list), then press the jump button.`;
    }

    public getSCLeave() {
        return `${this.state.nick} to drop from supercruise slow down to 30km/s, open your left menu, navigation tab and select the main star in your current system (will be the first entry in the list), then press the jump button.`;
    }

    public getDBChannel() {
        return `${this.state.nick} for tips on fuel management, please join the channel #debrief etiher by clicking on it, or by typing /join #debrief in this channel. A tab will appear to the left of the chat. Please click on it.`;
    }

    public getFailure() {
        return `${
            this.state.nick
        } sorry we couldn't get to you in time today, your ${this.getRatWord()} will be there for you after you respawn to help you with some tips and tricks, so please stick with them for a bit.`;
    }

    public getRefreshSocial() {
        if (this.state.platform === "PS4" || this.state.platform === "XB") {
            return `${this.state.nick} please press OPTION on your controller, go to Social and press R1 and L1 a couple of times to refresh your friendslist`;
        }
        return "";
    }
}
