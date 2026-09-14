const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {

    if (req.url === "/") {

        fs.readFile(
            path.join(__dirname, "index.html"),
            (err, data) => {

                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        );

    } else if (req.url === "/about") {

        fs.readFile(
            path.join(__dirname, "about.html"),
            (err, data) => {

                if (err) {
                    res.writeHead(500);
                    res.end("Server Error");
                    return;
                }

                res.writeHead(200, {
                    "Content-Type": "text/html"
                });

                res.end(data);
            }
        );

    } else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end("<h1>404 Not Found</h1>");
    }
});

server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});