// Import Mongoose and Thought
const mongoose = require("mongoose");
const Thought = require("./Thought");

// Define the User model's schema
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      // Regex match for %@%.%, where % is any character
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    // Arrays of Thought and Friend objects
    thoughts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true, // Include virtual properties in the output when converting to JSON
    },
  }
);

// Virtual property for friend count
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});
// Virtual property for friend count
userSchema.virtual("thoughtCount").get(function () {
  return this.thoughts.length;
});

// Delete thoughts associated with a user when that user is deleted
userSchema.pre("remove", async function (next) {
  try {
    await Thought.deleteMany({ creator: this });
    next();
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Create the User model and export it
const User = mongoose.model("User", userSchema);

module.exports = User;
