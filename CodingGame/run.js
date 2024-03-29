const testRunner = new (require("./../shared/CGTestRunner"));
const argsParser = require("./../shared/argsParser");

const {exerciseDir, explicitTestCases} = argsParser.parseTestArgs();

testRunner.runAll(exerciseDir, explicitTestCases);