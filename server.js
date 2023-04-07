const Port = 4000;
const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const eve = express();

const newspapers = [
    {
        name: "The Times",
        address: "https://www.thetimes.co.uk/environment",
        base: "",
    },
    {
        name: "Guardian",
        address: "https://www.theguardian.com/us/environment",
        base: "",
    },
    {
        name: "Telegraph",
        address: "https://www.telegraph.co.uk/environment",
        base: "https://www.telegraph.co.uk",
    },
];

const articles = [];

newspapers.forEach((newspaper) => {
    axios.get(newspaper.address).then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("climate")', html).each(function () {
            const title = $(this).text();
            const URL = $(this).attr("href");

            articles.push({
                source: newspaper.name,
                title,
                URL: newspaper.base + URL,
            });
        });
    });
});

// Serve the HTML page with the scraped information
eve.get("/", (req, res) => {
    let html =
        '<html><head><title>Scraped Information</title></head><body><table><thead><tr><th>Source</th><th>Title</th><th>URL</th></tr></thead><tbody id="payload">';

    articles.forEach((article) => {
        html += `<tr><td>${article.source}</td><td>${article.title}</td><td>${article.URL}</td></tr>`;
    });

    html += "</tbody></table></body></html>";

    res.send(html);
});

eve.listen(Port, () => console.log(`Server running on port ${Port}`));
