const fs = require('fs');
const path = require('path');
const back = require('./libs/testRunner.js');

const enableOutputAnalysis = true;

async function main() {

    const dataDir = path.join(__dirname, "data");
    const files = fs.readdirSync(dataDir);

    for (let i in files) {
        /**
         * @type string
         */
        const fileName = files[i];
        const filePath = path.join(dataDir, fileName);

        if (!fs.statSync(filePath).isFile()) {
            continue;
        }
        const match = fileName.match(/^input(\d+\..*)$/);
        if (match) {
            const expectedOutputFileName = "output" + match[1];
            const expectedOutputFilePath = path.join(dataDir, expectedOutputFileName);

            await back.runTestCase(filePath, expectedOutputFilePath, path.join(__dirname, "code.js"), enableOutputAnalysis);
        }
    }
}

main();