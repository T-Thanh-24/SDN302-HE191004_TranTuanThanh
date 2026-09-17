const express = require('express');

const app = express();

const PORT = 3002;

// Middleware
app.use(express.json());

// Import video router
const videoRouter = require('./ex3/routes/videos');

// Use video router
app.use('/videos', videoRouter);

// Home route
app.get('/', (req, res) => {
    res.send('EX3 Videos API is running!');
});

// Start server
app.listen(PORT, () => {
    console.log(`EX3 server is running on port ${PORT}`);
});