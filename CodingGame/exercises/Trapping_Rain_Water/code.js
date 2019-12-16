const heights = readline().split(" ").map(value => parseFloat(value));

function computeLiters(heights) {

    if (heights.length < 3)
        return 0;

    function computeLitersInRange(indexA, indexB) {
        const thd = Math.min(heights[indexA], heights[indexB]);
        let liters = 0;
        for (let i = indexA + 1; i <= indexB - 1; i++) {
            liters += thd - heights[i];
        }
        return liters;
    }

    let result = 0;

    mainLoop:
        for (let i = 0; i < heights.length - 1; i++) {

            if (heights[i + 1] >= heights[i]) // Next is increasing (can't be the beginning of a hole)
                continue;

            let maxTmp;
            let maxIndex;
            for (let j = i + 2; j < heights.length; j++) {
                if (heights[j] >= heights[i]) {
                    result += computeLitersInRange(i, j);
                    i = j - 1;
                    continue mainLoop;
                }

                if (heights[j] > heights[i + 1] && (maxTmp === undefined || heights[j] > maxTmp)) {
                    maxTmp = heights[j];
                    maxIndex = j;
                }
            }

            if (maxTmp !== undefined) {
                result += computeLitersInRange(i, maxIndex);
                i = maxIndex - 1;
            }

        }

    return result;
}

print(computeLiters(heights))