const express = require('express');
const fs = require('fs');

const app = express();

app.use(express.json());

// GET /data
app.get('/data', (req, res) => {
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({
                error: 'Error reading data.json'
            });
        }

        res.json(JSON.parse(data));
    });
});

// POST /update
app.post('/update', (req, res) => {
    const newData = req.body;

    fs.writeFile(
        'data.json',
        JSON.stringify(newData, null, 2),
        'utf8',
        (err) => {
            if (err) {
                return res.status(500).json({
                    error: 'Error writing data.json'
                });
            }

            res.json({
                message: 'Data updated successfully',
                data: newData
            });
        }
    );
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});