import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextCS extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} mluvíš anglicky?`;
    }
}
