const { MongoClient } = require("mongodb");

const database_url =
  "mongodb+srv://vikas:vikas@cluster0.9jrwxwh.mongodb.net/bharatbuzzfeed-backend?retryWrites=true&w=majority";

const client = new MongoClient(database_url);

const db = client.db();
const News = db.collection("news");

module.exports = {
  db,
  News,
};
