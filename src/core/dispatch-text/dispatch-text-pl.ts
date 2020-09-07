import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextPL extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} czy mówisz po angielsku?`;
    }
}
