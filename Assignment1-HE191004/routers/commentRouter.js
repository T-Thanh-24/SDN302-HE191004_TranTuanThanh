const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const dataPath = path.join(__dirname, "..", "data.json");

function readData() {
    const data = fs.readFileSync(dataPath, "utf8");

    return JSON.parse(data);
}

function writeData(data) {
    fs.writeFileSync(
        dataPath,
        JSON.stringify(data, null, 2),
        "utf8"
    );
}

router.get("/", (req, res) => {

    const data = readData();

    res.status(200).json(data.comments);

});

router.get("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);

    const comment = data.comments.find(
        comment => comment.id === id
    );


    if (!comment) {

        return res.status(404).json({
            message: "Comment not found"
        });

    }

    res.status(200).json(comment);

});

router.post("/", (req, res) => {

    const data = readData();

    const {
        articleId,
        author,
        content,
        date
    } = req.body;

    if (!articleId || !author || !content || !date) {

        return res.status(400).json({
            message: "articleId, author, content and date are required"
        });

    }

    const article = data.articles.find(
        article => article.id === parseInt(articleId)
    );


    if (!article) {

        return res.status(404).json({
            message: "Article not found"
        });

    }

    let newId = 1;

    if (data.comments.length > 0) {

        newId =
            Math.max(
                ...data.comments.map(comment => comment.id)
            ) + 1;

    }

    const newComment = {

        id: newId,
        articleId: parseInt(articleId),
        author: author,
        content: content,
        date: date

    };

    data.comments.push(newComment);

    writeData(data);

    res.status(201).json(newComment);

});

router.put("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);


    const comment = data.comments.find(
        comment => comment.id === id
    );

    if (!comment) {

        return res.status(404).json({
            message: "Comment not found"
        });

    }

    const {
        articleId,
        author,
        content,
        date
    } = req.body;

    if (articleId !== undefined) {

        const article = data.articles.find(
            article => article.id === parseInt(articleId)
        );

        if (!article) {

            return res.status(404).json({
                message: "Article not found"
            });

        }

        comment.articleId = parseInt(articleId);

    }

    if (author !== undefined) {
        comment.author = author;
    }

    if (content !== undefined) {
        comment.content = content;
    }

    if (date !== undefined) {
        comment.date = date;
    }

    writeData(data);

    res.status(200).json(comment);

});


router.delete("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);


    const index = data.comments.findIndex(
        comment => comment.id === id
    );


    if (index === -1) {

        return res.status(404).json({
            message: "Comment not found"
        });

    }

    const deletedComment =
        data.comments.splice(index, 1)[0];

    writeData(data);

    res.status(200).json({
        message: "Comment deleted successfully",
        comment: deletedComment
    });

});

module.exports = router;