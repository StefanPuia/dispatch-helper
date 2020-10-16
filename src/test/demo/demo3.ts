export default class Demo3 {
    private static actors = {
        RatMama: "RatMama[BOT]",
        Mecha: "MechaSqueak[BOT]",

        // spatch
        spatch: "RealisticBull",

        // rats
        rat1: "OrdinaryBuffalo",

        // clients
        client: "RoundBoar",
    };

    private static case = {
        system: "Sol",
        platform: "PC",
        oxygen: "NOT OK",
        locale: "en-US",
        id: "5",
    };

    public static data = [
        {
            event: "message",
            data: {
                user: Demo3.actors.RatMama,
                message:
                    `Incoming Client: ${Demo3.actors.client} - ` +
                    `System: ${Demo3.case.system} - Platform: ${Demo3.case.platform} - ` +
                    `O2: ${Demo3.case.oxygen} - Language: English (${Demo3.case.locale})`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo3.actors.Mecha,
                message:
                    `RATSIGNAL - CMDR ${Demo3.actors.client} - ` +
                    `Reported System: ${Demo3.case.system} (33 LY from Fuelum) - ` +
                    `Platform: ${Demo3.case.platform} - O2: ${Demo3.case.oxygen} ` +
                    `Language: English (United States) (${Demo3.case.locale}) ` +
                    `(Case #${Demo3.case.id}) (PC_SIGNAL)`,
            },
        },
        { event: "pause", data: 1000 },
        { event: "message", data: { user: Demo3.actors.spatch, message: `!pcquit ${Demo3.actors.client}` } },

        {
            event: "message",
            data: {
                user: Demo3.actors.Mecha,
                message: `${Demo3.actors.client} Please log out of the game immediately by pressing ESC and selecting Exit followed by Exit to Main Menu!`,
            },
        },
        { event: "message", data: { user: Demo3.actors.rat1, message: `${Demo3.case.id} 2j` } },
        {
            event: "disconnect",
            data: Demo3.actors.client,
        },
        {
            event: "reconnect",
            data: Demo3.actors.client,
        },
        {
            event: "disconnect",
            data: Demo3.actors.client,
        },
        {
            event: "message",
            data: {
                user: Demo3.actors.spatch,
                message: `!inject ${Demo3.case.id} client bouncing a lot`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo3.actors.Mecha,
                message: `Updated case #${Demo3.case.id} with "client bouncing a lot".`,
            },
        },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo3.actors.spatch,
        //         message: `!md ${Demo3.case.id} client did not return`,
        //     },
        // },
    ];
}
