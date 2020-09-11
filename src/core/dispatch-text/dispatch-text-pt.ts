import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextPT extends DispatchTextBase {
    private yourRats = this.isPlural() ? "seus ratos" : "seu rato";

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
        return `${this.state.nick} você fala inglês?`;
    }

    public getWelcome() {
        return `Seja bem-vindo ao Fuel Rats, ${this.state.nick}. Por favor, nos avise assim que você tiver desligado todos os seus modulos EXCETO o suporte de vida, se precisar de ajuda com isso ou se uma mensagem de "Oxigênio esgotado em:" com um temporizador aparecerem no canto superior direito.`;
    }

    public getPrepPing() {
        return `${this.state.nick} você desligou todos os seus módulos EXCETO suporte de vida?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} por favor desabilite Nav. Silenciosa! Tecla padrão: Delete, ou no painel do Hologramaa no lado direito > aba NAVE > Tela Funções - No meio à direita`;
    }

    public oxygenCheck() {
        return `${this.state.nick} você vê um temporizador com a mensagem "oxigênio esgotado em: " na parte superior direita da sua tela?`;
    }

    public getSysConf() {
        return `${this.state.nick} por favor, olhe no painel à esquerda, na aba navegação e me dê o nome completo do sistema em "Sistema" no canto superior esquerdo.`;
    }

    public getPreFR() {
        return `${this.state.nick} por favor adicione esses nomes à sua lista de amigos: ${this.getAssignedRats()}.`;
    }

    public openPlay() {
        return `${this.state.nick} por favor, saia para o menu principal e entre novamente em JOGO ABERTO, então desligue novamente os propulsores.`;
    }

    public getPreWing() {
        return `${this.state.nick} agora, por favor, convide ${this.yourRats} para o esquadrão.`;
    }

    public getPreBeacon() {
        const ourRats = this.isPlural() ? "nossos ratos" : "nosso rato";
        const can = this.isPlural() ? "possam" : "possa";
        return `${this.state.nick} e por fim eu preciso que você ligue seu sinalizador para que ${ourRats} ${can} encontrá-lo no sistema.`;
    }

    public getBeaconAlt() {
        const invited = this.isPlural() ? "convidaram" : "convidou";
        return `${this.state.nick} por favor, vá ao menu de comunicação na parte superior esquerda e na terceira aba (onde você ${invited} ${this.yourRats} ao esquadrão), em Opções, selecione "Ativar Localizador do Esquadrão".`;
    }

    public lifeSupport() {
        return `${this.state.nick} por favor ligue seu suporte de vida imediatamente: vá ao menu da direita -> aba módulos, selecione Suporte de Vida e selecione Inativo.`;
    }

    public getCRMenu() {
        return `${this.state.nick} DESTE ponto em diante, por favor, permaneça deslogado na tela do menu principal! NÃO entre até que eu dê à você o comando "GO GO GO".`;
    }

    public getMMConf() {
        return `${this.state.nick} por favor, confirme que você saiu para o menu principal, onde é possível ver sua nave no hangar.`;
    }

    public getCRSysConf() {
        return `${this.state.nick} Permanecendo no menu principal, você pode confirmar o nome completo do seu sistema, incluindo qualquer nome de setor. Veja no canto superior direito, abaixo do seu nome CMDT, onde diz / INATIVO`;
    }

    public getCROxygen() {
        return `${this.state.nick} sem entrar para checar, você se lembra de quanto tempo restante tinha de O2?`;
    }

    public getCRPosition() {
        return `${this.state.nick} sem entrar, você se lembra ONDE estava no sistema? Próximo à estrela, um planeta ou estação ou à caminho de algum deles?`;
    }

    public getCRGO() {
        return `${this.state.nick} GO GO GO! 1. Entre em JOGO ABERTO - 2. Ligue seu sinalizador - 3. Convide ${
            this.yourRats
        } ${this.getAssignedRatsQuote()} para o esquadrão - 4. Informe o tempo restante de o2 neste chat e fique preparado para sair se eu assim disser.`;
    }

    public getCRVideo() {
        return `${this.state.nick} aqui está um vídeo curto sobre como proceder: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        const are = this.isPlural() ? "estarão" : "estará";
        const minute = minutes === 1 ? "minuto" : "minutos";
        return `${this.state.nick} ${this.yourRats} ${are} com você em aproximadamente ${minutes} ${minute}, se aparecer o temporizador azul de oxigênio esgotado em qualquer momento, diga-me imediatamente.`;
    }

    public getSCInfo() {
        return `${this.state.nick} parece que você está muito próximo de um corpo estelar, por favor faça o seguinte:`;
    }

    public getSCEnter() {
        return `${this.state.nick} para entrar em supervelocidade, abra o menu da esquerda, aba Navegação e selecione a estrela principal em seu sistema atual (será a primeira da lista), então pressione o botão de salto.`;
    }

    public getSCLeave() {
        return `${this.state.nick} para sair da supervelocidade, desacelere para 30km/s, abra seu menu da esquerda, aba Navegação e selecione a estrela principal em seu sistema atual (será a primeira da lista), então pressione o botão de salto.`;
    }

    public getSuccess() {
        return `${this.state.nick} obrigado por chamar o Fuel Rats hoje. Por favor, continue com ${this.yourRats} para algumas dicas úteis sobre gerenciamento de combustível.`;
    }

    public getDBChannel() {
        return `${this.state.nick} para conselhos e informações em Portuguese, por favor, entre no canal → #debrief ← tanto clicando nele ou digitando /join #debrief neste canal, uma aba abrirá na esquerda do chat. Alterne para ela.`;
    }

    public getFailure() {
        const are = this.isPlural() ? "estarão" : "estará";
        const them = this.isPlural() ? "eles" : "ele";
        return `${this.state.nick} desculpe, não conseguimos chegar até você a tempo hoje, ${this.yourRats} ${are} lá após você reviver para ajudá-lo com algumas dicas então, por favor, fique com ${them} por um momento.`;
    }
}
