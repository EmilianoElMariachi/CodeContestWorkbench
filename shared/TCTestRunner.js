const TestRunnerBase = require("./TestRunnerBase");

class TCTestRunner extends TestRunnerBase {

    /**
     * @type {null|Function}
     */
    _onInputLineReadCb = null;

    /**
     * @type {null|Function}
     */
    _onAllInputLinesReadCb = null;

    _onSourceCodeLoaded() {
        super._onSourceCodeLoaded();

        if (!this._onInputLineReadCb)
            throw new Error("No \"line\" event subscribed during the source code loading.");

        if (!this._onAllInputLinesReadCb)
            throw new Error("No \"close\" event subscribed during the source code loading.");

        this._inputLines.forEach(inputLine => {
            this._onInputLineReadCb(inputLine);
        });

        this._onAllInputLinesReadCb();
    }

    _setupInputReadingEnvironment(inputLines) {
        this._inputLines = inputLines;
        this._onInputLineReadCb = null;
        this._onAllInputLinesReadCb = null;

        const self = this;

        // Expose the global object 'readline_object'
        global.readline_object = {
            on: function (eventName, cb) {
                if (eventName === "line") {
                    self._onInputLineReadCb = cb;
                } else if (eventName === "close") {
                    self._onAllInputLinesReadCb = cb;
                } else {
                    throw new Error("Unsupported event name \"" + eventName + "\".");
                }
            }
        };
    };
}

module.exports = TCTestRunner;