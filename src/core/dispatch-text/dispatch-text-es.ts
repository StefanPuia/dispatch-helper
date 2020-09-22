import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextES extends DispatchTextBase {
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

    public getPostCRInst(): string {
        return new DispatchTextEN(this.state).getPostCRInst();
    }

    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getEnglishCheck() {
        return `¿${this.state.nick} hablas inglés?`;
    }

    public getWelcome() {
        return `Bienvenido/a a las Fuel Rats, ${this.state.nick}. Por favor, dime cuando hayas desactivado todos los módulos EXCEPTO el Soporte Vital, o si necesitas ayuda para hacerlo. Si ves una cuenta "Oxígeno Agotado en: ", avísame immediatamente.`;
    }

    public getPrepPing() {
        return `${this.state.nick} has desactivado todos los módulos EXCEPTO el Soporte Vital?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} por favor, desactiva Navegación Silenciosa immediatamente! Tecla por defecto: Suprimir, o en el panel Derecho > Nave > Centro derecha.`;
    }

    public oxygenCheck() {
        return `${this.state.nick} ves un mensaje de "Oxígeno Agotado en: " en la parte superior derecha de tu pantalla?`;
    }

    public getSysConf() {
        return `${this.state.nick} mira en el panel izquierdo, en la pestaña de Navegación, y dime el nombre completo de tu sistema.`;
    }

    public getPreFR() {
        return `${this.state.nick} añade a estas ratas a tu lista de amigos: ${this.getAssignedRatsQuote()}`;
    }

    public openPlay() {
        return `${this.state.nick} por favor, sal al Menú Principal, y entra en Juego Abierto. Vuelve a desactivar tus Impulsores cuando estés dentro.`;
    }

    public getPreWing() {
        return `${this.state.nick} ahora invita a tus ratas a Escuadrón.`;
    }

    public getPreBeacon() {
        return `${this.state.nick} por último, necesito que actives tu Baliza para que tus ratas te puedan encontrar.`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} por favor, ve al menú de comunicaciones, y donde invitaste a tus ratas a Escuadrón, en Opciones, usa "Activar Baliza de Escuadrón".`;
    }

    public lifeSupport() {
        return `${this.state.nick} activa tu Soporte Vital immediatamente: menu derecho -> Modulos -> selecciona Soporte Vital, y Activar.`;
    }

    public getMMStay() {
        return `${this.state.nick} desde este punto en adelante, quedate en el Menú Principal. NO entres en el juego hasta que no te diga "GO GO GO".`;
    }

    public getMMConf() {
        return `${this.state.nick} por favor, confirmame que estas en el Menú Principal, donde ves tu nave en el hangar.`;
    }

    public getCRSysConf() {
        return `${this.state.nick} quedándote en el Menú Principal, puedes confirmar el nombre completo del sistema, incluyendo el nombre del Sector? Esquina superior derecha, al lado de tu nombre / INACTIVO`;
    }

    public getCROxygen() {
        return `${this.state.nick} sin entrar a comprobarlo, te acuerdas de cuánto Oxígeno te quedaba?`;
    }

    public getCRPosition() {
        return `${this.state.nick} sin entrar a comprobarlo, te acuerdas de DÓNDE dentro del sistema estabas? Cerca de la estrella o algun planeta o estacion?`;
    }

    public getCRGO() {
        return `${
            this.state.nick
        } GO GO GO! 1. Entra en JUEGO ABIERTO - 2. activa tu Baliza - 3. invita a tus ratas ${this.getAssignedRatsQuote()} a Escuadrón - 4. informame de tu temporizador de Oxígeno en este chat y prepárate para salir al Menú si te lo digo.`;
    }

    public getCRVideo() {
        return `${this.state.nick} aqui hay un vídeo corto de como hacerlo: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        return `${this.state.nick} tus ratas llegaran en aproximadamente ${minutes} minuto(s), si ves un temporizador de Oxígeno, avisame immediatamente.`;
    }

    public getSCInfo() {
        return `${this.state.nick} parece que estas muy cerca de un cuerpo estelar, por favor, haz esto:`;
    }

    public getSCEnter() {
        return `${this.state.nick} para entrar en supercrucero, abre el menú izquierdo, Navegación, selecciona la estrella principal (primera de la lista), y luego pulsa el botón de salto.`;
    }

    public getSCLeave() {
        return `${this.state.nick} para salir de Supercrucero, desacelera hasta 30km/s, abre el menú izquierdo, Navegación, selecciona la estrella principal (primera de la lista), y luego pulsa el botón de salto.`;
    }

    public getSuccess() {
        return `${this.state.nick} gracias por llamar a las Fuel Rats. Por favor, quédate con tus ratas y te darán unos consejos sobre el combustible.`;
    }

    public getFailure() {
        return `${this.state.nick} siento que no te hayamos podido salvar, tus ratas estarán contigo cuando reaparezcas y te darán unos consejos sobre el combustible.`;
    }

    public getDBChannel() {
        return `${this.state.nick} para hablar con tus ratas en Castellano, unete a #debrief escribiendo /join #debrief en este canal.`;
    }
}
