/*******
 * Read input from STDIN
 * Use: console.log()  to output your result.
 * Use: console.error() to output debug information into STDERR
 * ***/

var input = [];

readline_object.on("line", (value) => { //Read input values
    input.push(value);
})
//Call ContestResponse when all inputs are read
readline_object.on("close", ContestResponse);


function ContestResponse(){
    var resCapacity = parseFloat(input[0]);
    var conso = parseFloat(input[1]);
    var s1 = parseFloat(input[2]);
    var s2 = parseFloat(input[3]);
    var s3 = parseFloat(input[4]);
    var s4 = parseFloat(input[5]);
    var autonomie = 100.0 / conso * resCapacity;

    if(autonomie >= s1 && autonomie >= (s2 - s1)  && autonomie >= (s3 - s2) && autonomie >= (s4 - s3)) {
        console.log("OK")
    } else {
        console.log("KO")
    }
}