const fs = require("fs");
const path = require("path");

// Hook console output
const logOriginal = console.log;

// Expose the 'print' function as a shortcut for 'console.log'
global.print = function () {
    console.log.apply(console, arguments);
};

function readFileLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").replace(/\r/g, "").split("\n");
}

function guessOutputDataFilePath(inputDataFilePath) {
    const inputFileName = path.basename(inputDataFilePath);
    const match = inputFileName.match(/[^\d]*(\d*\..*)$/);

    if (!match) {
        return null;
    }

    const expectedOutputFilePath = path.join(path.dirname(inputDataFilePath), "output" + match[1]);
    return expectedOutputFilePath;
}

function runTest(srcCodeFilePath, inputDataFilePath, outputDataFilePath) {
    // Make sure source code file path exists
    const srcCodeAbsFilePath = path.resolve(srcCodeFilePath);
    if (!fs.existsSync(srcCodeAbsFilePath))
        throw "Source code file \"" + srcCodeAbsFilePath + "\" not found.";

    // Read test input lines
    if (!fs.existsSync(inputDataFilePath))
        throw "Input data file \"" + inputDataFilePath + "\" not found.";

    const inputLines = readFileLines(inputDataFilePath);
    // Declare the 'readline' function used by the code to get the input data

    let currentLineIndex = 0;
    global.readline = function readline() {
        return inputLines[currentLineIndex++];
    };

    // Read the expected output lines (if a file is specified)
    let expectedLines = null;
    if (outputDataFilePath) {
        if (!fs.existsSync(outputDataFilePath))
            throw "Output data file \"" + outputDataFilePath + "\" not found.";
        expectedLines = readFileLines(outputDataFilePath);
    }

    let expectedLineIndex = -1;

    console.log = function (actualLine) {
        logOriginal.apply(console, arguments);
        if (!expectedLines) {
            return
        }

        const expectedLine = expectedLines[++expectedLineIndex];
        if (expectedLine !== actualLine.toString()) {
            throw "Found:\"" + expectedLine + "\" found\n\"" + actualLine + "\" expected (line " + (expectedLineIndex + 1) + ").";
        }
    };

    try {
        logOriginal("===>  Running test \"" + path.basename(inputDataFilePath) + "\" <===")

        /*============================*/
        /*=== RUNS THE SOURCE CODE ===*/
        require(srcCodeAbsFilePath);
        /*=== RUNS THE SOURCE CODE ===*/
        /*============================*/

    } finally {
        delete require.cache[srcCodeAbsFilePath];
        console.log = logOriginal;
    }
}

function runAllTests(srcCodeFilePath, inputDataDir) {
    fs.readdirSync(inputDataDir).forEach((fileName) => {
        const match = fileName.match(/^input(\d+\..*)$/);
        if (match) {
            const inputDataFilePath = path.join(inputDataDir, fileName);
            let outputDataFilePath = guessOutputDataFilePath(inputDataFilePath);
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