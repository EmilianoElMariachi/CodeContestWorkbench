const readline = require('readline');
const fs = require('fs');
const path = require('path');
const logger = require('./logger');

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

/**
 * @param filePath
 * @returns {Promise<string[]>}
 */
async function readFileLines(filePath) {
    return new Promise(resolve => {
        const lines = [];
        let stream = fs.createReadStream(filePath);
        let rl = readline.createInterface({input: stream});

        rl.on('line', function (line) {
            lines.push(line);
        });

        rl.on('close', async function () {
            resolve(lines);
        });
    });
}

async function runTestCase(inputFile, outputFile, codeFile, enableOutputAnalysis = true) {
    return new Promise(async resolve => {
        logger.logInfoLine("===============================================");
        logger.logInfoLine("> TEST \"" + path.parse(inputFile).base + "\"/\"" + path.parse(outputFile).base + "\"");
        logger.logInfoLine("===============================================");

        if (!fs.statSync(inputFile).isFile()) {
            logger.logErrorLine("Input file \"" + inputFile + "\" not found!");
            return;
        }

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
        const inputLines = await readFileLines(inputFile);
        for (let i in inputLines) {
            onInputLineReadCb(inputLines[i]);
        }

        let outputsAnalyzer;
        if (!enableOutputAnalysis) {
            outputsAnalyzer = null;
            consoleHook.onLog = logger.logLine.bind(logger);
        } else {
            if (!fs.existsSync(outputFile)) {
                throw "Output file \"" + outputFile + "\" not found, test will be run without expectations.";
            }

            let expectedOutputs = await readFileLines(outputFile);
            outputsAnalyzer = new OutputsAnalyzer(expectedOutputs);
            consoleHook.onLog = outputsAnalyzer.onNewOutput.bind(outputsAnalyzer);
        }

        // Runs the test
        onAllInputLinesReadCb();

        if (outputsAnalyzer) {
            if (outputsAnalyzer.isTestKO()) {
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

function OutputsAnalyzer(expectedOutputs) {

    let _testIsKO = false;

    const _actualOutputs = [];

    /**
     * @param {string} newOutput
     */
    this.onNewOutput = function (newOutput) {
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

    this.isTestKO = function () {
        return _testIsKO;
    }
}

function requireUncached(module) {
    delete require.cache[require.resolve(module)];
    return require(module)
}

module.exports = {
    runTestCase: runTestCase
};