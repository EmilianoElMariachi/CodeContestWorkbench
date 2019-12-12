const testRunner = new (require("./../shared/CGTestRunner"));
const argsParser = require("./../shared/argsParser");

const parsedArgs = argsParser.parse(process.argv.slice(2), {
    "testDir": {type: "string", mandatory: true},
    "testCases": {type: "array", mandatory: false}
});

/**
 * @param {[string]} testCases
 * @return {[ExplicitTestCase]}
 */
function parseTestCases(testCases) {
    if (testCases && testCases.length > 0) {
        return parsedArgs.testCases.map(testCase => {
            const [inputFileName, outputFileName] = testCase.split(":", 2);
            return {
                inputFileName: inputFileName,
                outputFileName: outputFileName || null
            }
        });
    }
    return null;
}

const explicitTestCases = parseTestCases(parsedArgs.testCases);

testRunner.runAll(parsedArgs.testDir, explicitTestCases);