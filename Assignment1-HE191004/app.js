const express = require("express");

const articleRouter = require("./routers/articleRouter");
const commentRouter = require("./routers/commentRouter");

const app = express();

const PORT = 3000;

app.use(express.json());

app.use("/articles", articleRouter);

app.use("/comments", commentRouter);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});