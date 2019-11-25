const testRunner = new (require("./../shared/TCTestRunner"));

const dataDir = "./data";

testRunner.runAll("./code.js", dataDir);