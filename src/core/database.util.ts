import { EventDispatcher } from "./event.dispatcher";
import { EDSMSystem } from "./utils";
export default class DatabaseUtil {
    private static INSTANCE: DatabaseUtil;

    private readonly DB_NAME = "DispatchHelper";
    private readonly VERSION_NUMBER = 1;
    private dbRequest: IDBOpenDBRequest;
    private database: any;

    private constructor(callback: Function) {
        this.dbRequest = indexedDB.open(this.DB_NAME, this.VERSION_NUMBER);
        this.dbRequest.onerror = (event: any) => {
            const err = new Error(event.target.error);
            EventDispatcher.dispatch("error", this, err);
            callback(err);
        };
        this.dbRequest.onupgradeneeded = (event: any) => {
            this.database = event.target.result;
            this.makeTables();
        };
        this.dbRequest.onsuccess = (event: any) => {
            this.database = event.target.result;
            callback();
        };
    }

    private async makeTables() {
        this.makeEDSMSystemCache();
    }

    private makeEDSMSystemCache() {
        this.database.createObjectStore("edsm_cache", { keyPath: "name" });
    }

    public static async init() {
        await this.getInstance();
    }

    private static getInstance(): Promise<DatabaseUtil> {
        return new Promise((resolve, reject) => {
            if (!this.INSTANCE) {
                this.INSTANCE = new DatabaseUtil((err: any, db: any) => {
                    if (err) reject(err);
                    else resolve(db);
                });
            } else {
                resolve(this.INSTANCE);
            }
        });
    }

    public static async storeEDSMSystem(system: EDSMSystem) {
        return new Promise(async (resolve, reject) => {
            system.name = system.name.toUpperCase();
            const existing = await this.getEDSMSystem(system.name);
            if (!existing) {
                const transaction = (await this.getInstance()).database.transaction(["edsm_cache"], "readwrite");
                transaction.onerror = reject;
                transaction.oncomplete = resolve;
                transaction.objectStore("edsm_cache").add(system);
            } else {
                resolve();
            }
        });
    }

    public static async getEDSMSystem(systemName: string) {
        return new Promise(async (resolve, reject) => {
            (await this.getInstance()).database
                .transaction("edsm_cache")
                .objectStore("edsm_cache")
                .get(systemName.toUpperCase()).onsuccess = (event: any) => {
                resolve(event.target.result);
            };
        });
    }
}
