const notesRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const config = require('../utils/config')
const Note = require("../models/note");
const User = require("../models/user");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({}).populate("user", { username: 1, name: 1 });
  response.json(notes);
});

notesRouter.get("/:id", async (request, response) => {
  const notes = await Note.findById(request.params.id);

  if (notes) {
    response.json(notes);
  } else {
    response.status(404).end();
  }
});


// helper function to decode the jwt token in the header
const getTokenFrom = (request) => {

  // get the authorization information from the request
  const authorization = request.get("authorization");

  // if this exist and have 'Bearer'
  if (authorization && authorization.startsWith("Bearer ")) {

    // extract the tokens
    return authorization.replace("Bearer ", "");
  }
  return null;
};

notesRouter.post("/", async (request, response) => {
  const body = request.body;

  // using jwt to verify the tokens against the SECRET
  const decodedToken = jwt.verify(getTokenFrom(request), config.SECRET)

  // if decoded token did not contains the id, then 401
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  // created the note with the associated user id

  // first extract the user from the db
  const user = await User.findById(body.userId);

  const note = new Note({
    content: body.content,
    important: body.important === undefined ? false : body.important,
    //user: user._id,
  });

  const savedNote = await note.save();
  //user.notes = user.notes.concat(savedNote._id);
  //await user.save();

  response.status(201).json(savedNote);
});

notesRouter.delete("/:id", async (request, response) => {
  const result = await Note.findByIdAndDelete(request.params.id);

  if (result) {
    response.status(204).end();
  } else {
    response.status(204).end();
  }
});

notesRouter.put("/:id", async (request, response) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  );

  response.json(updatedNote);
});

module.exports = notesRouter;
