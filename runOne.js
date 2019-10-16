const path = require('path');
const back = require('./libs/testRunner.js');

const fileName = "input1.txt";
const enableOutputAnalysis = true;

const dataDir = path.join(__dirname, "data");
const filePath = path.join(dataDir, fileName);

const match = fileName.match(/^input(\d+\..*)$/);
if (match) {
    const expectedOutputFileName = "output" + match[1];
    const expectedOutputFilePath = path.join(dataDir, expectedOutputFileName);

    back.runTestCase(filePath, expectedOutputFilePath, path.join(__dirname, "code.js"), enableOutputAnalysis);
}


