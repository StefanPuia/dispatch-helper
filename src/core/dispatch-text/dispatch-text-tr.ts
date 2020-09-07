import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextTR extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} İngilizce biliyor musunuz?`;
    }
}
