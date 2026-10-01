const express = require("express");

const router = express.Router();

let videos = [
  {
    id: 1,
    title: "Node.js Introduction",
    description: "Introduction to Node.js and Express."
  },
  {
    id: 2,
    title: "Express Middleware",
    description: "Understanding middleware in Express."
  }
];

// GET all videos
router.get("/", (req, res) => {
  res.status(200).json(videos);
});

// GET video by ID
router.get("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const video = videos.find(item => item.id === id);

    if (!video) {
      const error = new Error("Video not found");
      error.status = 404;
      return next(error);
    }

    res.status(200).json(video);
  } catch (error) {
    next(error);
  }
});

// POST video
router.post("/", (req, res, next) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      const error = new Error("Missing required video fields");
      error.status = 400;
      return next(error);
    }

    // For Exercise 8 testing: send {"title":"ERROR",...}
    // to verify centralized 500 error handling.
    if (title === "ERROR") {
      throw new Error("Simulated video saving error");
    }

    const newVideo = {
      id: videos.length
        ? Math.max(...videos.map(video => video.id)) + 1
        : 1,
      title,
      description
    };

    videos.push(newVideo);

    res.status(201).json({
      message: "Video saved successfully",
      video: newVideo
    });
  } catch (error) {
    next(error);
  }
});

// DELETE video
router.delete("/:id", (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const index = videos.findIndex(item => item.id === id);

    if (index === -1) {
      const error = new Error("Video not found");
      error.status = 404;
      return next(error);
    }

    const deletedVideo = videos.splice(index, 1)[0];

    res.status(200).json({
      message: `Deleting video: ${id}`,
      video: deletedVideo
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;