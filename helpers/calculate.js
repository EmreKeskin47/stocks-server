//documentation https://jstat.github.io/all.html#skewness
var { jStat } = require("jstat");

const getStandardDeviation = (arr) => {
    let data = arr.map((i) => Number(i));
    const mean = jStat.mean(data);
    const std = jStat.stdev(data, true);
    return { mean, std };
};

const getMedian = (arr) => {
    if (arr.length === 0) throw new Error("No inputs");
    let values = arr.map((i) => Number(i));
    return jStat.median(values);
};

const getVariance = (array = []) => {
    let arr = array.map((i) => Number(i));
    return jStat.variance(arr);
};

// Function to calculate skewness.
function getSkewness(array, n, mean, standard) {
    // Find skewness using
    // above formula
    let arr = array.map((i) => Number(i));

    // return sum / (n * standard * standard * standard);
    let skewness =
        arr.reduce(
            (acc, val) => acc + Math.pow((val - mean) / standard, 3),
            0
        ) *
        (n / ((n - 1) * (n - 2)));

    let skew_jstat = jStat.skewness(arr, n);
    return { skewness, skew_jstat };
}

function calculateKurtosis(arr, mean, stdDev) {
    let array = arr.map((i) => Number(i));
    const n = array.length;

    const fourthMoment =
        array.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / n;

    // Calculate the kurtosis
    let kurtosis = fourthMoment / Math.pow(stdDev, 4) - 3;
    let kurtosis_jstat = jStat.kurtosis(array);
    return { kurtosis, kurtosis_jstat };
}

const getValueAtRisk = (arr) => {
    // Calculate the daily returns from the dataset
    let data = arr.map((i) => Number(i));

    const confidenceLevel = 0.95;

    // Historical VaR
    const sortedData = data.slice().sort((a, b) => a - b);
    const index = Math.floor(sortedData.length * (1 - confidenceLevel));
    const historicalVaR = sortedData[index];

    // Analytical VaR assuming normal distribution
    const mean = jStat.mean(data);
    const stdDev = jStat.stdev(data, true);
    const zScore = jStat.normal.inv(1 - confidenceLevel, 0, 1);
    const analyticalVaR = mean - zScore * stdDev;

    return { historicalVaR, analyticalVaR };
};

function getQuartiles(arr) {
    let data = arr.map((i) => Number(i));

    // sort the data in ascending order
    data.sort((a, b) => a - b);

    // find the median (Q2)
    let medianIndex = Math.floor(data.length / 2);
    let Q2 = data[medianIndex];

    // find the first quartile (Q1)
    let Q1;
    let lowerHalf = data.slice(0, medianIndex);
    if (lowerHalf.length % 2 === 0) {
        Q1 =
            (lowerHalf[lowerHalf.length / 2 - 1] +
                lowerHalf[lowerHalf.length / 2]) /
            2;
    } else {
        Q1 = lowerHalf[Math.floor(lowerHalf.length / 2)];
    }

    // find the third quartile (Q3)
    let Q3;
    let upperHalf = data.slice(medianIndex + (data.length % 2 === 0 ? 0 : 1));
    if (upperHalf.length % 2 === 0) {
        Q3 =
            (upperHalf[upperHalf.length / 2 - 1] +
                upperHalf[upperHalf.length / 2]) /
            2;
    } else {
        Q3 = upperHalf[Math.floor(upperHalf.length / 2)];
    }

    let IQR = Q3 - Q1;
    let quartiles_jstat = jStat.quantiles(data, data.length);
    console.log(quartiles_jstat);

    return {
        Q1,
        Q2,
        Q3,
        IQR,
    };
}

module.exports = {
    getStandardDeviation,
    getMedian,
    getVariance,
    getSkewness,
    calculateKurtosis,
    getQuartiles,
    getValueAtRisk,
};
