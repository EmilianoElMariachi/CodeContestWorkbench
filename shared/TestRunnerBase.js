const fs = require("fs");
const path = require("path");
const ioHelper = require("./ioHelper");
const ResultsAnalyzer = require("./ResultsAnalyzer");
const logger = require('./logger');
const consoleRedirecter = require('./consoleRedirecter');

class TestRunnerBase {

    /**
     * Run one test.
     *
     * @param {string} srcCodeFilePath
     * @param {string} inputDataFilePath
     * @param {string} [outputDataFilePath]
     * @param {boolean} [enableOutputAnalysis]
     */
    runOne(srcCodeFilePath, inputDataFilePath, outputDataFilePath, enableOutputAnalysis = true) {

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

            /*=============================*/
            /*=== LOADS THE SOURCE CODE ===*/
            this._loadSourceCode(srcCodeAbsFilePath);
            /*=== LOADS THE SOURCE CODE ===*/
            /*=============================*/

            this._onSourceCodeLoaded();

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

    /**
     * Run all tests found in the specified directory.
     *
     * @param {string} srcCodeFilePath
     * @param {string} inputDataDir
     */
    runAll(srcCodeFilePath, inputDataDir) {
        fs.readdirSync(inputDataDir).forEach((fileName) => {
            const match = fileName.match(/^input(\d+\..*)$/);
            if (match) {
                const inputDataFilePath = path.join(inputDataDir, fileName);
                let outputDataFilePath = this._guessOutputDataFilePath(inputDataFilePath);
                if (!fs.existsSync(outputDataFilePath))
                    outputDataFilePath = null;
                this.runOne(srcCodeFilePath, inputDataFilePath, outputDataFilePath);
            }
        });
    };

    /**
     * @param {string} inputDataFilePath
     * @returns {null|string}
     */
    _guessOutputDataFilePath(inputDataFilePath) {
        const inputFileName = path.basename(inputDataFilePath);
        const match = inputFileName.match(/[^\d]*(\d*\..*)$/);

        if (!match) {
            return null;
        }
        return path.join(path.dirname(inputDataFilePath), "output" + match[1]);
    }

    _requireForce(module) {
        delete require.cache[require.resolve(module)];
        return require(module)
    }

    _displayTestHeader(inputFile, outputFile) {
        const inputDataFileName = path.basename(inputFile);
        const outputDataFileName = outputFile ? path.basename(outputFile) : "";
        const files = outputFile ? "\"" + inputDataFileName + "/" + outputDataFileName + "\"" : "\"" + inputDataFileName + "\"";
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
        logger.logInfoLine("===>  Running test " + files + " <===");
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
    };

    _loadSourceCode(srcCodeFilePath) {
        this._requireForce(srcCodeFilePath);
    };

    /**
     * @abstract
     * @param {string[]} inputLines
     * @private
     */
    _setupInputReadingEnvironment(inputLines) {
        throw new Error("Not implemented.");
    };

    /**
     * @param {ResultsAnalyzer} [resultsAnalyzer]
     * @private
     */
    _setupOutputWritingEnvironment(resultsAnalyzer) {
        consoleRedirecter.redirectLog(function onConsoleLog(msg) {
            if (resultsAnalyzer)
                resultsAnalyzer.onOutput(msg);
            else
                logger.log(msg);
        });
    };

    _cleanup() {
        consoleRedirecter.restoreLog();
    };

    _onSourceCodeLoaded() {
    }
}


module.exports = TestRunnerBase;