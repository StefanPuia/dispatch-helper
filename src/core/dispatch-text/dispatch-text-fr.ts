import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextFR extends DispatchTextBase {
    private yourRats = this.isPlural() ? "vos rats" : "votre rat";

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
        return `${this.state.nick} parlez-vous anglais?`;
    }

    public getWelcome() {
        return `Bienvenue chez les Fuel rats, ${this.state.nick}. Veuillez nous dire quand vous avez éteint tous vos modules SAUF les Systèmes de Survie, si vous avez besoin d'aide pour le faire ou si un minuteur "Oxygène épuisé dans :" apparait en haut à droite.`;
    }

    public getPrepPing() {
        return `${this.state.nick} avez-vous éteints tous vos modules EXCEPTÉ les Systèmes de Survie?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} désactivez immédiatement le Mode Furtif! Touche par défaut: Suppr/Delete, ou alors dans l'Holo panneau de Droite > onglet VAISSEAU > écran Fonctions - Millieu-droite`;
    }

    public oxygenCheck() {
        return `${this.state.nick} voyez-vous un minuteur "Oxygène épuisé dans..." en haut à droite de votre cockpit?`;
    }

    public getSysConf() {
        return `${this.state.nick} veuillez aller dans votre panneau de gauche, onglet Navigation, puis envoyez-moi le nom complet écrit sous "Système", dans le coin en haut à gauche.`;
    }

    public getPreFR() {
        return `${this.state.nick} veuillez ajouter ces noms à votre liste d'amis: ${this.getAssignedRatsQuote()}`;
    }

    public openPlay() {
        return `${this.state.nick} veuillez retourner au menu principal, vous connecter en jeu OUVERT, puis désactiver à nouveau vos propulseurs.`;
    }

    public getPreWing() {
        return `${this.state.nick} maintenant veuillez inviter ${this.yourRats} dans une Escadrille.`;
    }

    public getPreBeacon() {
        const ourRats = this.isPlural() ? "nos rats" : "notre rat";
        const can = this.isPlural() ? "puissent" : "puisse";
        return `${this.state.nick} finalement, j'aurais besoin que vous allumiez votre balise d'escadrille afin que ${ourRats} ${can} vous trouver dans le système`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} veuillez aller dans le panneau Communication en haut à gauche, puis dans le 3ème onglet (là où vous avez invité ${this.yourRats} en Escadrille) sous Options sélectionner 'Activer Balise d'Escadrille'.`;
    }

    public lifeSupport() {
        return `${this.state.nick} veuillez immédiatement rallumer vos Systèmes de Survie : allez dans le menu à droite -> onglet Modules -> sélectionnez vos Systèmes de Survie, puis activez-les`;
    }

    public getCRMenu() {
        return `${this.state.nick} à partir de maintenant, veuillez rester sur le Menu Principal! NE vous connectez SURTOUT PAS jusqu'à ce que je vous envoie un "GO GO GO".`;
    }

    public getMMConf() {
        return `${this.state.nick} veuillez confirmer que vous êtes retourné au menu principal où vous pouvez voir votre vaisseau dans un hangar.`;
    }

    public getCRSysConf() {
        return `${this.state.nick} En restant au menu principal, pouvez-vous confirmer le nom de votre système complet, en incluant tous noms de secteurs? Vous le trouverez en haut à droite, sous votre nom de CMD, où est indiqué / INACTIF`;
    }

    public getCROxygen() {
        return `${this.state.nick} sans vous reconnecter, vous souvenez vous de combien de temps il vous restait sur le minuteur d'Oxygène?`;
    }

    public getCRPosition() {
        return `${this.state.nick} sans vous reconnecter, vous souvenez vous de votre position dans le système ? Vers une étoile, une planète, une station, ou en route vers l'une de ces choses?`;
    }

    public getCRGO() {
        return `${
            this.state.nick
        } GO GO GO! 1. Connectez-vous en Mode OUVERT - 2. allumez votre balise d'escadrille - 3. invitez ${
            this.yourRats
        } ${this.getAssignedRatsQuote()} dans une escadrille - 4. rapportez votre temps d'oxygène dans ce chat et préparez-vous à vous déconnecter si je vous le demande.`;
    }

    public getCRVideo() {
        return `${this.state.nick} voici une courte vidéo sur comment le faire: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        const theyWillBe = this.isPlural() ? "seront" : "sera";
        return `${this.state.nick} ${this.yourRats} ${theyWillBe} avec vous dans environ ${minutes} minute(s), si vous voyez un minuteur d'oxygène bleu apparaitre dites le moi immédiatement.`;
    }

    public getSCInfo() {
        return `${this.state.nick} il semblerait que vous soyez trop proche d'un corps céleste, veuillez suivre ces instructions:`;
    }

    public getSCEnter() {
        return `${this.state.nick} pour aller en super-navigation ouvrez votre menu de gauche, onglet Navigation, sélectionnez l'étoile principale de votre système (tout en haut de la liste), puis appuyez sur votre bouton de saut.`;
    }

    public getSCLeave() {
        return `${this.state.nick} pour sortir de super-navigation ralentissez à 30km/s, ouvrez votre menu de gauche, onglet Navigation, sélectionnez l'étoile principale de votre système (tout en haut de la liste), puis appuyez sur votre bouton de saut.`;
    }

    public getSuccess() {
        return `${this.state.nick} merci d'avoir appelé les Fuel Rats. Veuillez rester avec votre/vos rat(s) pour quelques astuces sur la gestion de carburant.`;
    }

    public getDBChannel() {
        return `${this.state.nick} Pour des astuces et informations en Français veuillez rejoindre le channel → #debrief ← soit en cliquant dessus juste ici, soit en tapant /join #debrief dans ce channel, un onglet va apparaitre à gauche du tchat, veuillez cliquer dessus.`;
    }

    public getFailure() {
        const will = this.isPlural() ? "vont" : "va";
        return `${this.state.nick} je suis navré que nous n'ayons pas pu vous atteindre à temps ce coup-ci, ${this.yourRats} ${will} être là après que vous réapparaissiez pour vous donner quelques conseils et astuces, alors veuillez rester avec eux un moment.`;
    }
}
