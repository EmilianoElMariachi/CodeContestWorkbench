const testRunner = new (require("./../shared/CGTestRunner"));

let dataDir = "./data";

testRunner.runAll("./code.js", dataDir);