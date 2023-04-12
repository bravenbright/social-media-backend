require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL);
const database = mongoose.connection;

database.on("error", (error) => {
  console.log(error);
});

database.once("connected", () => {
  console.log("MongoDB Database connected!");
});

const app = express();

app.use(express.json());

const apiRoutes = require("./routes/api");
app.use("/api", apiRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});
