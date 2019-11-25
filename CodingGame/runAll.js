const CGTestRunner = require("./../shared/CGTestRunner");

const dataDir = "./data";

let cgTestRunner = new CGTestRunner();
cgTestRunner.runAll("./code.js",dataDir);