import { EventDispatcher } from "../../core/event.dispatcher";
import Utils from "../../core/utils";
import Demo1 from "./demo1";
import Demo2 from "./demo2";
import Demo3 from "./demo3";

export class Demo {
    public static actors = {
        RatMama: "RatMama[BOT]",
        Mecha: "MechaSqueak[BOT]",

        // spatch
        spatch1: "RealisticBull",

        // rats
        rat1: "MatureSeal",
        rat2: "UpsetZebra",
        rat3: "CloudyParakeet",
        rat4: "PastPeccary",
        rat5: "RomanticLizard",
        rat6: "MagentaSalamander",
        rat7: "FlutteringStarfish",
        rat8: "RoundBoar",
        rat9: "OrdinaryBuffalo",
        rat10: "TerribleRat",

        // clients
        client1: "ImaginaryKoala",
        client2: "WigglyFox",
        client3: "SulkyHog",
        client4: "FearfulMouse",

        // cases
        case1: {
            id: "1",
            system: "",
            language: "",
            platform: "",
        },
        case2: "7",
        case3: "4",
        case4: "9",
    };

    public static async begin() {
        EventDispatcher.listen("pause", (delay: number) => {
            return new Promise((resolve) => {
                setTimeout(resolve, delay);
            });
        });

        for (const { event, data } of [...Demo1.data, ...Demo2.data, ...Demo3.data] as any) {
            switch (event) {
                case "message":
                    await Utils.sendMessage(data.user, data.message);
                    break;

                case "pause":
                    await EventDispatcher.dispatch("pause", null, data);
                    break;

                case "disconnect":
                    await EventDispatcher.dispatch("case.disconnect", null, {
                        raw: {
                            user: data,
                        },
                    });
                    break;

                case "reconnect":
                    await EventDispatcher.dispatch("case.connect", null, {
                        raw: {
                            user: data,
                        },
                    });
                    break;

                case "break":
                    return;
            }
            await EventDispatcher.dispatch("pause", null, 10);
        }
    }

    private static script1: { event: string; data: any }[] = [
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.RatMama,
        //         message: `Incoming Client: ${Demo.actors.client2} - System: 78 lota - Platform: PS4 - O2: OK - Language: English (ru-RU)`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.Mecha,
        //         message: `RATSIGNAL - CMDR ${Demo.actors.client2} - Reported System: CRUCIS SECTOR SO-R A4-0 (33 LY from Fuelum) - Platform: PS4 - O2: OK Language: Russian (ru) (Case #7) (PS_SIGNAL)`,
        //     },
        // },
        // { event: "pause", data: 2000 },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.Mecha,
        //         message: `RATSIGNAL - CMDR ${Demo.actors.client3} - Reported System: CRUCIS SECTOR SO-R A4-0 (33 LY from Fuelum) - Platform: PC - O2: OK Language: Spanish (Spain) (es) (Case #5) (PC_SIGNAL)`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.RatMama,
        //         message: `Incoming Client: ${Demo.actors.client3} - System: PEGASI SECTOR MV-A A15-2 - Platform: PC - O2: OK - Language: English (es-ES)`,
        //     },
        // },
        // { event: "pause", data: 2000 },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.RatMama,
        //         message: `Incoming Client: ${Demo.actors.client4} - System: COL SECTOR SV-T A5-1 - Platform: XB - O2: NOT OK - Language: English (en-GB)`,
        //     },
        // },
        // {
        //     event: "message",
        //     data: {
        //         user: Demo.actors.Mecha,
        //         message: `RATSIGNAL - CMDR ${Demo.actors.client4} - Reported System: CRUCIS SECTOR SO-R A4-0 (33 LY from Fuelum) - Platform: XB - O2: OK Language: English (United Kingdom) (en-GB) (Case #3) (XB_SIGNAL)`,
        //     },
        // },
    ];
}
