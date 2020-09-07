import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextHU extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} beszélsz angolul?`;
    }
}
