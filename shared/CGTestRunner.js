const TestRunnerBase = require("./TestRunnerBase");

function CGTestRunner() {

}

CGTestRunner.prototype = Object.create(TestRunnerBase.prototype);

CGTestRunner.prototype._setupInputReadingEnvironment = function _setupInputReadingEnvironment(inputLines) {

    // Expose the 'print' function as a shortcut for 'console.log'
    global.print = function () {
        console.log.apply(console, arguments);
    };

    let readLineIndex = -1;
    global.readline = function readline() {
        return inputLines[++readLineIndex];
    }

};

module.exports = CGTestRunner;