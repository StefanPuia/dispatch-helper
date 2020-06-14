import sha256 from "sha256";

export class EventDispatcher {
    private static INSTANCE: EventDispatcher;
    private readonly events: EventStorage = {};

    private constructor() {}

    private static getInstance() {
        if (!EventDispatcher.INSTANCE) {
            EventDispatcher.INSTANCE = new EventDispatcher();
        }
        return EventDispatcher.INSTANCE;
    }

    private listen(event: string, handler: EventHandler, priority: number = 1) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push({
            priority: priority,
            handler: handler,
        });
    }

    private removeListener(event: string, handler?: EventHandler) {
        if (this.events[event]) {
            if (handler) {
                this.events[event] = this.events[event].filter((handle) => {
                    return handle.handler !== handler;
                });
            } else {
                this.events[event].splice(0);
            }
        }
    }

    private handlerSort(event: string): Array<EventHandler> {
        if (!this.events[event]) {
            return [];
        }
        return this.events[event]
            .sort((a, b) => {
                return a.priority - b.priority;
            })
            .map((ev) => ev.handler);
    }

    private async dispatch(event: string, origin: any, data: any): Promise<string> {
        const hash = sha256(event + new Date().getTime() + Math.random());
        await EventDispatcher.queuePromises(this.handlerSort(event), origin, data);
        return hash;
    }

    public static async dispatch(event: string, origin: any, data: any) {
        // const moduleName = (origin && origin.constructor && origin.constructor.name) || "unknown";
        // console.log(`Dispatching '${event}' from '${moduleName}'`);
        // console.log(event, data);
        return await EventDispatcher.getInstance().dispatch(event, origin, data);
    }

    public static listen(event: string, handler: EventHandler): void;
    public static listen(event: string, handler: EventHandler, priority: number): void;
    public static listen(event: string, handler: EventHandler, priority?: number) {
        EventDispatcher.getInstance().listen(event, handler, priority);
    }

    public static removeListener(event: string): void;
    public static removeListener(event: string, handler: EventHandler): void;
    public static removeListener(event: string, handler?: EventHandler) {
        EventDispatcher.getInstance().removeListener(event, handler);
    }

    public static queuePromises(functions: Array<Function>, thisArg: any, args: any) {
        return new Promise((resolve, reject) => {
            let promiseFactories: Array<Function> = [];
            let results: Array<any> = [];

            for (let i = 0; i < functions.length; i++) {
                promiseFactories.push(() => {
                    return new Promise((resolve, reject) => {
                        functions[i]
                            .call(thisArg, args)
                            .then((r: any) => {
                                results.push(r);
                                resolve();
                            })
                            .catch(reject);
                    });
                });
            }

            let loop = () => {
                return new Promise((resolve, reject) => {
                    let current = promiseFactories.shift();
                    if (current) {
                        current()
                            .then(() => {
                                loop().then(resolve).catch(reject);
                            })
                            .catch(reject);
                    } else {
                        resolve();
                    }
                });
            };
            loop()
                .then(() => {
                    resolve(results);
                })
                .catch(reject);
        });
    }
}

export type EventHandler = (data: any) => Promise<void>;
type EventStorage = {
    [event: string]: Array<{
        priority: number;
        handler: EventHandler;
    }>;
};
