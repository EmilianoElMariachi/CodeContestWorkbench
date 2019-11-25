const fs = require("fs");
const path = require("path");
const ioHelper = require('../../shared/ioHelper');
const ResultsAnalyzer = require('../../shared/ResultsAnalyzer');
const logger = require('../../shared/logger');
const consoleRedirecter = require('../../shared/ConsoleRedirecter');

// Expose the 'print' function as a shortcut for 'console.log'
global.print = function () {
    console.log.apply(console, arguments);
};

/**
 *
 * @param {string} srcCodeFilePath
 * @param {string} inputDataFilePath
 * @param {string} [outputDataFilePath]
 */
function runTest(srcCodeFilePath, inputDataFilePath, outputDataFilePath) {
    // Make sure source code file path exists
    const srcCodeAbsFilePath = path.resolve(srcCodeFilePath);
    if (!fs.existsSync(srcCodeAbsFilePath))
        throw "Source code file \"" + srcCodeAbsFilePath + "\" not found.";

    // Read test input lines
    if (!fs.existsSync(inputDataFilePath))
        throw "Input data file \"" + inputDataFilePath + "\" not found.";

    // Read the expected output lines (if a file is specified)
    let currentLineIndex = 0;
    let inputLines = ioHelper.readFileLines(inputDataFilePath);

    // Declare the 'readline' function used by the code to get the input data
    global.readline = function readline() {
        return inputLines[currentLineIndex++];
    };

    // If output file is specified, activates the results analyzer
    /**
     * @type {ResultsAnalyzer|null}
     */
    let resultsAnalyzer = null;
    if (outputDataFilePath) {
        if (!fs.existsSync(outputDataFilePath))
            throw "Output data file \"" + outputDataFilePath + "\" not found.";
        resultsAnalyzer = new ResultsAnalyzer(ioHelper.readFileLines(outputDataFilePath), logger);
    }

    // Hook messages logged by the code via "console.log" or "print"
    consoleRedirecter.redirectLog(function onConsoleLog(msg) {
        if (resultsAnalyzer)
            resultsAnalyzer.onInput(msg);
        else
            logger.log(msg);
    });

    try {


        // Display test header
        const inputDataFileName = path.basename(inputDataFilePath);
        const outputDataFileName = outputDataFilePath ? path.basename(outputDataFilePath) : "";
        const files = outputDataFilePath ? "\"" + inputDataFileName + "/" + outputDataFileName + "\"" : "\"" + inputDataFileName + "\"";
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
        logger.logInfoLine("===>  Running test " + files + " <===");
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");

        /*============================*/
        /*=== RUNS THE SOURCE CODE ===*/
        require(srcCodeAbsFilePath);
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
        delete require.cache[srcCodeAbsFilePath];
        consoleRedirecter.restoreLog();
    }
}

function runAllTests(srcCodeFilePath, inputDataDir) {
    fs.readdirSync(inputDataDir).forEach((fileName) => {
        const match = fileName.match(/^input(\d+\..*)$/);
        if (match) {
            const inputDataFilePath = path.join(inputDataDir, fileName);
            let outputDataFilePath = ioHelper.guessOutputDataFilePath(inputDataFilePath);
            if (!fs.existsSync(outputDataFilePath))
                outputDataFilePath = null;
            runTest(srcCodeFilePath, inputDataFilePath, outputDataFilePath);
        }
    });
}

module.exports = {
    runTest: runTest,
    runAllTests: runAllTests
};