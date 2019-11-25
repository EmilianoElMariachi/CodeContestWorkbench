/**
 * Supported console colors.
 * @readonly
 * @enum {string}
 */
const Colors = {
    Reset: "0",
    Bright: "1",
    Dim: "2",
    Underscore: "4",
    Blink: "5",
    Reverse: "7",
    Hidden: "8",

    FgBlack: "30",
    FgRed: "31",
    FgGreen: "32",
    FgYellow: "33",
    FgBlue: "34",
    FgMagenta: "35",
    FgCyan: "36",
    FgWhite: "37",

    BgBlack: "40",
    BgRed: "41",
    BgGreen: "42",
    BgYellow: "43",
    BgBlue: "44",
    BgMagenta: "45",
    BgCyan: "46",
    BgWhite: "47",
};

class Logger {

    /**
     * @return {{FgYellow: (Colors|string), BgGreen: (Colors|string), BgCyan: (Colors|string), Reverse: (Colors|string), FgBlue: (Colors|string), Blink: (Colors|string), Dim: (Colors|string), BgBlack: (Colors|string), BgYellow: (Colors|string), Bright: (Colors|string), FgBlack: (Colors|string), BgBlue: (Colors|string), FgGreen: (Colors|string), FgMagenta: (Colors|string), Hidden: (Colors|string), Underscore: (Colors|string), FgRed: (Colors|string), FgCyan: (Colors|string), FgWhite: (Colors|string), BgMagenta: (Colors|string), Reset: (Colors|string), BgWhite: (Colors|string), BgRed: (Colors|string)}}
     */
    get Colors() {
        return Colors;
    }

    /**
     * Colorizes a message
     * @param {*} message
     * @param {Colors} [color]
     * @returns {string}
     */
    static colorizeMessage(message, color) {
        if (color === undefined || color === null) {
            color = Colors.Reset;
        }

        let colorizedMessage = "\u001b[" + color + "m" + message + "\u001b[0m";
        return colorizedMessage;
    }

    /**
     * Logs a message with the given color
     * @param {*} message
     * @param {Colors} [color]
     */
    log(message, color) {
        let string = Logger.colorizeMessage(message, color);
        process.stdout.write(string)
    };

    /**
     * Logs a message with the given color and appends a new line
     * @param {*} message
     * @param {Colors} color
     */
    logLine(message, color) {
        this.log(message + "\n", color)
    };

    logError(message) {
        this.log(message, Colors.FgRed);
    };

    logErrorLine(message) {
        this.logError(message + "\n");
    };

    logWarning(message) {
        this.log(message, Colors.FgMagenta);
    };

    logWarningLine(message) {
        this.logWarning(message + "\n");
    };

    logInfo(message) {
        this.log(message, Colors.FgBlue);
    };

    logInfoLine(message) {
        this.logInfo(message + "\n");
    };

    logSuccess(message) {
        this.log(message, Colors.FgGreen);
    };

    logSuccessLine(message) {
        this.logSuccess(message + "\n");
    };
}

module.exports = new Logger();