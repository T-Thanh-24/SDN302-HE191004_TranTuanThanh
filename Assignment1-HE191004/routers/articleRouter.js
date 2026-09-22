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

    res.status(200).json(data.articles);

});

router.get("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);

    const article = data.articles.find(
        article => article.id === id
    );

    if (!article) {

        return res.status(404).json({
            message: "Article not found"
        });

    }

    res.status(200).json(article);

});

router.post("/", (req, res) => {

    const data = readData();

    const {
        title,
        content,
        author,
        date
    } = req.body;


    if (!title || !content || !author || !date) {

        return res.status(400).json({
            message: "title, content, author and date are required"
        });

    }

    let newId = 1;

    if (data.articles.length > 0) {

        newId =
            Math.max(
                ...data.articles.map(article => article.id)
            ) + 1;

    }

    const newArticle = {

        id: newId,
        title: title,
        content: content,
        author: author,
        date: date

    };


    data.articles.push(newArticle);

    writeData(data);

    res.status(201).json(newArticle);

});



router.put("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);


    const article = data.articles.find(
        article => article.id === id
    );



    if (!article) {

        return res.status(404).json({
            message: "Article not found"
        });

    }


    const {
        title,
        content,
        author,
        date
    } = req.body;



    if (title !== undefined) {
        article.title = title;
    }

    if (content !== undefined) {
        article.content = content;
    }

    if (author !== undefined) {
        article.author = author;
    }

    if (date !== undefined) {
        article.date = date;
    }


    writeData(data);


    res.status(200).json(article);

});



router.delete("/:id", (req, res) => {

    const data = readData();

    const id = parseInt(req.params.id);

    const index = data.articles.findIndex(
        article => article.id === id
    );


    if (index === -1) {

        return res.status(404).json({
            message: "Article not found"
        });

    }


    const deletedArticle =
        data.articles.splice(index, 1)[0];


    writeData(data);


    res.status(200).json({
        message: "Article deleted successfully",
        article: deletedArticle
    });

});


module.exports = router;