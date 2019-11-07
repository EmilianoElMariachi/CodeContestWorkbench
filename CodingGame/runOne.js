const testRunner = require("./libs/testRunner");

let inputDataFilePath = "data/input1.txt";
let outputDataFilePath = "data/output1.txt";

testRunner.runTest("./code.js", inputDataFilePath, outputDataFilePath);