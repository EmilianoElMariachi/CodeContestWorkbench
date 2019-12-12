/**
 * Generic command line arguments parser
 *
 * @param {[string]} args
 * @param {Object.<string, {"type":string, mandatory:boolean}>} model
 * @return {{}}
 */
function parseArgs(args, model) {

    const argsObj = {_others: []};
    let argName = null;
    let argType = null;

    args.forEach(arg => {

        if (arg.startsWith("--")) {
            argName = arg.substr(2);
            if (!(argName in model))
                throw `Argument "${argName}" not supported.`;
            argType = model[argName].type;
            if (argType === "array") {
                argsObj[argName] = [];
            } else {
                argsObj[argName] = undefined;
            }
        } else if (argName !== null) {
            if (argType === "array") {
                argsObj[argName].push(arg);
            } else {
                argsObj[argName] = arg;
                argName = null;
            }

        } else {
            argsObj._others.push(arg);
        }
    });

    for (const argName in model) {
        if (model.hasOwnProperty(argName) && model[argName].mandatory && !(argName in argsObj))
            throw `Mandatory argument "${argName}" not specified.`;
    }

    return argsObj;
}


/**
 * @returns {{exerciseDir: string,explicitTestCases: [ExplicitTestCase]}}
 */
function parseTestArgs() {
    const parsedArgs = parseArgs(process.argv.slice(2), {
        "exerciseDir": {type: "string", mandatory: true},
        "testCases": {type: "array", mandatory: false}
    });

    /**
     * @param {[string]} testCases
     * @return {[ExplicitTestCase]}
     */
    function parseTestCases(testCases) {
        if (testCases && testCases.length > 0) {
            return parsedArgs.testCases.map(testCase => {
                const [inputFileName, outputFileName] = testCase.split(":", 2);
                return {
                    inputFileName: inputFileName,
                    outputFileName: outputFileName || null
                }
            });
        }
        return null;
    }

    return {
        exerciseDir: parsedArgs.exerciseDir,
        explicitTestCases: parseTestCases(parsedArgs.testCases)
    }
}


module.exports = {
    parseTestArgs: parseTestArgs
};