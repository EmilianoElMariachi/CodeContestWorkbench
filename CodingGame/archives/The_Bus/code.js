/**
 * Auto-generated code below aims at helping you parse
 * the standard input according to the problem statement.
 **/

const nbBusStops = parseInt(readline());
const inputs = readline().split(' ');

let personId = 0;
const personIds = {};

for (let busStopIndex = 0; busStopIndex < nbBusStops; busStopIndex++) {
    let nbPersEnteringAtBusStop = parseInt(inputs[busStopIndex]);

    for (let j = 0; j < nbPersEnteringAtBusStop; j++) {
        personIds[personId++] = busStopIndex;
    }
}

let nbStayPerPersId = readline().split(" ").map(e => parseInt(e));

let nbPersAtTerminus = 0;
nbStayPerPersId.forEach((nbStay, persId) => {
    const enterAtStop = personIds[persId];
    if (enterAtStop + nbStay >= nbBusStops) {
        nbPersAtTerminus++;
    }
});

// Write an action using console.log()
// To debug: console.error('Debug messages...');

console.log(nbPersAtTerminus);