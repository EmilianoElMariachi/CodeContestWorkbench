const fs = require('fs');
const readline = require('readline');
const path = require('path');

/**
 * @param {string} filePath
 * @returns {Promise<string[]>}
 */
async function readFileLinesAsync(filePath) {
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

/**
 * @param {string} filePath
 * @returns {string[]}
 */
function readFileLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").replace(/\r/g, "").split("\n");
}

/**
 * @param {string} inputDataFilePath
 * @returns {null|string}
 */
function guessOutputDataFilePath(inputDataFilePath) {
    const inputFileName = path.basename(inputDataFilePath);
    const match = inputFileName.match(/[^\d]*(\d*\..*)$/);

    if (!match) {
        return null;
    }

    const expectedOutputFilePath = path.join(path.dirname(inputDataFilePath), "output" + match[1]);
    return expectedOutputFilePath;
}

module.exports = {
    readFileLinesAsync: readFileLinesAsync,
    readFileLines: readFileLines,
    guessOutputDataFilePath: guessOutputDataFilePath,
};