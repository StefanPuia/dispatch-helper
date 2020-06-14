/* eslint-disable no-cond-assign */
import { EventDispatcher } from "./event.dispatcher";

export default class LogParser {
    private static INSTANCE: LogParser;
    private static REGEX: { [p: string]: RegExp } = {
        jumps: /(?:#|case)?\s*(?<case>\d+)[^\d]+(?<jumps>\d+)\s*(?:j|jumps)[^\w]*/i,
        jumpsRev: /(?<jumps>\d+)\s*(?:j|jumps)[^\d]+(?:#|case)?\s*(?<case>\d+)/i,
        fr: /(?:#|case)?\s*(?<case>\d+).*?(?:fr|friend)\s*(?<status>\+|-)/i,
        frRev: /(?:fr|friend)\s*(?<status>\+|-).*?(?:#|case)?\s*(?<case>\d+)/i,
        wr: /(?:#|case)?\s*(?<case>\d+).*?(?:wr|wing)\s*(?<status>\+|-)/i,
        wrRev: /(?:wr|wing)\s*(?<status>\+|-).*?(?:#|case)?\s*(?<case>\d+)/i,
        bc: /(?:#|case)?\s*(?<case>\d+).*?(?:bc|wb|beacon)\s*(?<status>\+|-)/i,
        bcRev: /(?:bc|wb|beacon)\s*(?<status>\+|-).*?(?:#|case)?\s*(?<case>\d+)/i,
        stdn: /(?:(?:#|case)?\s*(?<case>\d+).*?)?(?:stnd|stdn|standing down|nvm|nevermind)/i,
        stdnRev: /(?:stnd|stdn|standing down|nvm|nevermind)(?:.*?(?:#|case)?\s*(?<case>\d+))?/i,
        fuel: /(?:#|case)?\s*(?<case>\d+).*?(?:fuel)\s*(?<status>\+|-)/i,
        fuelRev: /(?:fuel)\s*(?<status>\+|-).*?(?:#|case)?\s*(?<case>\d+)/i,
        ratsignal: new RegExp(
            "RATSIGNAL - CMDR (?<client>.+?) - Reported System: (?<system>.+) " +
                "\\((?:(?:\\d+\\.\\d+ LY from \\w+)|(?<sysconf>not in Fuelrats System Database))\\) - " +
                "Platform: (?<platform>\\w+) - O2: (?<oxygen>OK|NOT OK) - Language: .+? \\((?<lang>.+?)\\)\\s+" +
                "(?:- IRC Nickname: (?<nick>.+?))?\\(Case #(?<case>\\d+)\\) .+",
            "i"
        ),
        closed: /!(?:close|clear)\s+(?<case>\d+)(?:\s+(?<rat>.+))?/i,
        disconnect: /has quit \(.+\)/i,
        connect: /\(.+?\) has joined/i,
        assign: /!(?:go|assign)\s+(?<case>\d+)\s+(?<rats>.+)/i,
        unassign: /!unassign\s+(?<case>\d+)\s+(?<rats>.+)/i,
        active: /!(?:in)?active\s+(?<case>\d+)/i,
        md: /!md\s+(?<case>\d+)\s+.+/i,
        cr: /!cr\s+(?<case>\d+)/i,
        sysconf: /#?(?<case>\d+).*?(?:sysconf|system confirmed)/i,
        sysconfRev: /(?:sysconf|system confirmed).*?#?(?<case>\d+)/i,
        sys: /!sys\s+(?<case>\d+)\s+(?<system>.+)/i,
        grab: /(?:#|case)\s*(?<case>\d+)/i,
        nickChange: /is now known as (?<newnick>.+)/i,
    };

    private constructor() {
        this.handleHexChat = this.handleHexChat.bind(this);

        EventDispatcher.listen("fuelrats", this.parseLog);
        EventDispatcher.listen("hexchat", this.handleHexChat);
    }

    private async parseLog(_line: string) {
        const line = (_line || "").trim();
        if (!line) return;
        const match = line.match(/^(\d+-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\s(\*\s)?<?(\S+?)>?\s(.+)$/);
        if (!match) {
            EventDispatcher.dispatch("error.parse", this, line);
        } else {
            const message: Log = {
                time: new Date(match[1]),
                type: match[2] ? "event" : "message",
                user: match[3],
                text: match[4],
            };
            EventDispatcher.dispatch("hexchat", this, message);
        }
    }

    private async handleHexChat(message: Log) {
        const baseMessage: BaseMessage = {
            raw: message,
            time: message.time,
            id: -1,
        };
        const callout: Callout = {
            ...baseMessage,
            rat: message.user,
        };
        let parsed = false;

        this.onMatch(message, ["jumps", "jumpsRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch("callout.jumps", this, {
                ...callout,
                id: parseInt(m.case),
                jumps: parseInt(m.jumps),
            } as CalloutJumps);
        });

        this.onMatch(message, ["fr", "frRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.fr${m.status}`, this, {
                ...callout,
                id: parseInt(m.case),
            } as CalloutFR);
        });

        this.onMatch(message, ["wr", "wrRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.wr${m.status}`, this, {
                ...callout,
                id: parseInt(m.case),
            } as CalloutWR);
        });

        this.onMatch(message, ["bc", "bcRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.bc${m.status}`, this, {
                ...callout,
                id: parseInt(m.case),
            } as CalloutBC);
        });

        this.onMatch(message, ["fuel", "fuelRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.fuel${m.status}`, this, {
                ...callout,
                id: parseInt(m.case),
            } as CalloutFuel);
        });

        this.onMatch(message, "closed", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.closed`, this, {
                ...callout,
                rat: m.rat,
                id: parseInt(m.case),
            } as BaseMessage);
        });

        this.onMatch(message, "connect", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.connect`, this, {
                ...baseMessage,
            } as BaseMessage);
        });

        this.onMatch(message, "disconnect", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.disconnect`, this, {
                ...baseMessage,
            } as BaseMessage);
        });

        this.onMatch(message, "assign", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.assign`, this, {
                ...baseMessage,
                id: parseInt(m.case),
                rats: m.rats.split(/\s+/),
            } as CaseAssign);
        });

        this.onMatch(message, "unassign", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.unassign`, this, {
                ...baseMessage,
                id: parseInt(m.case),
                rats: m.rats.split(/\s+/),
            } as CaseAssign);
        });

        this.onMatch(message, ["stdn", "stdnRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.stdn`, this, {
                ...baseMessage,
                rat: message.user,
                id: m.case ? parseInt(m.case) : undefined,
            } as Callout);
        });

        this.onMatch(message, "active", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.active`, this, {
                ...baseMessage,
                id: parseInt(m.case),
            } as BaseMessage);
        });

        this.onMatch(message, "md", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.md`, this, {
                ...baseMessage,
                id: parseInt(m.case),
            } as BaseMessage);
        });

        this.onMatch(message, "cr", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.cr`, this, {
                ...baseMessage,
                id: parseInt(m.case),
            } as BaseMessage);
        });

        this.onMatch(message, ["sysconf", "sysconfRev"], (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.sysconf`, this, {
                ...baseMessage,
                id: parseInt(m.case),
            } as Callout);
        });

        this.onMatch(message, "sys", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.sys`, this, {
                ...baseMessage,
                id: parseInt(m.case),
                sys: m.system,
            } as BaseMessage);
        });

        this.onMatch(message, "nickchange", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`nickchange`, this, {
                ...baseMessage,
                nick: m.newnick,
            });
        });

        if (message.user === "MechaSqueak[BOT]") {
            this.onMatch(message, "ratsignal", (m) => {
                parsed = true;
                EventDispatcher.dispatch(`callout.newcase`, this, {
                    ...baseMessage,
                    id: parseInt(m.case),
                    client: m.client,
                    system: m.system,
                    sysconf: m.sysconf !== "not in Fuelrats System Database",
                    platform: m.platform,
                    cr: m.oxygen === "NOT OK",
                    lang: m.lang,
                    nick: m.nick || m.client,
                } as NewCase);
            });
        }

        if (!parsed) {
            this.onMatch(message, "grab", (m) => {
                parsed = true;
                EventDispatcher.dispatch(`case.grab`, this, {
                    ...baseMessage,
                    id: parseInt(m.case),
                });
            });

            if (!parsed) {
                EventDispatcher.dispatch(`hexchat.unparsed`, this, message);
            }
        }
    }

    private onMatch(message: Log, patterns: string, callback: MatchCallback): void;
    private onMatch(message: Log, patterns: Array<string>, callback: MatchCallback): void;
    private onMatch(message: Log, patterns: Array<string> | string, callback: Function) {
        if (!(patterns instanceof Array)) {
            patterns = [patterns];
        }
        let match: RegExpExecArray | null = null;
        for (const pattern of patterns.map((p: any) => LogParser.REGEX[p] as RegExp)) {
            if (!pattern) continue;
            match = pattern.exec(message.text);
            if (match) {
                const groups: any = {};
                for (const k in match.groups) {
                    groups[k] = match.groups[k]?.trim();
                }
                return callback(groups);
            }
        }
    }

    private static getInstance() {
        if (!LogParser.INSTANCE) {
            LogParser.INSTANCE = new LogParser();
        }
        return LogParser.INSTANCE;
    }

    public static init() {
        LogParser.getInstance();
    }
}

type MatchCallback = ((match: { [k: string]: any }) => void) | (() => void);

export type Log = {
    time: Date;
    user: string;
    type: "message" | "event";
    text: string;
};

export interface BaseMessage {
    raw: Log;
    id: number;
    time: Date;
}

export interface NewCase extends BaseMessage {
    client: string;
    system: string;
    sysconf: boolean;
    platform: "PC" | "XB" | "PS";
    cr: boolean;
    lang: string;
    nick: string;
}

export interface Callout extends BaseMessage {
    rat: string;
}

export interface CalloutJumps extends Callout {
    jumps: number;
}

export interface CalloutFR extends Callout {}
export interface CalloutWR extends Callout {}
export interface CalloutBC extends Callout {}
export interface CalloutFuel extends Callout {}
export interface CaseAssign extends BaseMessage {
    rats: Array<string>;
}
export interface NickChange extends BaseMessage {
    nick: string;
}
