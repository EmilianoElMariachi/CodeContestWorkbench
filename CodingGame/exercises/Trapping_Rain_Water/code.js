const heights = readline().split(" ").map(value => parseFloat(value));

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
    let i = heightRefIndex;
    let result = 0;
    while (++i < heights.length) {

        if (heights[i] >= heights[heightRefIndex] || (heightRefIndex < heights.length - 1 && heights[i] > heights[heightRefIndex + 1]) && i !== heightRefIndex + 1) {
            result += computeLitersInRange(heightRefIndex, i);
            heightRefIndex = i;
        } else if (i >= (heights.length - 1)) {
            heightRefIndex++;
            i = heightRefIndex;
        }
    }

    return result;
}

print(computeLiters(heights))