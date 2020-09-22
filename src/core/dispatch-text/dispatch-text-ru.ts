import DispatchTextEN from "./dispatch-text-en";
import DispatchTextBase from "./dispatch-text";

export default class DispatchTextRU extends DispatchTextBase {
    public getRefreshSocial(): string {
        return new DispatchTextEN(this.state).getRefreshSocial();
    }

    public getCRVideoLink() {
        return "https://fuelrats.cloud/s/DgZmtnJqai77Qwk";
    }

    public getWelcome() {
        return `Добро пожаловать к Топливным крысам, ${this.state.nick}. Пожалуйста сообщите нам, когда выключите все модули, кроме системы жизнеобеспечения, или если появится таймер отсчёта кислорода в правом верхнем углу экрана.`;
    }

    public getEnglishCheck() {
        return `${this.state.nick} ты говоришь по-английски?`;
    }

    public getCRPreInst() {
        return `${this.state.nick} Вот что вам нужно будет сделать. НЕ ДЕЛАЙТЕ этого пока я не скажу. Это только инструкции. Их нужно будет выполнять только когда я напишу вам «GO». После прочтения, скажите мне что вы всё прочитали и готовы продолжать.`;
    }

    public getCRInst() {
        return `${this.state.nick} 1 – войдите в ОТКРЫТУЮ игру, 2 – установите Маяк на КРЫЛО, 3 – пригласите всех Заправщиков в крыло, 4 – сообщите время на отсчете здесь и будьте готовы выйти, если я скажу.`;
    }

    public getPostCRInst() {
        return `${this.state.nick} Вам понятны эти инструкции? Если вам что-то непонятно, пожалуйста напишите "Doubt at:" и номер пункта, где нужно пояснение. Если всё понятно и вы готовы, напишите "I'm ready"`;
    }

    public getMMConf() {
        return `${this.state.nick} пожалуйста подтвердите, что вы вышли в главное меню игры, где вы можете видеть ваш корабль в ангаре.`;
    }

    public getPreFR() {
        return `${this.state.nick} пожалуйста добавьте следующие имена в список друзей: ${this.getAssignedRatsQuote()}`;
    }

    public alsoFR() {
        return `${this.state.nick} пожалуйста, также добавь этих крыс в друзья: ${this.getRatsNeedingFRQuote()}`;
    }

    public getPreWing() {
        return `${this.state.nick} теперь добавьте ваших заправщиков в крыло.`;
    }

    public alsoWR() {
        return `${this.state.nick} пожалуйста, также пригласите этих крыс в крыло: ${this.getRatsNeedingWRQuote()}`;
    }

    public getPreBeacon() {
        return `${this.state.nick} и наконец, включите пожалуйста маяк крыла, чтобы ваши топливные крысы могли найти вас в системе.`;
    }

    public getSuccess() {
        return `${this.state.nick} спасибо за ваше обращение к Fuel rats. мы рады, что смогли вам помочь. Вы можете включить ваши борт-системы. Пожалуйста оставайтесь в крыле для полезных советов по топливу.`;
    }

    public getSysConf() {
        return `${this.state.nick} пожалуйста, посмотрите на левую панель на вкладке навигации и дайте мне полное имя системы в разделе «Система» в верхнем левом углу.`;
    }

    public getCROxygen() {
        return `${this.state.nick} не заходя в игру, чтобы проверить, могли бы вы сказать сколько времени оставалось на вашем таймере кислорода?`;
    }

    public getCRPosition() {
        return `${this.state.nick} не заходя в игру, чтобы проверить, не могли бы вы сказать мне, где в системе вы находились, когда у вас кончилось топливо? Рядом со звездой, планетой, станцией или на пути к ней?`;
    }

    public getCRSysConf() {
        return `${this.state.nick} Оставаясь в главном меню, можете мне сказать полное название вашей системы, включая название сектора если оно есть? Посмотрите в правый верхний угол экрана, под вашим именем, где написано / На холостом ходу`;
    }

    public getPrepPing() {
        return `${this.state.nick} Вы отключили все модули кроме жизнеобеспечения?`;
    }

    public disableSilentRunning() {
        return `${this.state.nick} пожалуйста немедленно отключите функцию бесшумный ход!  Кнопка по умолчанию : DELETE или в правой панели: вкладка КОРАБЛЬ, экран функций, справа посередине.`;
    }

    public oxygenCheck() {
        return `${this.state.nick} вы видите таймер «Кислор. осталось на:» в правом верхнем углу экрана?`;
    }

    public openPlay() {
        return `${this.state.nick} для заправки нам нужно, чтобы вы были в ОТКРЫТОЙ игре. Пожалуйста сохранитесь и выйдите в главное меню, а затем зайдите в ОТКРЫТУЮ игру.`;
    }

    public getBeaconAlt() {
        return `${this.state.nick} откройте меню связи и из 3-ей вкладки (где вы приглашали крыс в крыло) в разделе Параметры крыла -> "Включить маяк крыла" (Enable Wing Beacon)`;
    }

    public lifeSupport() {
        return `${this.state.nick} немедленно включите вашу систему жизнеобеспечения: откройте правое меню, вкладка модули, выберите систему жизнеобеспечения и выберите активировать.`;
    }

    public getMMStay() {
        return `${this.state.nick} с этого момента, пожалуйста, оставайтесь в главном меню. НЕ входите в игру пока я вам не дам команду "GO GO GO".`;
    }

    public getCRGO() {
        return `${
            this.state.nick
        } GO GO GO! 1 – Войдите в ОТКРЫТУЮ игру, 2 – установите Маяк на КРЫЛО, 3 – Пригласите в крыло ваших заправщиков ${this.getAssignedRatsQuote()}, 4 – сообщите время на таймере здесь и будьте готовы выйти, если я скажу.`;
    }

    public getCRVideo() {
        return `${this.state.nick} вот ссылка на небольшое видео о том, как это сделать: ${this.getCRVideoLink()}`;
    }

    public getEta(minutes: number) {
        return `${this.state.nick} ваши заправщики будут у вас примерно через ${minutes} минут(ы), если у вас появится таймер отчёта кислорода сразу же сообщите мне.`;
    }

    public getSCInfo() {
        return `${this.state.nick} похоже вы слишком близко к звёздному телу. Пожалуйста выполните следующее:`;
    }

    public getSCEnter() {
        return `${this.state.nick} чтобы войти в гиперкруиз откройте левое меню, вкладка Навигация и выберите основную звезду в вашей текущей системе (первая в списке). затем нажмите кнопку прыжка.`;
    }

    public getSCLeave() {
        return `${this.state.nick} чтобы выйти из гиперкруиза сбросьте скорость до 30 км/с, откройте левое меню, вкладка Навигация и выберите основную звезду в вашей текущей системе (первая в списке). затем нажмите кнопку прыжка.`;
    }

    public getDBChannel() {
        return `${this.state.nick} для советов и информации по топливу на русском языке, пожалуйста, наберите в этом чате /join #debrief. Слева от чата откроется новая вкладка, переключитесь на неё.`;
    }

    public getFailure() {
        return `${this.state.nick} мне очень жаль, что у нас не вышло вам помочь. Пожалуйста оставайтесь в крыле для советов как избежать этого в будущем.`;
    }
}
