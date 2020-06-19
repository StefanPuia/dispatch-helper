export default class Utils {
    public static getUniqueKey(prefix: string = "x") {
        return `${prefix}-${new Date().getTime()}-${Math.random() * 1000}`.replace(/\./, "");
    }

    public static getVisibilityChangeByBrowser() {
        let hidden = null;
        let visibilityChange = null;
        if (typeof document.hidden !== "undefined") {
            // Opera 12.10 and Firefox 18 and later support
            hidden = "hidden";
            visibilityChange = "visibilitychange";
        } else if (document.hasOwnProperty("msHidden")) {
            hidden = "msHidden";
            visibilityChange = "msvisibilitychange";
        } else if (document.hasOwnProperty("webkitHidden")) {
            hidden = "webkitHidden";
            visibilityChange = "webkitvisibilitychange";
        }

        return { hidden: hidden, visibilityChange: visibilityChange };
    }
}
