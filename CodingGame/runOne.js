const CGTestRunner = require("./../shared/CGTestRunner");

let inputDataFilePath = "data/input1.txt";
let outputDataFilePath = "data/output1.txt";

let cgTestRunner = new CGTestRunner();
cgTestRunner.runOne("./code.js", inputDataFilePath, outputDataFilePath);