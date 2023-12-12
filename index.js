const express = require("express");

require("dotenv").config();

const app = express();

const axios = require("axios");

const cheerio = require("cheerio");

// middlewares
app.use(express.json());

const { URL } = process.env;

const currentNews = [];

axios(URL)
  .then((res) => {
    const html = res.data;
    //   console.log(html);
    const $ = cheerio.load(html);
    const title = $("h3", html).each(function () {
      const newTitle = $(this).text();
      const newwsURL = $(this).find("a").attr("href");

      currentNews.push({
        newTitle,
        newwsURL,
      });
    });

    console.log(currentNews);
  })
  .catch((err) => console.log(err));

app.get("/news", (req, res) => {
  res.json({ currentNews });
});

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
