import { EventDispatcher } from "../core/event.dispatcher";
import { NewCase, Callout } from "../core/log.parser";
import Utils from "../core/utils";
export default class CaseStats {
    private static MAX_POOL = 10;
    private static stats: Stats = {
        cases: [], // Make this only hold the last case, last pc/ps/ps4, last lang etc
    };
    public static board: Board = {
        counter: CaseStats.MAX_POOL,
        pool: Utils.makeArray(0, CaseStats.MAX_POOL),
        indices: {},
        collect: true,
    };

    public static init() {
        window.CaseStats = CaseStats;
        EventDispatcher.listen("callout.newcase", CaseStats.newCase);
        EventDispatcher.listen("case.closed", CaseStats.caseClosed);
    }

    public static async newCase(newcaseData: NewCase) {
        const now = new Date().getTime();
        const caseStat = {
            stamp: now,
            ...newcaseData,
        };
        CaseStats.stats.cases.push(caseStat);
        CaseStats.board.indices[newcaseData.id.toString()] = caseStat;
        const board = CaseStats.board;
        if (board.pool.indexOf(newcaseData.id) > -1) {
            board.pool.splice(board.pool.indexOf(newcaseData.id), 1);
            // console.log(`Created case ${newcaseData.id}`, board.pool);
        }
    }

    public static async caseClosed(data: Callout) {
        const board = CaseStats.board;
        if (board.indices[data.id.toString()]) {
            if (data.id > board.counter) {
                board.counter = data.id + 1;
            }
            if (Object.keys(board.indices).length === 0) {
                board.counter = CaseStats.MAX_POOL;
            }
            if (board.collect && data.id < CaseStats.MAX_POOL) {
                const index = board.pool.findIndex((x) => x === data.id);
                if (index > -1) {
                    board.pool.splice(index, 1);
                }
                board.pool.push(data.id);
            }
            delete board.indices[data.id.toString()];
            // console.log(`Closed case ${data.id}`, board.pool);
        } else {
            // console.warn(`case ${data.id} not on board`);
        }
        // console.log(CaseStats.guessNextCaseId());
    }

    public static getLast(lastStamp?: number) {
        if (!lastStamp) {
            let caseData = CaseStats.stats.cases[CaseStats.stats.cases.length - 1];
            if (!caseData) return "";
            lastStamp = caseData.stamp;
        }
        const now = new Date().getTime();
        return Utils.toHHMMSS(Math.floor((now - lastStamp) / 1000));
    }

    public static getLastBy(predicate: any) {
        const caseData = CaseStats.stats.cases.reverse().find(predicate);
        return caseData ? CaseStats.getLast(caseData.stamp) : "no case found";
    }

    public static getLastPlatform(platform: "PC" | "XB" | "PS4") {
        return `Last ${platform} case: ${CaseStats.getLastBy((it: CaseStat) => it.platform === platform)}`;
    }

    public static getLastLanguage(lang: string) {
        return `Last ${lang} case: ${CaseStats.getLastBy(
            (it: CaseStat) => it.lang.substr(0, 2).toUpperCase() === lang.toUpperCase()
        )}`;
    }

    public static getNextAvailableCaseId() {
        return CaseStats.board.pool.length > 0 ? CaseStats.board.pool[0] : CaseStats.board.counter;
    }

    public static guessNextCaseId() {
        return `Next case might be #${CaseStats.getNextAvailableCaseId()}`;
    }
}

interface Stats {
    cases: CaseStat[];
}

interface Board {
    pool: number[];
    counter: number;
    indices: {
        [id: string]: CaseStat;
    };
    collect: boolean;
}

interface CaseStat extends NewCase {
    stamp: number;
}

declare global {
    interface Window {
        CaseStats: any;
    }
}

CaseStats.init();
