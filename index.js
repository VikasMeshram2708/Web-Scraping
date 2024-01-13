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
    $(".eachStory", html).each(function () {
      const newsTitle = $(this).find("h3").text();
      const newsContent = $(this).text();
      const imageUrl =  $('.eachStory .imgContainer img').attr('src');

      currentNews.push({
        newsId:Math.floor(Math.random() * 90000),
        title: newsTitle,
        content: newsContent,
        imageUrl:imageUrl,
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
