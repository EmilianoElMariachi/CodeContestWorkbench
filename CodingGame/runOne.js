const testRunner = require("./libs/testRunner");

const inputDataFilePath = "data/input1.txt";
const outputDataFilePath = "data/output1.txt";

testRunner.runTest("./code.js", inputDataFilePath, outputDataFilePath);