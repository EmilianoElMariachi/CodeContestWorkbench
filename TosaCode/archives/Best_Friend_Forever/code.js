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

function dspInput() {
    console.error("=================================")
    for (var i in input) {
        console.error(input[i])
    }
}


function ContestResponse() {
    dspInput();

    var nbUsersInSite = parseInt(input[0].split(" ")[0]);
    var nbRel = parseInt(input[0].split(" ")[1]);

    var reseau = [];
    input[1].split(" ").forEach((value, index) => {
        reseau.push({
            id: index + 1,
            type: value === "1" ? "S" : "L",
            rels: []
        })
    });

    for (var i = 0; i < nbRel; i++) {
        var tmp = input[i + 2].split(" ");
        var id1 = parseInt(tmp[0]);
        var id2 = parseInt(tmp[1]);
        reseau.find(value => value.id === id1).rels.push(id2);
        reseau.find(value => value.id === id2).rels.push(id1);

    }

    var scientists = reseau.filter(value => value.type === "S");
    var litteraires = reseau.filter(value => value.type === "L");

    var couples = [];
    scientists.forEach(scientist => {
        litteraires.forEach(litteraire => {
            var nbCR = getNumberOfCommonRels(scientist, litteraire);
            if (nbCR > 0) {
                couples.push({
                    id1: scientist.id,
                    id2: litteraire.id,
                    couple: scientist.id + " " + litteraire.id,
                    nbCommonRels: nbCR
                });
            }
        });
    });

    // couples = couples.sort((a, b) => a.id1 - b.id1)

    var couplesSorted = couples.sort((c1, c2) => {
        return (c2.nbCommonRels - c1.nbCommonRels)
    });

    var i = 0;
    while (i < couplesSorted.length) {
        var coupleRef = couplesSorted[i];
        rmCouples(couplesSorted, i + 1, coupleRef.id1, coupleRef.id2);
        i++;
    }

    var resu = couplesSorted.map((value, index, array) => value.couple).join(",")

    console.log(resu)
}

function rmCouples(couplesSorted, startIndex, id1, id2) {
    var i = startIndex;
    while (i < couplesSorted.length) {

        let coupleTmp = couplesSorted[i];
        if (coupleTmp.id1 === id1 || coupleTmp.id1 === id2 || coupleTmp.id2 === id1 || coupleTmp.id2 === id2) {
            couplesSorted.splice(i, 1);
        } else {
            i++;
        }
    }
}

function getNumberOfCommonRels(m1, m2) {
    var nbCommonRels = 0;
    m1.rels.forEach(relId => {
        if (m2.rels.includes(relId)) {
            nbCommonRels++;
        }
    });

    return nbCommonRels;
}