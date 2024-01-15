const express = require("express");

require("dotenv").config();

const app = express();

const axios = require("axios");

const cheerio = require("cheerio");

const { News, db } = require("./db");

const { default: rateLimit } = require("express-rate-limit");

// middlewares
app.use(express.json());

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  limit: 90, // Limit each IP to 100 requests per `window` (here, per 1 minutes).
  standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
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
      const imageUrl = $(".eachStory .imgContainer img").attr("src");

      currentNews.push({
        newsId: Math.floor(Math.random() * 90000),
        title: newsTitle,
        content: newsContent,
        imageUrl: imageUrl,
      });
    });

    // console.log(currentNews);
  })
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.json({
    message: "Hello,from server!",
  });
});

app.post("/news", async (req, res) => {
  const items = News.insertOne({ currentNews });
  res.json({ message: "Successfully inserted to Db" });
});

app.post("/removePrevNews", async (req, res) => {
  try {
    await News.deleteMany({});
    res.json({
      message: "Successfully deleted the previous news data...",
    });
    console.log("Successfully deleted the previous news data...");
  } catch (error) {
    res.json({
      message: `Error Deleting Previous News Data: ${error?.message}`,
    });
  }
});

async function sendRequestToDeleteApiRoute() {
  try {
    await News.deleteMany({});
    console.log("Successfully deleted the previous news data...");
  } catch (error) {
    console.log("Successfully deleted the previous news data...");
  }
}

// setInterval(() => {
//   sendRequestToDeleteApiRoute();
//   console.log("server refreshed successfully");
// }, 1 * 60 * 1000);

app.get("/getAllNews", limiter, async (req, res) => {
  try {
    // const items = await db.listCollections().toArray();
    const items = await News.find({}).toArray();
    // console.log(items);
    res.json({
      items,
      success: true,
    });
  } catch (error) {
    res.json({
      message: `Error fetching news : ${error?.message}`,
    });
  }
});

// app.get("/getAllNews", limiter, async (req, res) => {
//   try {
//     // const items = await db.listCollections().toArray();
//     const items = await News.find({}).toArray();
//     // console.log(items);
//     res.json({
//       items,
//       success: true,
//     });
//   } catch (error) {
//     res.json({
//       message: `Error fetching news : ${error?.message}`,
//     });
//   }
// });

const port = process.env.PORT || 5002;
app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`);
});
