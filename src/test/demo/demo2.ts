export default class Demo2 {
    private static actors = {
        RatMama: "RatMama[BOT]",
        Mecha: "MechaSqueak[BOT]",

        // spatch
        spatch: "RealisticBull",

        // rats
        rat1: "PastPeccary",
        rat2: "RomanticLizard",
        rat3: "MagentaSalamander",

        // clients
        client: "WigglyFox",
    };

    private static case = {
        // Incoming Client: ${Demo.actors.client2} - System: 78 lota - Platform: PS4 - O2: OK - Language: English (ru-RU)
        system: "78 lota",
        platform: "PS4",
        oxygen: "OK",
        locale: "ru-RU",
        id: "7",
    };

    public static data = [
        {
            event: "message",
            data: {
                user: Demo2.actors.RatMama,
                message:
                    `Incoming Client: ${Demo2.actors.client} - ` +
                    `System: ${Demo2.case.system} - Platform: ${Demo2.case.platform} - ` +
                    `O2: ${Demo2.case.oxygen} - Language: English (${Demo2.case.locale})`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.Mecha,
                message:
                    `RATSIGNAL - CMDR ${Demo2.actors.client} - ` +
                    `Reported System: ${Demo2.case.system} (33 LY from Fuelum) - ` +
                    `Platform: ${Demo2.case.platform} - O2: ${Demo2.case.oxygen} ` +
                    `Language: English (United States) (${Demo2.case.locale}) ` +
                    `(Case #${Demo2.case.id}) (PC_SIGNAL)`,
            },
        },
        { event: "pause", data: 1000 },
        { event: "message", data: { user: Demo2.actors.spatch, message: `!prep ${Demo2.actors.client}` } },
        {
            event: "message",
            data: {
                user: Demo2.actors.Mecha,
                message: `${Demo2.actors.client}: Cбросьте скорость до 30км/c, выйдите из межзвезд. круиза, остановитесь и выключите все модули КРОМЕ жизнеобеспечения (если нужно, дадим инструкции). Если в любое время появится отсчёт кислорода, сразу же сообщите нам. `,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat3,
                message: `${Demo2.actors.client} 4j`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat1,
                message: `#${Demo2.case.id} 1j`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat2,
                message: `2j #${Demo2.case.id}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.spatch,
                message: `!go-ru ${Demo2.case.id} ${Demo2.actors.rat1} ${Demo2.actors.rat2}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.Mecha,
                message:
                    `${Demo2.actors.client}: пожалуйста добавьте следующие имена в список друзей ` +
                    `"${Demo2.actors.rat1}" "${Demo2.actors.rat2}"`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat1,
                message: `#${Demo2.case.id} fr+`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat2,
                message: `fr+ #${Demo2.case.id}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.spatch,
                message: `${Demo2.actors.client} теперь добавьте ваших заправщиков в крыло.`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.spatch,
                message: `!pswing-ru ${Demo2.actors.client}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.Mecha,
                message: `${Demo2.actors.client}: Чтобы добавить пилота в крыло, зажмите квадрат и нажмите на стрелочку вверх, перейдите в третью вкладку (клавиша по умолчанию R1), затем выберите имя пилота и нажмите [Добавить в крыло] (Invite to wing)`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo2.actors.rat1,
                message: `#${Demo2.case.id} wr+`,
            },
        },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.rat2,
        //         message: `#${Demo2.case.id} wing+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.spatch,
        //         message: `${Demo2.actors.client} и наконец, включите пожалуйста маяк крыла, чтобы ваши топливные крысы могли найти вас в системе.`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.spatch,
        //         message: `!psbeacon-ru ${Demo2.actors.client}`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.Mecha,
        //         message: `${Demo2.actors.client}: Чтобы зажечь маяк, откройте правую панель (правый нижний угол тачпада). Перейдите во вкладку Корабль (по умолчанию L1/R1), в подменю Функции выберите Маяк (слева-внизу на схеме) и переключите на Крыло.`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.rat1,
        //         message: `#${Demo2.case.id} bc+ 200kls`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.rat2,
        //         message: `#${Demo2.case.id} beacon+ 199,100 ls`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.rat1,
        //         message: `${Demo2.actors.client} fuel+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.spatch,
        //         message: `${Demo2.actors.client} спасибо за ваше обращение к Fuel rats. мы рады, что смогли вам помочь. Вы можете включить ваши борт-системы. Пожалуйста оставайтесь в крыле для полезных советов по топливу.`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo2.actors.spatch,
        //         message: `!close ${Demo2.case.id} ${Demo2.actors.rat2}`,
        //     },
        // },
    ];
}
