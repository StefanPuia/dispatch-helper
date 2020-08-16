import { EventDispatcher } from "./core/event.dispatcher";
import Chat from "./components/chat";
import sha256 from "sha256";

declare global {
    interface Window {
        dispatch: {
            dispatchEvent: any;
        };
        TestDispatch: any;
    }
}

export default class TestDispatch {
    private static systems = ["CORE SYS SECTOR XJ-R A4-0", "Dormi", "Matet", "Rodetia", "Fuelum", "Sol"];
    private static distance = [
        "25.14 LY from Sol",
        "58.36 LY from Fuelum",
        "1442.14 LY from Sagittarius A*",
        "not in Fuelrats System Database",
    ];
    private static platform = ["PC", "XB", "PS4"];
    private static o2 = ["OK", "NOT OK"];
    private static language = ["English (en-GB)", "German (de-DE)", "Russian (ru-RU)"];

    public static async test() {
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
        };
        EventDispatcher.listen("pause", TestDispatch.pauseHandler);
        await EventDispatcher.queuePromises(
            TestDispatch.getTestData().map((t: any) => async () => {
                await EventDispatcher.dispatch("pause", null, "100");
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
        return [
            ...TestDispatch.randomCases(3),
            ...TestDispatch.caseFlow(0),
            ...TestDispatch.caseFlow(1),
            ...TestDispatch.caseFlow(2),
        ];
        // return [];
    }

    private static caseFlow(id: number) {
        const events: Array<{ event: string; data: any }> = [];
        const flow: Array<[string, string]> = [
            [`steph`, `!prep test_${id}`],
            [`Rat_1`, `#${id} 2j`],
            [`Rat_2`, `#${id} 2j`],
            [`Rat_3`, `#${id} 2j`],
            TestDispatch.pickOne([
                [`steph`, `!pc ${id}`],
                [`steph`, `!xb ${id}`],
                [`steph`, `!ps ${id}`],
            ]),
            [`steph`, `!go ${id} Rat_1 Rat_2`],
            [`steph`, `!pcfr test_${id}`],
            [`Rat_1`, `#${id} fr+ in solo`],
            [`Rat_1`, `#${id} in open`],
            [`Rat_2`, `#${id} fr+`],
            TestDispatch.pickOne([
                [`Rat_3`, `#${id} stdn`],
                [`steph`, `=Rat_3 #${id} stdn`],
            ]),
            [`steph`, `!pcwing test_${id}`],
            [`Rat_1`, `#${id} wr+`],
            [`Rat_2`, `#${id} wr+`],
            [`steph`, `!pcbeacon test_${id}`],
            [`Rat_1`, `#${id} bc+`],
            [`Rat_2`, `#${id} bc+`],
            TestDispatch.pickOne([
                [`Rat_1`, `#${id} fuel+`],
                [`Rat_2`, `#${id} fuel+`],
            ]),
            [`steph`, `!close ${id} Rat_2`],
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

    private static makeMessageEvent(from: string, message: string) {
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

    private static randomCases(size: number): Array<{ event: string; data: any }> {
        const cases: Array<{ event: string; data: any }> = [];

        for (let i = 0; i < size; i++) {
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

        return cases;
    }

    private static pickOne<T>(list: Array<T>): T {
        return list[Math.floor(Math.random() * list.length)];
    }
}
