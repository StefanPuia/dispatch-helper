export default class Utils {
    public static getUniqueKey(prefix: string = "x") {
        return `${prefix}-${new Date().getTime()}-${Math.random() * 1000}`.replace(/\./, "");
    }
}
