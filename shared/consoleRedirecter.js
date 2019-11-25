function ConsoleRedirecter() {
    const _self = this;

    // Backup original log function
    const _logOri = console.log;

    this.redirectLog = function redirectLog(logCallback) {
        console.log = function consoleLogOverride() {
            const message = Array.from(arguments).map(value => value.toString()).join(" ");
            logCallback(message);
        };
    };

    this.restoreLog = function restoreLog() {
        console.log = _logOri;
    };


}


module.exports = new ConsoleRedirecter();