// Backup original log function
const _logOri = console.log;

class ConsoleRedirecter {

    /**
     * Redirects "console.log" function to the specified callback.
     * @param {Function} logCallback
     */
    redirectLog(logCallback) {
        console.log = function consoleLogOverride() {
            const message = Array.from(arguments).map(value => value.toString()).join(" ");
            logCallback(message);
        };
    };

    /**
     * Restores the original "console.log" function implementation.
     */
    restoreLog() {
        console.log = _logOri;
    };
}

module.exports = new ConsoleRedirecter();