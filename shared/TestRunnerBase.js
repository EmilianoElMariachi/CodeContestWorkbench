const fs = require("fs");
const path = require("path");
const ioHelper = require("./ioHelper");
const ResultsAnalyzer = require("./ResultsAnalyzer");
const logger = require('./logger');
const consoleRedirecter = require('./consoleRedirecter');


function requireForce(module) {
    delete require.cache[require.resolve(module)];
    return require(module)
}

function TestRunnerBase() {
}

TestRunnerBase.prototype.runOne = function runOne(srcCodeFilePath, inputDataFilePath, outputDataFilePath, enableOutputAnalysis = true) {

    try {
        // Make sure source code file path exists
        const srcCodeAbsFilePath = path.resolve(srcCodeFilePath);
        if (!fs.existsSync(srcCodeAbsFilePath))
            throw "Source code file \"" + srcCodeAbsFilePath + "\" not found.";

        // Read test input lines
        if (!fs.existsSync(inputDataFilePath))
            throw "Input data file \"" + inputDataFilePath + "\" not found.";
        let inputLines = ioHelper.readFileLines(inputDataFilePath);

        // Loads output lines if specified
        /**
         * @type {ResultsAnalyzer|null}
         */
        let resultsAnalyzer = null;
        if (outputDataFilePath && enableOutputAnalysis) {
            if (!fs.existsSync(outputDataFilePath))
                throw "Output data file \"" + outputDataFilePath + "\" not found.";
            resultsAnalyzer = new ResultsAnalyzer(ioHelper.readFileLines(outputDataFilePath), logger);
        }

        this._displayTestHeader(inputDataFilePath, outputDataFilePath);

        this._setupInputReadingEnvironment(inputLines);

        this._setupOutputWritingEnvironment(resultsAnalyzer);

        /*============================*/
        /*=== RUNS THE SOURCE CODE ===*/
        this._loadSourceCode(srcCodeAbsFilePath);
        /*=== RUNS THE SOURCE CODE ===*/
        /*============================*/

        if (resultsAnalyzer) {
            resultsAnalyzer.onEnd();

            if (resultsAnalyzer.isTestKO()) {
                logger.logErrorLine("> Test failed.");
            } else {
                logger.logSuccessLine("> Test passed.");
            }
        }

    } finally {
        this._cleanup();
    }

};

TestRunnerBase.prototype.runAll = function runAll(srcCodeFilePath, inputDataDir) {
    fs.readdirSync(inputDataDir).forEach((fileName) => {
        const match = fileName.match(/^input(\d+\..*)$/);
        if (match) {
            const inputDataFilePath = path.join(inputDataDir, fileName);
            let outputDataFilePath = ioHelper.guessOutputDataFilePath(inputDataFilePath);
            if (!fs.existsSync(outputDataFilePath))
                outputDataFilePath = null;
            this.runOne(srcCodeFilePath, inputDataFilePath, outputDataFilePath);
        }
    });
};

TestRunnerBase.prototype._loadSourceCode = function loadSourceCode(srcCodeFilePath) {
    requireForce(srcCodeFilePath);
};

/**
 * @abstract
 * @param {string[]} inputLines
 * @private
 */
TestRunnerBase.prototype._setupInputReadingEnvironment = function (inputLines) {
    throw new Error("Not implemented.");
};

/**
 * @param {ResultsAnalyzer} [resultsAnalyzer]
 * @private
 */
TestRunnerBase.prototype._setupOutputWritingEnvironment = function (resultsAnalyzer) {
    consoleRedirecter.redirectLog(function onConsoleLog(msg) {
        if (resultsAnalyzer)
            resultsAnalyzer.onOutput(msg);
        else
            logger.log(msg);
    });
};

TestRunnerBase.prototype._cleanup = function _cleanup() {
    consoleRedirecter.restoreLog();
};

TestRunnerBase.prototype._displayTestHeader = function _displayTestHeader(inputFile, outputFile) {
    const inputDataFileName = path.basename(inputFile);
    const outputDataFileName = outputFile ? path.basename(outputFile) : "";
    const files = outputFile ? "\"" + inputDataFileName + "/" + outputDataFileName + "\"" : "\"" + inputDataFileName + "\"";
    logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
    logger.logInfoLine("===>  Running test " + files + " <===");
    logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
};

module.exports = TestRunnerBase;