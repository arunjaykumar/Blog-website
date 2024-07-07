const express = require("express");
const Article = require("./../modles/article");
const router = express.Router();

// Route to display the form for creating a new article
router.get("/new", (req, res) => {
  res.render("articles/new", { article: new Article() });
});

router.get("/edit/:id", async (req, res) => {
  const article = await Article.findById(req.params.id);
  res.render("articles/edit", { article: article });
});
// Route to display a specific article by its Slug
router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article === null) {
      console.log(`Article with Slug ${req.params.id} not found.`);
      return res.redirect("/");
    } else {
      res.render("articles/show", { article: article });
    }
  } catch (e) {
    console.error("Error fetching article by slug:", e);
    res.redirect("/");
  }
});

// Delete article by id
router.delete("/:id", async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (article === null) {
      console.log(`Article with id ${req.params.id} not found.`);
      return res.redirect("/");
    } else {
      res.redirect("/");
    }
  } catch (e) {
    console.error("Error deleting article by id:", e);
    res.redirect("/");
  }
});

// Route to handle the creation of a new article
router.post(
  "/",
  async (req, res, next) => {
    req.article = new Article();
    next();
  },
  saveArticle("new")
);

router.put(
  "/:id",
  async (req, res, next) => {
    req.article = await Article.findById(req.params.id);
    next();
  },
  saveArticle("edit")
);

function saveArticle(path) {
  return async (req, res) => {
    let article = req.article;
    article.title = req.body.title;
    article.description = req.body.description;
    article.markdown = req.body.markdown;

    try {
      await article.save();
      res.redirect(`/articles/${article.slug}`);
    } catch (e) {
      console.error("Error saving article:", e);
      res.render(`articles/${path}`, { article: article });
    }
  };
}
module.exports = router;
