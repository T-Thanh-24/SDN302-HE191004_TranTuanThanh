const express = require('express');

const router = express.Router();

let videos = require('../videos');

// GET all videos
router.get('/', (req, res) => {
    res.json(videos);
});

// GET video by ID
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const video = videos.find(video => video.id === id);

    if (!video) {
        return res.status(404).json({
            message: 'Video not found'
        });
    }

    res.json(video);
});

// POST - Add new video
router.post('/', (req, res) => {
    const newVideo = {
        id: videos.length > 0
            ? Math.max(...videos.map(video => video.id)) + 1
            : 1,
        title: req.body.title,
        description: req.body.description,
        url: req.body.url
    };

    videos.push(newVideo);

    res.status(201).json(newVideo);
});

// PUT - Update video
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const video = videos.find(video => video.id === id);

    if (!video) {
        return res.status(404).json({
            message: 'Video not found'
        });
    }

    video.title = req.body.title ?? video.title;
    video.description = req.body.description ?? video.description;
    video.url = req.body.url ?? video.url;

    res.json(video);
});

// DELETE - Delete video
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);

    const index = videos.findIndex(video => video.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: 'Video not found'
        });
    }

    const deletedVideo = videos.splice(index, 1);

    res.json({
        message: 'Video deleted successfully',
        video: deletedVideo[0]
    });
});

module.exports = router;