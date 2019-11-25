const fs = require('fs');

/**
 * @param {string} filePath
 * @returns {string[]}
 */
function readFileLines(filePath) {
    return fs.readFileSync(filePath, "utf-8").replace(/\r/g, "").split("\n");
}

module.exports = {
    readFileLines: readFileLines,
};