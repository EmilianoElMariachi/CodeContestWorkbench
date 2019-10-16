const colors = {
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

function colorize(message, color) {
    if (color === undefined || color === null) {
        color = colors.Reset;
    }

    let colorizedMessage = "\033[" + color + "m" + message + "\033[0m";
    return colorizedMessage;
}

module.exports = {
    colors: colors,

    log: function (message, color) {
        let string = colorize(message, color);
        process.stdout.write(string)
    },
    logLine: function (message, color) {
        this.log(message + "\n", color)
    },

    logError: function (message) {
        this.log(message, colors.FgRed);
    },
    logErrorLine: function (message) {
        this.logError(message + "\n");
    },
    logWarning: function (message) {
        this.log(message, colors.FgMagenta);
    },
    logWarningLine: function (message) {
        this.logWarning(message + "\n");
    },

    logInfo: function (message) {
        this.log(message, colors.FgBlue);
    },
    logInfoLine: function (message) {
        this.logInfo(message + "\n");
    },

    logSuccess: function (message) {
        this.log(message, colors.FgGreen);
    },
    logSuccessLine: function (message) {
        this.logSuccess(message + "\n");
    },

};