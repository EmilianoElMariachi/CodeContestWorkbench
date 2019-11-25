class ResultsAnalyzer {

    _testIsKO = false;
    _actualOutputs = [];

    /**
     * @type {Logger}
     */
    _logger;

    /**
     * @param {string[]} expectedOutputs
     * @param {Logger} logger
     */
    constructor(expectedOutputs, logger) {
        this._expectedOutputs = expectedOutputs;
        this._logger = logger;
    }

    /**
     * Adds an actual output which is to be analyzed
     * @param {string} newOutput
     */
    onOutput(newOutput) {
        this._actualOutputs.push(newOutput);

        this._logger.log(newOutput);

        if (this._actualOutputs.length > this._expectedOutputs.length) {
            this._logger.logErrorLine(" Extra Line");
            this._testIsKO = true;
        } else {
            const expectedOutput = this._expectedOutputs[this._actualOutputs.length - 1];
            if (expectedOutput !== newOutput) {
                this._logger.logErrorLine(" KO (\"" + expectedOutput + "\" was expected)");
                this._testIsKO = true;
            } else {
                this._logger.logSuccessLine(" OK")
            }
        }
    };

    onEnd() {
        const nbMissingOutputs = Math.max(this._expectedOutputs.length - this._actualOutputs.length, 0);
        for (let i = this._expectedOutputs.length - nbMissingOutputs; i < this._expectedOutputs.length; i++) {
            this._logger.logErrorLine(this._expectedOutputs[i] + " Line Missing");
        }

        if (nbMissingOutputs > 0)
            this._testIsKO = true;
    };

    isTestKO() {
        return this._testIsKO;
    };
}

module.exports = ResultsAnalyzer;