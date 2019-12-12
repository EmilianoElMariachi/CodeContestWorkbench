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
     * @typedef TestCase
     * @property {string} inputDataFilePath
     * @property {string|null|undefined} outputDataFilePath
     */

    /**
     * @typedef ExplicitTestCase
     * @property {string} inputFileName
     * @property {string|null|undefined} outputFileName
     */

    /**
     * Run all tests found in the specified directory.
     *
     * @param {string} testDir
     * @param {[ExplicitTestCase]} [explicitTestCases]
     */
    runAll(testDir, explicitTestCases) {
        const srcCodeFilePath = path.join(testDir, "code.js");
        const inputDataDir = path.join(testDir, "data");

        const testCases = explicitTestCases ?
            this._toFullPathTestCases(inputDataDir, explicitTestCases) :
            this._findTestCasesInTestDir(inputDataDir);

        // Run all test cases
        testCases.forEach(testCase => {
            this.runOne(srcCodeFilePath, testCase.inputDataFilePath, testCase.outputDataFilePath);
        })
    };

    /**
     * @param {string} inputDataDir
     * @param {[ExplicitTestCase]} explicitTestCases
     * @return {[TestCase]}
     * @private
     */
    _toFullPathTestCases(inputDataDir, explicitTestCases) {
        let testCases = explicitTestCases.map(explicitTestCase => {
            const inputDataFilePath = path.join(inputDataDir, explicitTestCase.inputFileName);
            if (!fs.existsSync(inputDataFilePath))
                throw "Test case input file \"" + inputDataFilePath + "\" not found.";

            const outputDataFilePath = explicitTestCase.outputFileName ? path.join(inputDataDir, explicitTestCase.outputFileName) : null;
            if (outputDataFilePath && !fs.existsSync(outputDataFilePath))
                throw "Test case output file \"" + outputDataFilePath + "\" not found.";

            return {
                inputDataFilePath: inputDataFilePath,
                outputDataFilePath: outputDataFilePath
            }
        });

        if (testCases.length === 0)
            logger.logWarningLine("No test case specified!");

        return testCases;
    }

    /**
     * @param {string} inputDataDir
     * @return {[TestCase]}
     * @private
     */
    _findTestCasesInTestDir(inputDataDir) {
        const testCasesFound = [];

        fs.readdirSync(inputDataDir).forEach((fileName) => {
            const match = fileName.match(/^(.*)input(.*)$/);
            if (match) {
                const expectedFileName = match[1] + "output" + match[2];

                let outputDataFilePath = path.join(inputDataDir, expectedFileName);
                if (!fs.existsSync(outputDataFilePath))
                    outputDataFilePath = null;

                testCasesFound.push({
                    inputDataFilePath: path.join(inputDataDir, fileName),
                    outputDataFilePath: outputDataFilePath
                });
            }
        });

        if (testCasesFound.length === 0)
            logger.logWarningLine("No test case found!");

        return testCasesFound;
    }

    /**
     * Force the loading of a node module even if it was previously loaded
     * @param {string} module
     * @returns {*}
     * @private
     */
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