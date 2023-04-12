// Import express router and Thought model
const router = require("express").Router();
const Thought = require("../../db/models/Thought");

// Middleware to find a thought by id
const findThoughtById = async (req, res, next) => {
  try {
    const thought = await Thought.findById(req.params.id).populate("reactions");
    if (!thought) {
      return res
        .status(404)
        .json({ message: "Thought with this ID not found!" });
    }
    req.thought = thought;
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET: list all thoughts
router.get("/", async (req, res) => {
  try {
    const thoughts = await Thought.find().populate("reactions");
    res.status(200).json(thoughts);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET: return a thought by id
router.get("/:id", findThoughtById, (req, res) => {
  res.status(200).json(req.thought);
});

// POST: create a new thought
router.post("/", async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    res.status(200).json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT: update a thought by id
router.put("/:id", async (req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE: remove a thought by id
router.delete("/:id", async (req, res) => {
  try {
    await Thought.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Thought deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST: create a new reaction for a thought
router.post("/:thoughtId/reactions", async (req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    const reaction = {
      reactionBody: req.body.reactionBody,
      username: req.body.username,
    };
    updatedThought.reactions.push(reaction);
    await updatedThought.save();
    res.status(200).json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE a reaction from a thought
router.delete("/:thoughtId/reactions/:reactionId", async (req, res) => {
  try {
    const updatedThought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { _id: req.params.reactionId } } },
      { new: true, runValidators: true }
    );
    if (!updatedThought) {
      return res
        .status(404)
        .json({ message: "Thought with this ID not found!" });
    }
    res.status(200).json(updatedThought);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
