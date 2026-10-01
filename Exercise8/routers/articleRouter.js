const express = require("express");

const router = express.Router();

let articles = [
  {
    id: 1,
    title: "My Favorite Vacation",
    date: "2023-06-02",
    text: "We spent seven days in Italy and visited Rome, Florence, and Venice."
  },
  {
    id: 2,
    title: "Learning Node.js",
    date: "2026-09-01",
    text: "Node.js allows developers to build fast server-side applications."
  }
];

// GET all articles
router.get("/", (req, res) => {
  res.status(200).json(articles);
});

// GET article by ID
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const article = articles.find(item => item.id === id);

    if (!article) {
      const error = new Error("Article not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(article);
  } catch (error) {
    next(error);
  }
});

// POST a new article
// Custom middleware is executed before the route handler.
router.post(
  "/",
  (req, res, next) => {
    try {
      const { title, date, text } = req.body;

      // For Exercise 8 testing: deliberately create a server error
      // by sending {"title":"ERROR", ...}.
      if (title === "ERROR") {
        throw new Error("Simulated article saving error");
      }

      const newArticle = {
        id: articles.length
          ? Math.max(...articles.map(article => article.id)) + 1
          : 1,
        title,
        date,
        text
      };

      articles.push(newArticle);

      res.status(201).json({
        message: "Article saved successfully",
        article: newArticle
      });
    } catch (error) {
      // Error propagation to centralized error middleware
      next(error);
    }
  }
);

// PUT article
router.put(
  "/:id",
  (req, res, next) => {
    try {
      const id = Number(req.params.id);
      const index = articles.findIndex(item => item.id === id);

      if (index === -1) {
        const error = new Error("Article not found");
        error.status = 404;
        return next(error);
      }

      articles[index] = {
        id,
        title: req.body.title,
        date: req.body.date,
        text: req.body.text
      };

      res.status(200).json({
        message: "Article updated successfully",
        article: articles[index]
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE article
router.delete("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const index = articles.findIndex(item => item.id === id);

    if (index === -1) {
      const error = new Error("Article not found");
      error.status = 404;
      return next(error);
    }

    const deletedArticle = articles.splice(index, 1)[0];

    res.status(200).json({
      message: `Deleting article: ${id}`,
      article: deletedArticle
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;