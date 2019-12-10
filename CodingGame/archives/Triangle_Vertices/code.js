const [tx, ty] = readline().split(" ").map(value => parseFloat(value));

let nbTriangles = parseInt(readline());

function isPointInTriangle(p, p0, p1, p2) {
    // Taken from https://stackoverflow.com/a/20861130/4977176
    const s = p0.Y * p2.X - p0.X * p2.Y + (p2.Y - p0.Y) * p.X + (p0.X - p2.X) * p.Y;
    const t = p0.X * p1.Y - p0.Y * p1.X + (p0.Y - p1.Y) * p.X + (p1.X - p0.X) * p.Y;

    if ((s < 0) != (t < 0))
        return false;

    const A = -p1.Y * p2.X + p0.Y * (p2.X - p1.X) + p0.X * (p1.Y - p2.Y) + p1.X * p2.Y;

    return A < 0 ?
        (s <= 0 && s + t >= A) :
        (s >= 0 && s + t <= A);
}

while (nbTriangles--) {
    const [x1, y1, x2, y2, x3, y3] = readline().split(" ").map(value => parseFloat(value))

    if (isPointInTriangle({X: tx, Y: ty}, {X: x1, Y: y1}, {X: x2, Y: y2}, {X: x3, Y: y3}))
        print("inside")
    else
        print("outside")
}
