const [tx, ty] = readline().split(" ").map(value => parseFloat(value));

let nbTriangles = parseInt(readline());


while (nbTriangles--) {
    const [x1, y1, x2, y2, x3, y3] = readline().split(" ").map(value => parseFloat(value))

    const eq1 = getEq(x1, y1, x2, y2);
    const eq2 = getEq(x2, y2, x3, y3);
    const eq3 = getEq(x3, y3, x1, y1);

    const d1 = y3 > eq1(x3) ? 1 : -1;
    const d2 = y1 > eq2(x1) ? 1 : -1;
    const d3 = y2 > eq3(x2) ? 1 : -1;

    let b1 = ty * d1 >= eq1(tx) * d1;
    let b2 = ty * d2 >= eq2(tx) * d2;
    let b3 = ty * d3 >= eq3(tx) * d3;
    const r = b1 && b2 && b3
    if (r)
        print("inside")
    else
        print("outside")
}


function getEq(x1, y1, x2, y2) {
    const a = (y2 - y1) / (x2 - x1);
    const b = y1 - a * x1;
    const f = function (x) {
        return a * x + b;
    }

    f.a = a;
    f.b = b;

    return f;
}
