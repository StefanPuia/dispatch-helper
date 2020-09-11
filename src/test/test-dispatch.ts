import { EventDispatcher } from "../core/event.dispatcher";
import Chat from "../components/chat";
import sha256 from "sha256";

declare global {
    interface Window {
        dispatch: {
            dispatchEvent: any;
            sendMessage: any;
        };
        TestDispatch: any;
    }
}

export default class TestDispatch {
    private static systems = ["CORE SYS SECTOR XJ-R A4-0", "Dromi", "Matet", "Rodentia", "Fuelum", "Sol"];
    private static distance = [
        "25.14 LY from Sol",
        "58.36 LY from Fuelum",
        "1442.14 LY from Sagittarius A*",
        "not in Fuelrats System Database",
    ];
    private static platform = ["PC", "XB", "PS4"];
    private static o2 = ["OK", "NOT OK"];
    private static language = [
        "English (en-GB)",
        "German (de-DE)",
        "Russian (ru-RU)",
        "French (fr-FR)",
        "Polish (pl-PL)",
        "Spanish (es-ES)",
        "Romanian (ro-RO)",
        "Italian (it-IT)",
        "Hungarian (hu-HU)",
    ];

    public static async test(latency: number = 100) {
        window.TestDispatch = TestDispatch;
        window.dispatch = {
            dispatchEvent: (message: string) => {
                return EventDispatcher.dispatch("irc.message", null, {
                    user: "Steph",
                    text: message,
                    time: new Date(),
                    type: "message",
                    uid: Math.random(),
                });
            },
            sendMessage: this.sendMessage,
        };
        EventDispatcher.listen("pause", TestDispatch.pauseHandler);
        await EventDispatcher.queuePromises(
            TestDispatch.getTestData().map((t: any) => async () => {
                await EventDispatcher.dispatch("pause", null, latency);
                return EventDispatcher.dispatch(t.event, null, t.data);
            }),
            this,
            []
        );
        EventDispatcher.removeListener("pause", TestDispatch.pauseHandler);
    }

    private static pauseHandler(length: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(resolve, parseInt(length));
        });
    }

    private static getTestData() {
        const cases = 3;
        const randomCases = TestDispatch.randomCases(cases);
        let caseFlows: { event: string; data: any }[] = [];
        for (let i = randomCases.startN; i < randomCases.startN + cases; i++) {
            caseFlows = [...caseFlows, ...TestDispatch.caseFlow(i) /*.slice(0, Math.floor(Math.random() * 18))*/];
        }
        return [...randomCases.cases, ...caseFlows];
        // return [];
    }

    private static caseFlow(id: number) {
        const events: Array<{ event: string; data: any }> = [];
        const rat1 = `Rat_${id}_1`;
        const rat2 = `Rat_${id}_2`;
        const rat3 = `Rat_${id}_3`;
        const flow: Array<[string, string]> = [
            [`steph`, `!prep test_${id}`],
            [rat1, `#${id} 2j`],
            [rat2, `#${id} 2j`],
            [rat3, `#${id} 2j`],
            TestDispatch.pickOne([
                [`steph`, `!pc ${id}`],
                [`steph`, `!xb ${id}`],
                [`steph`, `!ps ${id}`],
            ]),
            [`steph`, `!go ${id} ${rat1} ${rat2}`],
            [`steph`, `!pcfr test_${id}`],
            [rat1, `#${id} fr+ in solo`],
            [rat1, `#${id} in open`],
            [rat2, `#${id} fr+`],
            TestDispatch.pickOne([
                [rat3, `#${id} stdn`],
                [`steph`, `${rat3} please stdn`],
            ]),
            [`steph`, `!pcwing test_${id}`],
            [rat1, `#${id} wr+`],
            [rat2, `#${id} wr+`],
            [`steph`, `!pcbeacon test_${id}`],
            [rat1, `#${id} bc+`],
            [rat2, `#${id} bc+`],
            TestDispatch.pickOne([
                [rat1, `#${id} fuel+`],
                [rat2, `#${id} fuel+`],
            ]),
            [`steph`, `!close ${id} ${rat2}`],
        ];
        for (const [user, message] of flow) {
            events.push(this.makeMessageEvent(user, message));
        }
        return events;
    }

    private static generateMessages(size: number) {
        const events: Array<{ event: string; data: any }> = [];
        for (let i = 0; i < size; i++) {
            const user = "The quick brown fox jumps over the lazy dog 0123456789 " + i;
            events.push(this.makeMessageEvent(user, "#69 " + Chat.getNickColour(user)));
        }
        return events;
    }

    public static makeMessageEvent(from: string, message: string) {
        return {
            event: "irc.message",
            data: {
                user: from,
                text: message,
                time: new Date(),
                type: "message",
                uid: sha256(`${message}${new Date().getTime()}${Math.random()}`),
            },
        };
    }

    public static sendMessage(from: string, message: string) {
        const t = this.makeMessageEvent(from, message);
        EventDispatcher.dispatch(t.event, null, t.data);
    }

    private static randomCases(size: number): { cases: Array<{ event: string; data: any }>; startN: number } {
        const cases: Array<{ event: string; data: any }> = [];
        const startN = Math.floor(Math.random() * 200) + 100;

        for (let i = startN; i < size + startN; i++) {
            cases.push(
                this.makeMessageEvent(
                    "MechaSqueak[BOT]",
                    `RATSIGNAL - CMDR test_${i}` +
                        ` - Reported System: ${TestDispatch.pickOne(TestDispatch.systems)} (${TestDispatch.pickOne(
                            TestDispatch.distance
                        )})` +
                        ` - Platform: ${TestDispatch.pickOne(TestDispatch.platform)} - O2: ${TestDispatch.pickOne(
                            TestDispatch.o2
                        )}` +
                        ` - Language: ${TestDispatch.pickOne(TestDispatch.language)} (Case #${i}) (Y_SIGNAL)`
                )
            );
        }

        return {
            cases,
            startN,
        };
    }

    private static pickOne<T>(list: Array<T>): T {
        return list[Math.floor(Math.random() * list.length)];
    }
}
