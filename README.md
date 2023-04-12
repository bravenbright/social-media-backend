# Mongoose Social Network API

This project is a simple social network API that allows users to create accounts, make friends with other users, post their thoughts, and react to other users' thoughts.

## Installation

To install the dependencies for this project, run:

`npm install`

To connect to the database, copy or modify the `.env_example` so that you have a `.env` file with your Mongo DB connection string.

## Setup

To seed the database with users, thoughts, and reactions, run:

`npm run seed`

To start the server, run:

`npm start`

This will start the server on port 3000. You can change this by changing the value of `const port` in the `index.js` file in this directory.

## Models

There are two models in this project:

### User Model

The User model has the following properties:

- **username** (String, required, unique): the user's username.
- **email** (String, required, unique): the user's email address.
- **thoughts** (Array of ObjectIds, ref: "Thought"): an array of Thought objects that the user has created.
- **friends** (Array of ObjectIds, ref: "User"): an array of User objects that the user is friends with.

The User model also has the following virtual properties:

- **friendCount**: the number of friends the user has.
- **thoughtCount**: the number of thoughts the user has created.

When a user is deleted, all of their associated thoughts will also be deleted.

### Thought Model

The Thought model has the following properties:

- **thoughtText** (String, required): the text of the thought.
- **createdAt** (Date, default: Date.now): the timestamp of when the thought was created.
- **creator** (ObjectId, ref: "User"): the user who created the thought.
- **reactions** (Array of reactionSchema objects): an array of Reaction objects that represent the reactions to the thought.

The Thought model also has the following virtual property:

- **reactionCount**: the number of reactions the thought has.

Each Reaction object has the following properties:

- **reactionId** (ObjectId, default: new ObjectId): a unique identifier for the reaction.
- **reactionBody** (String, required, maxlength: 280): the text of the reaction.
- **username** (String, required): the username of the user who made the reaction.
- **createdAt** (Date, default: Date.now): the timestamp of when the reaction was created.

## Routes

There are two main routes in this project: `/api/users` and `/api/thoughts`.

### User Routes

- `GET /api/users`: get a list of all users.
- `GET /api/users/:id`: get a single user by ID.
- `POST /api/users`: create a new user.
- `PUT /api/users/:id`: update a user by ID.
- `DELETE /api/users/:id`: delete a user by ID.
- `POST /api/users/:userId/friends/:friendId`: add a user to another user's friend list.
- `DELETE /api/users/:userId/friends/:friendId`: remove a user from another user's friend list.

### Thought Routes

- `GET /api/thoughts`: get a list of all thoughts.
- `GET /api/thoughts/:id`: get a single thought by ID.
- `POST /api/thoughts`: create a new thought.
- `PUT /api/thoughts/:id`: update a thought by ID.
- `DELETE /api/thoughts/:id`: delete a thought by ID.
- `POST /api/thoughts/:thoughtId/reactions`: add a reaction to a thought.
- `DELETE /api/thoughts/:thoughtId/reactions/:reactionId`: remove a reaction from a thought.
