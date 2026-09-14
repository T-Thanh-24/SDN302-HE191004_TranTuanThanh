const fs = require("fs");

// Tạo file và ghi dữ liệu
fs.writeFile("demo.txt", "Hello NodeJS", (err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("File created successfully");
});