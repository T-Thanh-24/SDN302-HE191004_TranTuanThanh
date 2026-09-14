const http = require("http");
require("./file");

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        "Content-Type": "text/plain"
    });

    res.end("File server is running...");
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});