const heights = readline().split(" ").map(value => parseInt(value));

function computeLiters(heights) {

    function computeLitersInRange(indexA, indexB) {
        const thd = Math.min(heights[indexA], heights[indexB]);
        let liters = 0;
        for (let i = indexA + 1; i <= indexB - 1; i++) {
            liters += thd - heights[i];
        }
        return liters;
    }


    let heightRefIndex = 0;
    let heightRef = heights[heightRefIndex];
    let i = heightRefIndex;
    let result = 0;
    while (++i < heights.length) {

        const heightTmp = heights[i];
        if (heightTmp >= heightRef) {
            result += computeLitersInRange(heightRefIndex, i);
            heightRef = heightTmp;
            heightRefIndex = i;
        } else if (i >= (heights.length - 1)) {
            heightRefIndex++;
            heightRef = heights[heightRefIndex];
            i = heightRefIndex;
        }
    }

    return result;
}

print(computeLiters(heights))