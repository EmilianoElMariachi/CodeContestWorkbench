/**
 * @param {string[]} expectedOutputs
 * @param {Logger} logger
 * @constructor
 */
function ResultsAnalyzer(expectedOutputs, logger) {
    let _testIsKO = false;

    const _actualOutputs = [];

    /**
     * @param {string} newOutput
     */
    this.onOutput = function onOutput(newOutput) {
        _actualOutputs.push(newOutput);

        logger.log(newOutput);

        if (_actualOutputs.length > expectedOutputs.length) {
            logger.logErrorLine(" Extra Line");
            _testIsKO = true;
        } else {
            const expectedOutput = expectedOutputs[_actualOutputs.length - 1];
            if (expectedOutput !== newOutput) {
                logger.logErrorLine(" KO (\"" + expectedOutput + "\" was expected)");
                _testIsKO = true;
            } else {
                logger.logSuccessLine(" OK")
            }
        }
    };

    this.onEnd = function onEnd() {
        const nbMissingOutputs = Math.max(expectedOutputs.length - _actualOutputs.length, 0);
        for (let i = expectedOutputs.length - nbMissingOutputs; i < expectedOutputs.length; i++) {
            logger.logErrorLine(expectedOutputs[i] + " Line Missing");
        }

        if (nbMissingOutputs > 0)
            _testIsKO = true;
    };

    this.isTestKO = function () {
        return _testIsKO;
    };
}

module.exports = ResultsAnalyzer;