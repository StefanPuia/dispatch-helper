/* eslint-disable no-cond-assign */
import { EventDispatcher } from "./event.dispatcher";
import CaseController from "../components/case.controller";

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
        fuel: /(?:#|case)?\s*(?<case>\d+).*?(?:fuel|fl)\s*(?<status>\+|-)/i,
        fuelRev: /(?:fuel|fl)\s*(?<status>\+|-).*?(?:#|case)?\s*(?<case>\d+)/i,
        ratsignal: new RegExp(
            "RATSIGNAL - CMDR (?<client>.+?) - Reported System: (?<system>.+) " +
                "\\((?:(?:\\d+\\.\\d+ LY from .+?)|(?<sysconf>(?:not in Fuelrats System Database)|(?:too short to verify)))\\) - " +
                "Platform: (?<platform>\\w+) - O2: (?<oxygen>OK|NOT OK) - Language: .+? \\((?<lang>.+?)\\)\\s+" +
                "(?:- IRC Nickname: (?<nick>.+?))?\\(Case #(?<case>\\d+)\\) .+",
            "i"
        ),
        closed: /^!(?:close|clear)\s+(?:(?<case>\d+)|(?<client>\S+))(?:\s+(?<rat>.+))?/i,
        assign: /^!(?:go|assign|add)\s+(?:(?<case>\d+)|(?<client>\S+))\s+(?<rats>.+)/i,
        unassign: /^!(?:unassign|deassign|remove|rm|standdown)\s+(?:(?<case>\d+)|(?<client>\S+))\s+(?<rats>.+)/i,
        active: /^!(?:active|activate|inactive|deactivate)\s+(?:(?<case>\d+)|(?<client>\S+))/i,
        md: /^!md\s+(?:(?<case>\d+)|(?<client>\S+))\s+.+/i,
        cr: /^!(?:cr|codered|casered)\s+(?:(?<case>\d+)|(?<client>\S+))/i,
        sysconf: /#?(?<case>\d+).*?(?:(?:sysconf)|(?:sys conf)|(?:system confirmed))/i,
        sysconfRev: /(?:sysconf|system confirmed).*?#?(?<case>\d+)/i,
        sys: /^!(?:sys|system|loc|location)\s+(?:(?<case>\d+)|(?<client>\S+))\s+(?<system>.+)/i,
        intelliGrab: /(?:#|case)\s*(?<case>\d+)/i,
        // eslint-disable-next-line no-control-regex
        ircAction: /^\x01ACTION (.+)\x01$/,

        nick: /^!(?:nick|nickname|ircnick)\s+(?:(?<case>\d+)|(?<client>\S+))\s+(?<newnick>.+)/i,
    };

    private constructor() {
        this.parseIrcMessage = this.parseIrcMessage.bind(this);
        this.handleIncoming = this.handleIncoming.bind(this);

        EventDispatcher.listen("irc.incoming", this.handleIncoming);
        EventDispatcher.listen("irc.message", this.parseIrcMessage);
    }

    private async handleIncoming(raw: IncomingLog) {
        const { command, nick, args, uid } = raw;
        const message: Log = {
            uid: uid,
            time: new Date(),
            type: command === "PRIVMSG" ? "message" : "event",
            user: nick || "_",
            text: "",
            channel: command === "PRIVMSG" ? args[0] : undefined,
        };

        const baseMessage: BaseMessage = {
            uid: uid,
            raw: message,
            id: -1,
            time: message.time,
        };

        switch (command) {
            case "JOIN":
                message.text = "has connected.";
                EventDispatcher.dispatch(`case.connect`, this, {
                    ...baseMessage,
                    nick: nick,
                });
                break;

            case "PART":
            case "QUIT":
                message.text = "has disconnected.";
                EventDispatcher.dispatch(`case.disconnect`, this, {
                    ...baseMessage,
                    nick: nick,
                });
                break;

            case "NICK":
                message.text = `is now known as ${args[0]}`;
                EventDispatcher.dispatch(`nickchange`, this, {
                    ...baseMessage,
                    nick: args[0],
                });
                break;

            case "PRIVMSG":
                message.text = args[1] || "";
                const isAction = message.text.match(LogParser.REGEX.ircAction);
                if (isAction) {
                    message.type = "event";
                    message.text = isAction[1] || "";
                }
                EventDispatcher.dispatch("irc.message", this, message);
                break;

            default:
                return;
        }
    }

    private async parseIrcMessage(message: Log) {
        const baseMessage: BaseMessage = {
            uid: message.uid,
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
                id: this.caseNickId(m.case, m.client),
            } as Callout);
        });

        this.onMatch(message, "assign", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.assign`, this, {
                ...baseMessage,
                id: this.caseNickId(m.case, m.client),
                rats: m.rats.split(/\s+/),
            } as CaseAssign);
        });

        this.onMatch(message, "unassign", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.unassign`, this, {
                ...baseMessage,
                id: this.caseNickId(m.case, m.client),
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
                id: this.caseNickId(m.case, m.client),
            } as BaseMessage);
        });

        this.onMatch(message, "md", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.md`, this, {
                ...baseMessage,
                id: this.caseNickId(m.case, m.client),
            } as BaseMessage);
        });

        this.onMatch(message, "cr", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`case.cr`, this, {
                ...baseMessage,
                id: this.caseNickId(m.case, m.client),
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
                id: this.caseNickId(m.case, m.client),
                sys: m.system,
            } as BaseMessage);
        });

        // if (message.user === "MechaSqueak[BOT]") {
        this.onMatch(message, "ratsignal", (m) => {
            parsed = true;
            EventDispatcher.dispatch(`callout.newcase`, this, {
                ...baseMessage,
                id: parseInt(m.case),
                client: m.client,
                system: m.system,
                sysconf: !m.sysconf,
                platform: m.platform,
                cr: m.oxygen === "NOT OK",
                lang: m.lang,
                nick: m.nick || m.client,
            } as NewCase);
        });
        // }

        if (!parsed) {
            this.onMatch(message, "intelliGrab", (m) => {
                parsed = true;
                EventDispatcher.dispatch(`case.intelligrab`, this, {
                    ...baseMessage,
                    id: parseInt(m.case),
                });
            });

            if (!parsed) {
                EventDispatcher.dispatch(`irc.unparsed`, this, message);
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

    private caseNickId(id: string, client?: string): number | undefined {
        return id ? parseInt(id) : CaseController.getCaseNumberForNick(client || "");
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

type IncomingLog = {
    uid: string;
    prefix?: string;
    nick?: string;
    user?: string;
    host?: string;
    server: string;
    rawCommand: string;
    command: string;
    commandType: "normal" | "error" | "reply";
    args: Array<string>;
};

export type Log = {
    uid: string;
    time: Date;
    user: string;
    type: "message" | "event";
    text: string;
    channel?: string;
};

export interface BaseMessage {
    raw: Log;
    id: number;
    time: Date;
    uid: string;
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
