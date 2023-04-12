// Import Mongoose
const mongoose = require("mongoose");

// Reaction schema for reactions property of Thought model
const reactionSchema = new mongoose.Schema(
  {
    reactionId: {
      type: mongoose.Schema.Types.ObjectId, // Data type is ObjectId
      default: () => new mongoose.Types.ObjectId(), // Value defaults to a new ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Format the timestamp when you get this object
      get: (createdAtVal) => createdAtVal.toString(),
    },
  },
  {
    toJSON: {
      getters: true,
    },
    id: false,
  }
);

// Define the Thought model schema
const thoughtSchema = new mongoose.Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      // Format the timestamp when you get this object
      get: (createdAtVal) => createdAtVal.toString(),
    },
    // The user id of the user who created this thought
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    // An array of nested reactionSchema objects
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true, // Include virtual properties in the output when converting to JSON
      getters: true, // This sets the date format when converting to JSON
    },
  }
);

// Virtual property for reaction count
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

// Create and export the Thought mode
const Thought = mongoose.model("Thought", thoughtSchema);

module.exports = Thought;
