// Import dotenv for MongoDB string and Mongoose
require("dotenv").config();
const mongoose = require("mongoose");

// Import the Thought and User models and Faker.js for values
const Thought = require("../models/Thought");
const User = require("../models/User");
const { faker } = require("@faker-js/faker");

async function seedThoughts() {
  // Connect to the database
  await mongoose.connect(process.env.DATABASE_URL);

  // Delete all existing data from the database
  await Thought.deleteMany({});

  // Get all users from the database
  const users = await User.find({});

  // Create an array to hold the generated thoughts
  const thoughts = [];

  // Generate 3 thoughts for each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    for (let j = 0; j < 3; j++) {
      // Create a new thought object
      const thought = new Thought({
        thoughtText: faker.lorem.sentence(),
        creator: user._id,
        reactions: [],
      });

      // Add 3 reactions to the thought
      for (let k = 0; k < 3; k++) {
        // Get a random user other than the owner of the thought
        let randomUser;
        do {
          randomUser = users[Math.floor(Math.random() * users.length)];
        } while (randomUser._id.equals(user._id));

        // Create a new reaction object
        const reaction = {
          reactionBody: faker.lorem.sentence(),
          username: randomUser.username,
        };

        // Add the reaction to the thought
        thought.reactions.push(reaction);
      }

      // Add the thought to the array
      thoughts.push(thought);
    }
    // Push the thoughts to the user's thoughts array
    user.thoughts = thoughts.map((thought) => thought._id);
    await user.save();
  }

  // Insert the thoughts into the database
  await Thought.insertMany(thoughts);

  // Disconnect from the database
  mongoose.disconnect();

  console.log("Seeded the database with thoughts and reactions!");
}

module.exports = seedThoughts;
