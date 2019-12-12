const x = parseInt(readline());
const r = parseInt(readline());

const solNum = 2;

// Sol 1:
if (solNum == 1) {
    const exp = Math.pow(r, 1.0 / x);
    console.log(exp);
}

// Sol 2:
else if (solNum == 2) {

    if (r === 1)
        console.log("0");
    else {
        let nTmp = x;
        let exp = 1;
        while (nTmp < r) {
            nTmp = nTmp * x;
            exp++;
        }

        console.log(exp);
    }
}