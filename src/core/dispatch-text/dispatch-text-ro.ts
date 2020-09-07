import DispatchTextEN from "./dispatch-text-en";

export default class DispatchTextRO extends DispatchTextEN {
    public getEnglishCheck() {
        return `${this.state.nick} vorbesti engleza?`;
    }

    public getWelcome() {
        return `Bine ai venit la FuelRats, ${this.state.nick}. Te rog sa ne spui cand ai terminat de dezactivat modulele, cu exceptia LIFE SUPPORT-ului, daca ai nevoie de ajutor cu ele, sau daca o numaratoare "Oxygen depleted in:" apare in coltul din dreapta sus.`;
    }

    public getPrepPing() {
        return `${this.state.nick} ai dezactivat toate modulele, in afara de LIFE SUPPORT?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} dezactiveaza "Silent running" imediat! Apasa DELETE sau, in panoul din dreapta > SHIP > FUNCTIONS, in dreapta - mijloc`;
    }

    public oxygenCheck() {
        return `${this.state.nick} vezi o "Oxygen Depleted in:" numaratoare in coltul din dreapta sus?`;
    }

    public getSysConf() {
        return `${this.state.nick} poti sa te uiti in panoul din stanga, sub NAVIGATION, si sa imi spui numele complet al sistemului care apare sub "System" in coltul din stanga sus?`;
    }
}
