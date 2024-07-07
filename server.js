const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Article = require("./modles/article");
const path = require("path");
const articleRouter = require("./routes/articles");

const app = express();

// MongoDB connection
mongoose
  .connect("mongodb://0.0.0.0:27017/blog")
  .then(() => {
    console.log("Connection to MongoDB successfull");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

app.set("view engine", "ejs");

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Method override Middleware
app.use(methodOverride("_method"));

app.set("views", path.join(__dirname, "views"));
app.get("/", async (req, res) => {
  const articles = await Article.find().sort({ createdAt: "desc" });
  res.render("articles/index", { articles: articles });
});

app.use("/articles", articleRouter);

app.listen(3002, () => {
  console.log("Server is running on port 3002");
});
