import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextNL extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} spreek je engels?`;
    }
}
