const express = require('express');

const app = express();

const PORT = 3001;

// Middleware to parse JSON
app.use(express.json());

// Import articles data
const articles = require('./articles');

// GET - Get all articles
app.get('/articles', (req, res) => {
    res.json(articles);
});

// GET - Get article by ID
app.get('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const article = articles.find(article => article.id === id);

    if (!article) {
        return res.status(404).json({
            message: 'Article not found'
        });
    }

    res.json(article);
});

// POST - Add a new article
app.post('/articles', (req, res) => {
    const newArticle = {
        id: articles.length > 0
            ? Math.max(...articles.map(article => article.id)) + 1
            : 1,
        title: req.body.title,
        author: req.body.author,
        content: req.body.content
    };

    articles.push(newArticle);

    res.status(201).json(newArticle);
});

// PUT - Update an article
app.put('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const article = articles.find(article => article.id === id);

    if (!article) {
        return res.status(404).json({
            message: 'Article not found'
        });
    }

    article.title = req.body.title ?? article.title;
    article.author = req.body.author ?? article.author;
    article.content = req.body.content ?? article.content;

    res.json(article);
});

// DELETE - Delete an article
app.delete('/articles/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = articles.findIndex(article => article.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Article not found'
        });
    }

    const deletedArticle = articles.splice(index, 1);

    res.json({
        message: 'Article deleted successfully',
        article: deletedArticle[0]
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`EX2 server is running on port ${PORT}`);
});