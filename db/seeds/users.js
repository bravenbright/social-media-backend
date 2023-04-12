// Import dotenv for MongoDB string and Mongoose
require("dotenv").config();
const mongoose = require("mongoose");

// Import the User model and Faker.js for values
const User = require("../models/User");
const { faker } = require("@faker-js/faker");

async function seedUsers() {
  // Connect to the database
  await mongoose.connect(process.env.DATABASE_URL);

  // Delete all existing data from the database
  await User.deleteMany({});

  // Define the number of users to create
  const numUsers = 10;

  // Create an array to hold the generated users
  const users = [];

  // Generate fake user data and create new User objects
  for (let i = 0; i < numUsers; i++) {
    const username = faker.internet.userName();
    const email = faker.internet.email();
    const thoughts = [];
    const friends = [];

    // Create a new User object and add it to the array
    const user = new User({
      username,
      email,
      thoughts,
      friends,
    });
    users.push(user);
  }

  // Make each user friends with at least one other user
  users.forEach((user, i) => {
    let friendIndex;
    do {
      // Choose a random user to be the friend
      friendIndex = Math.floor(Math.random() * numUsers);
    } while (friendIndex === i); // Ensure the user isn't friends with themselves
    user.friends.push(users[friendIndex]._id);
  });

  // Create additional friendships randomly
  for (let i = 0; i < numUsers * 2; i++) {
    const userIndex = Math.floor(Math.random() * numUsers);
    const friendIndex = Math.floor(Math.random() * numUsers);
    if (
      userIndex !== friendIndex &&
      !users[userIndex].friends.includes(users[friendIndex]._id)
    ) {
      users[userIndex].friends.push(users[friendIndex]._id);
    }
  }

  // Insert the users into the database
  await User.insertMany(users);

  // Disconnect from the database
  await mongoose.disconnect();

  console.log("Seeded the database with users and friendships!");
}

module.exports = seedUsers;
