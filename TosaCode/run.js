const testRunner = new (require("./../shared/TCTestRunner"));
const argsParser = require("./../shared/argsParser");

const {exerciseDir, explicitTestCases} = argsParser.parseTestArgs();

testRunner.runAll(exerciseDir, explicitTestCases);