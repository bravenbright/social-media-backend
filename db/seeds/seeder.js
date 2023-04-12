// Import the seeder files
const seedUsers = require("./users");
const seedThoughts = require("./thoughts");

// Define a function to run the seeders in order
async function seed() {
  try {
    // Seed the users first
    await seedUsers();

    // Then seed the thoughts
    await seedThoughts();

    // Log success message
    console.log("Successfully seeded the database!");

    // Disconnect from the database
    process.exit(0);
  } catch (err) {
    // Log any errors that occur during seeding
    console.error(err);

    // Disconnect from the database
    process.exit(1);
  }
}

// Run the seed function
seed();
