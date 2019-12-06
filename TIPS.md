## String

### Convert a string to number (the Unary operator)

    +"5647" => 5647
    +"0xFF" => 255
    +"0b101" => 5
    +null => 0
    +"" => NaN

### Iterate over string chars

    for(c of "abcdef") {
        console.log(c)
    }

### Reverse a string

    //Case 1
    r="MyString".split("").reverse().join(""); // returns "gnirtSyM"
    
    //Case 2
    r="";for(c of "MyString")r=c+r 


## Char to unicode number
    "A".charCodeAt(0);      // Returns 65

## Unicode number to char
    String.fromCharCode(65) // Return "A"

## ASCII codes good to know
    " " =>  32
    "0" =>  48
    "9" =>  57
    "A" =>  65
    "Z" =>  90
    "a" =>  97
    "z" => 122

## Array

### Make array from another

    [{p1:5}, {p1:10}, {p1:15}].map((e, i)=> i+":" + e.p1); // returns ["0:5", "1:10", "2:15"]
    
### Accumulate

    [3 , 5 , 2].reduce((a, e, i, arr) => a+=e, 0); // returns 10
    // where 
    //  a  : accumulator
    //  e  : array element
    //  i  : element index
    //  arr: the array   
