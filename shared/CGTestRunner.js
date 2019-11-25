const TestRunnerBase = require("./TestRunnerBase");

class CGTestRunner extends TestRunnerBase {

    _setupInputReadingEnvironment(inputLines) {

        // Expose the global function 'print' as a shortcut for 'console.log'
        global.print = function () {
            console.log.apply(console, arguments);
        };

        // Expose the global function 'readline'
        let readLineIndex = -1;
        global.readline = function readline() {
            return inputLines[++readLineIndex];
        }
    };

}

module.exports = CGTestRunner;