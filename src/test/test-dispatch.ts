import { EventDispatcher } from "../core/event.dispatcher";
import Chat from "../components/chat";
import Utils from "../core/utils";
import CaseStats from "./case-stats";

declare global {
    interface Window {
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

    public static async test(
        startN: number = 0,
        cases: number = 3,
        repeat: number = 1,
        latency: number = 100,
        scramble: boolean = false
    ) {
        EventDispatcher.listen("pause", TestDispatch.pauseHandler);
        let testData: any[] = [];
        for (let i = 0; i < repeat; i++) {
            testData = [...testData, ...TestDispatch.getTestData(startN, cases, scramble)];
        }
        await EventDispatcher.queuePromises(
            testData.map((t: any) => async () => {
                await EventDispatcher.dispatch("pause", null, latency);
                return EventDispatcher.dispatch(t.event, null, t.data);
            }),
            this,
            []
        );
        EventDispatcher.removeListener("pause", TestDispatch.pauseHandler);
    }

    public static async sequencialTest(
        cases: number = 3,
        concurrent: number = 1,
        pool: number[] = Utils.makeArray(0, cases),
        latency: number = 100
    ) {
        EventDispatcher.listen("pause", TestDispatch.pauseHandler);
        CaseStats.board.pool = pool;
        for (let i = 0; i < cases; i++) {
            let testData: any[] = [];
            for (let j = 0; j <= concurrent; j++) {
                const caseId = CaseStats.getNextAvailableCaseId();
                testData = [
                    ...testData,
                    TestDispatch.randomCases(caseId, 1).cases[0],
                    ...TestDispatch.caseFlow(caseId),
                ];
                i++;
            }
            await EventDispatcher.queuePromises(
                testData.map((t: any) => async () => {
                    await EventDispatcher.dispatch("pause", null, latency);
                    return EventDispatcher.dispatch(t.event, null, t.data);
                }),
                this,
                []
            );
        }
    }

    private static pauseHandler(length: string): Promise<any> {
        return new Promise((resolve) => {
            setTimeout(resolve, parseInt(length));
        });
    }

    private static getTestData(startN: number, cases: number = 3, scramble: boolean = false) {
        const randomCases = TestDispatch.randomCases(startN, cases);
        let caseFlows: { event: string; data: any }[][] = [];
        for (let i = 0; i < cases; i++) {
            caseFlows[i] = [randomCases.cases[i], ...TestDispatch.caseFlow(i + randomCases.startN)];
        }
        if (!scramble) return caseFlows.flat();
        const scrambled: { event: string; data: any }[] = [];
        let stillPicking = true;
        while (stillPicking) {
            const validLists = caseFlows.filter((l) => l.length > 0);
            const listIndex = Math.floor(Math.random() * validLists.length);
            const pickSize = Math.min(
                Math.floor(Math.random() * validLists[listIndex].length) + 1,
                validLists[listIndex].length
            );
            for (let i = 0; i < pickSize; i++) {
                const val = validLists[listIndex].shift();
                if (val) scrambled.push(val);
            }
            stillPicking = caseFlows.filter((l) => l.length > 0).length > 0;
        }
        return scrambled;
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
            events.push(Utils.makeMessageEvent(user, message));
        }
        return events;
    }

    private static generateMessages(size: number) {
        const events: Array<{ event: string; data: any }> = [];
        for (let i = 0; i < size; i++) {
            const user = "The quick brown fox jumps over the lazy dog 0123456789 " + i;
            events.push(Utils.makeMessageEvent(user, "#69 " + Chat.getNickColour(user)));
        }
        return events;
    }

    public static sendMessage(from: string, message: string) {
        return Utils.sendMessage(from, message);
    }

    private static randomCases(
        startN: number,
        size: number
    ): { cases: Array<{ event: string; data: any }>; startN: number } {
        const cases: Array<{ event: string; data: any }> = [];

        for (let i = startN; i < size + startN; i++) {
            cases.push(
                Utils.makeMessageEvent(
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

window.TestDispatch = TestDispatch;
