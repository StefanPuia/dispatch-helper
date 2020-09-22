import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextCN extends DispatchTextBase {
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

    public getEnglishCheck(): string {
        return new DispatchTextEN(this.state).getEnglishCheck();
    }

    public getPostCRInst(): string {
        return new DispatchTextEN(this.state).getPostCRInst();
    }

    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getWelcome() {
        return `欢迎来到Fuel Rats，${this.state.nick}. 请在您关闭所有除Life Support的组件后通知我。如果您需要说明或者是您看到上右角有"Oxygen Depleted In:"的计时，请通知我。`;
    }

    public getPrepPing() {
        return `${this.state.nick} 您是否已关闭所有除Life Support的组件。`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} 请立即关闭Silent Running！默认键Delete，或者在右手边控制板>Ship页面>Functions页面-中间靠右的设置。`;
    }

    public oxygenCheck() {
        return `${this.state.nick} 您是否看到上右角有“Oxygen Depleted In ..."的计时?`;
    }

    public getSysConf() {
        return `${this.state.nick} 请打开左手边控制板，打开Navigation页面，然后告诉我在System下面所写的星系名称。`;
    }

    public getPreFR() {
        return `${this.state.nick} 请把一下名字加入您的好友列表：${this.getAssignedRatsQuote()}`;
    }

    public openPlay() {
        return `${this.state.nick} 请登出游戏，然后重新登入Open Play。然后重新关闭Thrusters。`;
    }

    public getPreWing() {
        return `${this.state.nick} 请把您的老鼠邀请到您的Wing。`;
    }

    public getPreBeacon() {
        return `${this.state.nick} 为了帮助您的老鼠定位，请启动您的Beacon。`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} 请打开您上左角的通讯板，然后打开第三个页面（邀请Wing的页面），然后在设置下面选择"Enable Wing Beacon"。`;
    }

    public lifeSupport() {
        return `${this.state.nick} 请立即启动您的Life Support:打开右手边控制板，打开Modules页面，选择Life Support，然后选择Activate。`;
    }

    public getMMStay() {
        return `${this.state.nick} 从现在开始，请留在游戏主页面！在我在说“GO GO GO”之前，不要登入游戏。`;
    }

    public getMMConf() {
        return `${this.state.nick} 请确认您已退出到游戏主页面，并且能看到您的飞船停靠在空间站里面。`;
    }

    public getCRSysConf() {
        return `${this.state.nick} 请您留在主页面，然后告诉我您在上右角在/IDLE旁边看到的星系名字。`;
    }

    public getCROxygen() {
        return `${this.state.nick} （请不要登入查看）您记得您还有多长时间的氧气吗？`;
    }

    public getCRPosition() {
        return `${this.state.nick} （请不要登入查看）您记得您在星系里的位置吗？在恒星，星球，或者空间站旁边或者途中？`;
    }

    public getCRGO() {
        return `${this.state.nick} ＧＯ　ＧＯ　ＧＯ！１：登入Open　Play　－　２.启动您的Beacon　－　３.邀请您的老鼠$２到您的Wing - 4.在这里告诉我您剩下的氧气，并且如果我指示您再次登出的话，马上登出。`;
    }

    public getCRVideo() {
        return `${this.state.nick} 以下视频会示范如何操作: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        return `${this.state.nick} 您的老鼠预计会在 ${minutes} 分钟后到达。如果您在这时间段看到上右角出现一个蓝色氧气计时，请立即通知我们。`;
    }

    public getSCInfo() {
        return `${this.state.nick} 您离恒星太近了，请：`;
    }

    public getSCEnter() {
        return `${this.state.nick} 请打开您的左手边控制板，打开Navigation页面，选择您的星系的主恒星（列表里面第一个选项），然后按您的Jump按键。`;
    }

    public getSCLeave() {
        return `${this.state.nick} 请降低速度到30km/s，打开您的左手边控制板，打开Navigation页面，选择您星系的主恒星（列表里面第一个选项），然后按您的Jump按键。`;
    }

    public getSuccess() {
        return `${this.state.nick} 您现在应该已受到燃料。请听一下您的老鼠分享一些燃料管理技巧。`;
    }

    public getDBChannel() {
        return `${this.state.nick} 如果您想要您的老鼠用中文去分享一些燃料管理技巧，请在这儿里输入 /join #debrief，或者双点击#debrief。`;
    }

    public getFailure() {
        return `${this.state.nick} 很抱歉我们今天没能够帮助到您。您的老鼠有一些关于燃料管理的一些技巧可以分享，请听取一下。`;
    }
}
