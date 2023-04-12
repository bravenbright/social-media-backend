// Import express router and User model
const router = require("express").Router();
const User = require("../../db/models/User");

// Middleware to find a user by id
const findUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate(
      "thoughts friends"
    );
    if (!user) {
      return res.status(404).json({ message: "User with this ID not found!" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET: list all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find().populate("thoughts friends");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST: create a new user
router.post("/", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET: return a user by id
router.get("/:id", findUserById, (req, res) => {
  res.status(200).json(req.user);
});

// PUT: update a user by id
router.put("/:id", async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE: removes a user by id and their thoughts
router.delete("/:id", async (req, res) => {
  try {
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "User deleted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
