const express = require('express');
app = express()
const cors = require("cors")
const port = 5000
const fetch = require("isomorphic-fetch");
const cheerio = require("cheerio");

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

const DESCRIPTION = {};

app.get("/api", (req, res) => {
    const cityName = req.query.cityName;
    const description = DESCRIPTION[cityName];

    res.json({
        city: description.city,
        country: description.country,
        main: description.main,
        tempReal: description.tempReal,
        tempLike: description.tempLike,
        dateDay: description.dateDay,
        dateTimeNow: description.dateTimeNow,
        dateTimeZone: description.dateTimeZone,
        sunRise: description.sunRise,
        sunSet: description.sunSet,
        wind: description.wind,
        humidity: description.humidity,
        pressure: description.pressure,
        forecast: {
            "dayZero": {
                dayName: description.forecast[0].dayName,
                dayDate: description.forecast[0].dayDate,
                main: description.forecast[0].main,
                tempDay: description.forecast[0].tempDay,
                tempNight: description.forecast[0].tempNight
            },
            "dayOne": {
                dayName: description.forecast[1].dayName,
                dayDate: description.forecast[1].dayDate,
                main: description.forecast[1].main,
                tempDay: description.forecast[1].tempDay,
                tempNight: description.forecast[1].tempNight
            },
            "dayTwo": {
                dayName: description.forecast[2].dayName,
                dayDate: description.forecast[2].dayDate,
                main: description.forecast[2].main,
                tempDay: description.forecast[2].tempDay,
                tempNight: description.forecast[2].tempNight
            },
            "dayThree": {
                dayName: description.forecast[3].dayName,
                dayDate: description.forecast[3].dayDate,
                main: description.forecast[3].main,
                tempDay: description.forecast[3].tempDay,
                tempNight: description.forecast[3].tempNight
            },
            "dayFour": {
                dayName: description.forecast[4].dayName,
                dayDate: description.forecast[4].dayDate,
                main: description.forecast[4].main,
                tempDay: description.forecast[4].tempDay,
                tempNight: description.forecast[4].tempNight
            },
            "dayFive": {
                dayName: description.forecast[5].dayName,
                dayDate: description.forecast[5].dayDate,
                main: description.forecast[5].main,
                tempDay: description.forecast[5].tempDay,
                tempNight: description.forecast[5].tempNight
            },
            "daySix": {
                dayName: description.forecast[6].dayName,
                dayDate: description.forecast[6].dayDate,
                main: description.forecast[6].main,
                tempDay: description.forecast[6].tempDay,
                tempNight: description.forecast[6].tempNight
            },
            "daySeven": {
                dayName: description.forecast[7].dayName,
                dayDate: description.forecast[7].dayDate,
                main: description.forecast[7].main,
                tempDay: description.forecast[7].tempDay,
                tempNight: description.forecast[7].tempNight
            }
        }
    })

    console.log(`res 1: ${cityName}`);
    console.log(`res 2: ${description}`)
    //console.log(description);
})

app.post("/post_city", async (req, res) => {
    let {cityName} = req.body
    //console.log(cityName);

    async function app2() {
        const description = await getDescription(cityName);
        DESCRIPTION[cityName] = description;
        //console.log(description);
        res.json(description);
    }

    async function getDescription(symbol) {
        const response = await fetch(
            `https://yandex.eu/weather/${symbol}`
        );
        const text = await response.text();
        const $ = cheerio.load(text);

        try {
            const dateArr = $('time[class="time fact__time"]').attr('datetime').split(/(\s+)/).filter(function (e) {
                    return e.trim().length > 0;
                }
            );

            const forecast = {}
            forecast['day0'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(2) > a').attr("aria-label").split(", ")
            forecast['day1'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(3) > a').attr("aria-label").split(", ")
            forecast['day2'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(4) > a').attr("aria-label").split(", ")
            forecast['day3'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(5) > a').attr("aria-label").split(", ")
            forecast['day4'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(6) > a').attr("aria-label").split(", ")
            forecast['day5'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(7) > a').attr("aria-label").split(", ")
            forecast['day6'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(8) > a').attr("aria-label").split(", ")
            forecast['day7'] = $('div[aria-labelledby="forecast_briefly_title"] > :nth-child(3) > ul > li:nth-child(9) > a').attr("aria-label").split(", ")
            console.log(forecast);
            console.log(forecast['day0'][0])

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
                // forecast: [
                //     {
                //         dayName: forecast['day0'][0],
                //         dayDate: forecast['day0'][1],
                //         main: forecast['day0'][2],
                //         tempDay: forecast['day0'][3],
                //         tempNight: forecast['day0'][4]
                //     },
                //     {
                //         dayName: forecast['day1'][0],
                //         dayDate: forecast['day1'][1],
                //         main: forecast['day1'][2],
                //         tempDay: forecast['day1'][3],
                //         tempNight: forecast['day1'][4]
                //     },
                //     {
                //         dayName: forecast['day2'][0],
                //         dayDate: forecast['day2'][1],
                //         main: forecast['day2'][2],
                //         tempDay: forecast['day2'][3],
                //         tempNight: forecast['day2'][4]
                //     },
                //     {
                //         dayName: forecast['day3'][0],
                //         dayDate: forecast['day3'][1],
                //         main: forecast['day3'][2],
                //         tempDay: forecast['day3'][3],
                //         tempNight: forecast['day3'][4]
                //     },
                //     {
                //         dayName: forecast['day4'][0],
                //         dayDate: forecast['day4'][1],
                //         main: forecast['day4'][2],
                //         tempDay: forecast['day4'][3],
                //         tempNight: forecast['day4'][4]
                //     },
                //     {
                //         dayName: forecast['day5'][0],
                //         dayDate: forecast['day5'][1],
                //         main: forecast['day5'][2],
                //         tempDay: forecast['day5'][3],
                //         tempNight: forecast['day5'][4]
                //     },
                //     {
                //         dayName: forecast['day6'][0],
                //         dayDate: forecast['day6'][1],
                //         main: forecast['day6'][2],
                //         tempDay: forecast['day6'][3],
                //         tempNight: forecast['day6'][4]
                //     },
                //     {
                //         dayName: forecast['day7'][0],
                //         dayDate: forecast['day7'][1],
                //         main: forecast['day7'][2],
                //         tempDay: forecast['day7'][3],
                //         tempNight: forecast['day7'][4]
                //     }
                // ]
            }
            return obj;
        }
        catch (err) {
            console.log('Internal error, please try again')
        }
    }

    await app2();
    // res.status(200);
})

app.listen(port, () => {
    console.log(`Listening at http://localhost:${port}`)
})
