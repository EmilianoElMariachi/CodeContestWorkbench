const fs = require('fs');
const path = require('path');
const logger = require('../../shared/logger');
const ioHelper = require('../../shared/ioHelper');
const ResultsAnalyzer = require('../../shared/ResultsAnalyzer');


/**
 * @type {null|Function}
 */
let onInputLineReadCb = null;

/**
 * @type {null|Function}
 */
let onAllInputLinesReadCb = null;

const consoleHook = new (function ConsoleHook() {
    const _self = this;

    // Backup original log function
    console._logOri = console.log;

    console.log = function (l) {
        if (_self.onLog) {
            _self.onLog("" + l);
        }
    };

    this.onLog = null;
})();


global.readline_object = {
    on: function (action, cb) {
        if (action === "line") {
            onInputLineReadCb = cb;
        } else if (action === "close") {
            onAllInputLinesReadCb = cb;
        }
    }
};

async function runTestCase(inputFile, outputFile, codeFile, enableOutputAnalysis = true) {
    return new Promise(async resolve => {

        if (!fs.statSync(inputFile).isFile()) {
            logger.logErrorLine("Input file \"" + inputFile + "\" not found!");
            return;
        }

        // Display test header
        const inputDataFileName = path.basename(inputFile);
        const outputDataFileName = outputFile ? path.basename(outputFile) : "";
        const files = outputFile ? "\"" + inputDataFileName + "/" + outputDataFileName + "\"" : "\"" + inputDataFileName + "\"";
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
        logger.logInfoLine("===>  Running test " + files + " <===");
        logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");


        onInputLineReadCb = null;
        onAllInputLinesReadCb = null;

        // Load code to test
        requireUncached(codeFile);

        if (!onInputLineReadCb) {
            throw "The loading of the code file \"" + codeFile + "\" didn't register the \"line\" callback!";
        }

        if (!onAllInputLinesReadCb) {
            throw "The loading of the code file \"" + codeFile + "\" didn't register the \"close\" callback!";
        }

        // Reads all input and send them to code
        const inputLines = await ioHelper.readFileLinesAsync(inputFile);
        for (let i in inputLines) {
            onInputLineReadCb(inputLines[i]);
        }

        let resultsAnalyzer;
        if (!enableOutputAnalysis) {
            resultsAnalyzer = null;
            consoleHook.onLog = logger.logLine.bind(logger);
        } else {
            if (!fs.existsSync(outputFile)) {
                throw "Output file \"" + outputFile + "\" not found, test will be run without expectations.";
            }

            let expectedOutputs = await ioHelper.readFileLinesAsync(outputFile);
            resultsAnalyzer = new ResultsAnalyzer(expectedOutputs, logger);
            consoleHook.onLog = resultsAnalyzer.onNewOutput.bind(resultsAnalyzer);
        }

        // Runs the test
        onAllInputLinesReadCb();

        if (resultsAnalyzer) {
            resultsAnalyzer.onEnd();
            if (resultsAnalyzer.isTestKO()) {
                logger.logErrorLine("> TEST KO");
                logger.logErrorLine("");
            } else {
                logger.logSuccessLine("> TEST OK");
                logger.logSuccessLine("");
            }
        }

        // Notify end of test
        resolve();
    });
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module)
}

module.exports = {
    runTestCase: runTestCase
};