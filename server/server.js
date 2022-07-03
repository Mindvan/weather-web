const express = require('express');
const app = express()

// app.get("/api", (req, res) =>
// {
//     res.json({"users": ["1", "2", "5", "10", "110"]})
// })

const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");
const symbols = ["moscow"];

async function app2() {
    for await (let symbol of symbols) {
        const description = await getDescription(symbol);
        app.get("/api", (req, res) => {
            res.json({
                    city: description.city,
                    country: description.country,
                    main: description.main,
                    tempReal:  description.tempReal,
                    tempLike:  description.tempLike,
                    dateDay: description.dateDay,
                    dateTimeNow: description.dateTimeNow,
                    dateTimeZone: description. dateTimeZone,
                    sunRise: description.sunRise,
                    sunSet: description.sunSet,
                    wind: description.wind,
                    humidity: description.humidity,
                    pressure: description.pressure
            })
        })
    }
}

async function getDescription(symbol) {
    const response = await fetch(
        `https://yandex.eu/weather/${symbol}`
    );
    const text = await response.text();
    const $ = cheerio.load(text);

    const dateArr = $('time[class="time fact__time"]').attr('datetime').split(/(\s+)/).filter( function(e)
        {
            return e.trim().length > 0;
        }
        );


    // const sunInfoArr = Array.from(sunInfo);

    const cityDate = dateArr[0].toString();
    const obj = {

        city: $("ol[class=\"breadcrumbs__list\"] > li:last-child").text().trim().replace(/[^a-zA-Z._-]/g, ""),
        country: $("ol[class=\"breadcrumbs__list\"] > li:first-child").text().trim().replace(/[^a-zA-Z ]/g, ""),
        main: $('div[aria-labelledby="main_title"] > div > a > div > div[class="link__feelings fact__feelings"] > :first-child').text().trim(),
        tempReal: $('div[class="temp fact__temp fact__temp_size_s"] > :first-child').text().trim(),
        tempLike: $('div[class="term term_orient_h fact__feels-like"] > :last-child > div > span').text().trim(),
        dateDay: new Date(cityDate).toDateString(),
        dateTimeNow: dateArr[1].toString().substring(0, 5),
        dateTimeZone: dateArr[1].toString().substring(5, dateArr[1].length),
        sunRise: $('.sun-card__sunrise-sunset-info-wrapper > :first-child').clone()
            .children()
            .remove()
            .end()
            .text(),
        sunSet: $('.sun-card__sunrise-sunset-info-wrapper > :last-child').clone()
            .children()
            .remove()
            .end()
            .text(),
        wind: $('div[class="fact__props"] > :nth-child(1) > span').text().trim(),
        humidity: $('div[class="fact__props"] > :nth-child(2) > span').text().trim(),
        pressure: $('div[class="fact__props"] > :nth-child(3) > span').text().trim(),
    }
    return obj;
}

app2();

app.listen(4000, () => { console.log('server started on port 4000')})


//-------------------check
// const express = require('express');
// const app = express()
//
// const fetch = require("isomorphic-fetch");
// const cheerio = require("cheerio");
//
// const symbols = ["moscow", "chicago"];
//
// async function app2() {
//     for await (let symbol of symbols) {
//         const description = await getDescription(symbol);
//         app.get("/api", (req, res) => {
//             res.json( {symbol, description })
//         })
//     }
// }
//
// async function getDescription(symbol) {
//     const response = await fetch(
//         `https://yandex.eu/weather/${symbol}`
//     );
//     const text = await response.text();
//     const $ = cheerio.load(text);
//     return $("div[class=\"fact__title\"] > div > h1").text().trim();
// }
//
// app2();
//
// app.listen(5000, () => { console.log('server started on port 5000')})
