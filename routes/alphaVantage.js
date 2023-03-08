var express = require("express");
var router = express.Router();
const request = require("request");
const { StringStream } = require("scramjet");

const {
    getStandardDeviation,
    getMedian,
    getVariance,
    getSkewness,
    calculateKurtosis,
    getQuartiles,
    getValueAtRisk,
} = require("../helpers/calculate");
require("dotenv").config();

const getRequestHeader = (qs) => {
    return {
        method: "GET",
        url: process.env.ALPHA_URL,
        qs,
        headers: {
            "X-RapidAPI-Key": process.env.ALPHA_API_KEY,
            "X-RapidAPI-Host": process.env.ALPHA_HOST,
            useQueryString: true,
        },
    };
};
/*
SAMPLE RETURN
var temp = {
    "Meta Data": {
        "1. Information": "Daily Prices (open, high, low, close) and Volumes",
        "2. Symbol": "MSFT",
        "3. Last Refreshed": "2023-02-17",
        "4. Output Size": "Compact",
        "5. Time Zone": "US/Eastern",
    },
    "Time Series (Daily)": {
        "2023-02-17": {
            "1. open": "259.3900",
            "2. high": "260.0900",
            "3. low": "256.0000",
            "4. close": "258.0600",
            "5. volume": "30000055",
        },
    },
};
*/

//CALENDAR Endpoints
router.get("/earnings", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "EARNINGS_CALENDAR";

    let response = [];
    request
        .get(`https://www.alphavantage.co/query?function=${func}&apikey=${key}`)
        .pipe(new StringStream())
        .CSVParse() // parse CSV output into row objects
        .consume((object) => response.push(object))
        .then(() => res.send(response));
});

router.get("/ipo", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "IPO_CALENDAR";

    let response = [];
    request
        .get(`https://www.alphavantage.co/query?function=${func}&apikey=${key}`)
        .pipe(new StringStream())
        .CSVParse() // parse CSV output into row objects
        .consume((object) => response.push(object))
        .then(() => res.send(response));
});

//Financial Based on Ticker
/* GET adjusted close prices with given ticker. */
router.get("/stats/:ticker", function (req, res, next) {
    let symbol = req.params.ticker.toUpperCase();
    const options = getRequestHeader({
        function: "TIME_SERIES_DAILY_ADJUSTED",
        symbol,
        outputsize: "compact",
        datatype: "json",
    });

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        if (response && response.statusCode == 200) {
            let data = Object.values(JSON.parse(body));
            var meta_data = data[0];

            var price_date = data[1];
            var close_prices = [];

            let dates = Object.keys(price_date);
            let prices = Object.values(price_date);
            let returns = [];
            let price_date_graph = [];

            prices.forEach((price, index) => {
                if (index > 0) {
                    let old_price = prices[index - 1];
                    returns.push(
                        Number(
                            (price["4. close"] - old_price["4. close"]).toFixed(
                                2
                            )
                        )
                    );
                }
                price_date_graph.push({
                    open: price["1. open"],
                    high: price["2. high"],
                    low: price["3. low"],
                    close: price["4. close"],
                    date: dates[index],
                });
                close_prices.push(price["4. close"]);
            });

            let min_price = Math.min(...close_prices);
            let max_price = Math.max(...close_prices);

            let { std, mean } = getStandardDeviation(close_prices);
            let median = getMedian(close_prices);
            let variance = getVariance(close_prices);
            let skewness = getSkewness(
                close_prices,
                close_prices.length,
                mean,
                std
            );

            let kurtosis = calculateKurtosis(close_prices, mean, std);
            let quartiles = getQuartiles(close_prices);
            let range = max_price - min_price;
            let valueAtRisk = getValueAtRisk(close_prices);

            res.send({
                current_test: "Value at Risk - Kurtosis ",
                valueAtRisk,
                quartiles,
                kurtosis,
                skewness,
                std,
                mean,
                median,
                variance,
                max_price,
                min_price,
                range,
                meta_data,
                returns,
                price_date_graph,
            });
        }
    });
});

router.get("/earnings/:ticker", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "EARNINGS";
    let symbol = req.params.ticker.toUpperCase();

    let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${key}`;
    request.get(
        {
            url,
            json: true,
            headers: { "User-Agent": "request" },
        },
        (err, response, data) => {
            if (err) {
                console.log("Error:", err);
            } else if (res.statusCode !== 200) {
                console.log("Status:", res.statusCode);
            } else {
                // data is successfully parsed as a JSON object:
                res.send(data);
            }
        }
    );
});

router.get("/cash_flow/:ticker", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "CASH_FLOW";
    let symbol = req.params.ticker.toUpperCase();

    let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${key}`;
    request.get(
        {
            url,
            json: true,
            headers: { "User-Agent": "request" },
        },
        (err, response, data) => {
            if (err) {
                console.log("Error:", err);
            } else if (res.statusCode !== 200) {
                console.log("Status:", res.statusCode);
            } else {
                // data is successfully parsed as a JSON object:
                res.send(data);
            }
        }
    );
});

router.get("/income_statement/:ticker", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "INCOME_STATEMENT";
    let symbol = req.params.ticker.toUpperCase();

    let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${key}`;
    request.get(
        {
            url,
            json: true,
            headers: { "User-Agent": "request" },
        },
        (err, response, data) => {
            if (err) {
                console.log("Error:", err);
            } else if (res.statusCode !== 200) {
                console.log("Status:", res.statusCode);
            } else {
                // data is successfully parsed as a JSON object:
                res.send(data);
            }
        }
    );
});

router.get("/overview/:ticker", function (req, res, next) {
    let key = process.env.ALPHA_API_KEY;
    let func = "OVERVIEW";
    let symbol = req.params.ticker.toUpperCase();

    let url = `https://www.alphavantage.co/query?function=${func}&symbol=${symbol}&apikey=${key}`;
    request.get(
        {
            url,
            json: true,
            headers: { "User-Agent": "request" },
        },
        (err, response, data) => {
            if (err) {
                console.log("Error:", err);
            } else if (res.statusCode !== 200) {
                console.log("Status:", res.statusCode);
            } else {
                // data is successfully parsed as a JSON object:
                res.send(data);
            }
        }
    );
});

module.exports = router;
