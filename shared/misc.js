const path = require("path");
const logger = require("./logger");

/**
 * @param {string} module
 * @returns {*}
 */
function requireForce(module) {
    delete require.cache[require.resolve(module)];
    return require(module)
}

function displayTestHeader(inputFile, outputFile) {
    const inputDataFileName = path.basename(inputFile);
    const outputDataFileName = outputFile ? path.basename(outputFile) : "";
    const files = outputFile ? "\"" + inputDataFileName + "/" + outputDataFileName + "\"" : "\"" + inputDataFileName + "\"";
    logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
    logger.logInfoLine("===>  Running test " + files + " <===");
    logger.logInfoLine("===================" + "=".repeat(files.length) + "=====");
}

module.exports = {
    requireForce: requireForce,
    displayTestHeader : displayTestHeader,
};