const testRunner = new (require("./../shared/CGTestRunner"));

let inputDataFilePath = "data/input1.txt";
let outputDataFilePath = "data/output1.txt";

testRunner.runOne("./code.js", inputDataFilePath, outputDataFilePath);