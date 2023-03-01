var express = require("express");
var router = express.Router();
const request = require("request");

let key = process.env.ALPHA_API_KEY;
let host = process.env.ALPHA_HOST;

//SMA
//url for call http://localhost:3000/technical/sma?symbol=IBM&interval=weekly&time_period=10

router.get("/sma", function (req, res, next) {
    let data = {
        symbol: req.params.symbol || "IBM",
        interval: req.params.interval || "weekly",
        time_period: req.params.period || "10",
        series_type: req.params.series || "open",
    };

    var url = `https://www.alphavantage.co/query?function=SMA&symbol=${data.symbol}&interval=${data.interval}&time_period=${data.time_period}&series_type=${data.series_type}&apikey=${key}`;

    request.get(
        {
            url: url,
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

//SMA
//url for call http://localhost:3000/technical/ema?symbol=IBM&interval=weekly&time_period=10

router.get("/ema", function (req, res, next) {
    let data = {
        symbol: req.params.symbol || "IBM",
        interval: req.params.interval || "weekly",
        time_period: req.params.period || "10",
        series_type: req.params.series || "open",
    };

    var url = `https://www.alphavantage.co/query?function=EMA&symbol=${data.symbol}&interval=${data.interval}&time_period=${data.time_period}&series_type=${data.series_type}&apikey=${key}`;

    request.get(
        {
            url: url,
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

router.get("/macd", function (req, res, next) {
    let data = {
        symbol: req.params.symbol || "IBM",
        interval: req.params.interval || "weekly",
        time_period: req.params.period || "10",
    };

    var url = `https://www.alphavantage.co/query?function=MACD&symbol=${data.symbol}&interval=${data.interval}&time_period=${data.time_period}&series_type=${data.series_type}&apikey=${key}`;

    request.get(
        {
            url: url,
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

router.get("/wma", function (req, res, next) {
    let data = {
        symbol: req.params.symbol || "IBM",
        interval: req.params.interval || "weekly",
        time_period: req.params.period || "10",
        series_type: req.params.series || "open",
    };

    var url = `https://www.alphavantage.co/query?function=WMA&symbol=${data.symbol}&interval=${data.interval}&time_period=${data.time_period}&series_type=${data.series_type}&apikey=${key}`;

    request.get(
        {
            url: url,
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

router.get("/vwap", function (req, res, next) {
    let data = {
        symbol: req.params.symbol || "IBM",
        interval: req.params.interval || "weekly",
        time_period: req.params.period || "10",
    };

    var url = `https://www.alphavantage.co/query?function=VWAP&symbol=${data.symbol}&interval=${data.interval}&time_period=${data.time_period}&series_type=${data.series_type}&apikey=${key}`;

    request.get(
        {
            url: url,
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
