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

/**
 * Colorizes a message
 * @param {*} message
 * @param {Colors} [color]
 * @returns {string}
 */
function colorizeMessage(message, color) {
    if (color === undefined || color === null) {
        color = Colors.Reset;
    }

    let colorizedMessage = "\033[" + color + "m" + message + "\033[0m";
    return colorizedMessage;
}

function Logger() {

    /**
     * @Type {Colors}
     * @readonly
     */
    Object.defineProperty(this, "Colors", {writable: false, value: Colors});

    /**
     * Logs a message with the given color
     * @param {*} message
     * @param {Colors} [color]
     */
    this.log = function log(message, color) {
        let string = colorizeMessage(message, color);
        process.stdout.write(string)
    };

    /**
     * Logs a message with the given color and appends a new line
     * @param {*} message
     * @param {Colors} color
     */
    this.logLine = function logLine(message, color) {
        this.log(message + "\n", color)
    };

    this.logError = function logError(message) {
        this.log(message, Colors.FgRed);
    };

    this.logErrorLine = function logErrorLine(message) {
        this.logError(message + "\n");
    };

    this.logWarning = function logWarning(message) {
        this.log(message, Colors.FgMagenta);
    };

    this.logWarningLine = function logWarningLine(message) {
        this.logWarning(message + "\n");
    };

    this.logInfo = function logInfo(message) {
        this.log(message, Colors.FgBlue);
    };
    this.logInfoLine = function logInfoLine(message) {
        this.logInfo(message + "\n");
    };

    this.logSuccess = function logSuccess(message) {
        this.log(message, Colors.FgGreen);
    };
    this.logSuccessLine = function logSuccessLine(message) {
        this.logSuccess(message + "\n");
    };
}

module.exports = new Logger();