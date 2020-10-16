export default class Demo1 {
    private static actors = {
        RatMama: "RatMama[BOT]",
        Mecha: "MechaSqueak[BOT]",

        // spatch
        spatch: "RealisticBull",

        // rats
        rat1: "MatureSeal",
        rat2: "UpsetZebra",
        rat3: "CloudyParakeet",

        // clients
        client: "ImaginaryKoala",
    };

    private static case = {
        system: "CRUCIS SECTOR SO-R A4-0",
        platform: "PC",
        oxygen: "OK",
        locale: "en-US",
        id: "1",
    };

    public static data = [
        {
            event: "message",
            data: {
                user: Demo1.actors.RatMama,
                message:
                    `Incoming Client: ${Demo1.actors.client} - ` +
                    `System: ${Demo1.case.system} - Platform: ${Demo1.case.platform} - ` +
                    `O2: ${Demo1.case.oxygen} - Language: English (${Demo1.case.locale})`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.Mecha,
                message:
                    `RATSIGNAL - CMDR ${Demo1.actors.client} - ` +
                    `Reported System: ${Demo1.case.system} (33 LY from Fuelum) - ` +
                    `Platform: ${Demo1.case.platform} - O2: ${Demo1.case.oxygen} ` +
                    `Language: English (United States) (${Demo1.case.locale}) ` +
                    `(Case #${Demo1.case.id}) (PC_SIGNAL)`,
            },
        },
        { event: "pause", data: 1000 },
        {
            event: "message",
            data: {
                user: Demo1.actors.spatch,
                message: `!prep ${Demo1.actors.client}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.Mecha,
                message: `${Demo1.actors.client}: Please exit supercruise and come to a stop. Keep Life Support ON, and disable all other modules you can disable (you can't disable them all - instructions available if needed). If an oxygen countdown timer appears at all let us know right away.`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.rat1,
                message: `#${Demo1.case.id} 1j`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.rat2,
                message: `2 jumps case ${Demo1.case.id}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.rat3,
                message: `${Demo1.actors.client} 4j`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.client,
                message: `Modules offline, life support on`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.spatch,
                message: `!go ${Demo1.case.id} ${Demo1.actors.rat1} ${Demo1.actors.rat2}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.Mecha,
                message:
                    `${Demo1.actors.client}: Please add the following rat to your friends list: ` +
                    `"${Demo1.actors.rat1}" "${Demo1.actors.rat2}"`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.rat1,
                message: `#${Demo1.case.id} fr+`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.rat2,
                message: `${Demo1.actors.client} fr+`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.spatch,
                message: `${Demo1.actors.client} now invite your rats to a wing`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.spatch,
                message: `!pcwing ${Demo1.actors.client}`,
            },
        },
        {
            event: "message",
            data: {
                user: Demo1.actors.Mecha,
                message: `${Demo1.actors.client}: To send a wing request, go to the comms panel (Default key 2), hit ESC to get out of the chat box, and move to the third panel (Default key E). Then select your Rat(s) and select Invite to wing`,
            },
        },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.rat1,
        //         message: `#${Demo1.case.id} wr+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.rat2,
        //         message: `${Demo1.actors.client} wing+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.spatch,
        //         message: `${Demo1.actors.client} lastly, enable your wing beacon so your rats can find you in the system`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.spatch,
        //         message: `!pcbeacon ${Demo1.actors.client}`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.Mecha,
        //         message: `${Demo1.actors.client}: To light your wing beacon, go to the right panel (Default key 4), navigate to the SHIP tab (Default key Q), then in the FUNCTIONS sub-screen select BEACON and set it to WING`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.rat1,
        //         message: `#${Demo1.case.id} bc+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.rat2,
        //         message: `${Demo1.actors.client} fule+`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.spatch,
        //         message: `${Demo1.actors.client} you should be receiving fuel now. Please remain with your rats for some quick and helpful tips on fuel management.`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo1.actors.spatch,
        //         message: `!close ${Demo1.case.id} ${Demo1.actors.rat2}`,
        //     },
        // },
    ];
}
