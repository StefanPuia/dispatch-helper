import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextNB extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} snakker du engelsk?`;
    }
}
