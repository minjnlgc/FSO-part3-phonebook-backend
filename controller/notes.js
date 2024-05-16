const notesRouter = require("express").Router();
const Note = require("../models/note");

notesRouter.get("/", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

notesRouter.get("/:id", async (request, response, next) => {
  const notes = await Note.findById(request.params.id);

  if (notes) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

notesRouter.post("/", async (request, response, next) => {
  const body = request.body;

  const note = new Note({
    content: body.content,
    important: Boolean(body.important) || false,
  });

  try {
    const savedNote = await note.save()
    response.status(201).json(savedNote)
  } catch(exception) {
    next(exception)
  }
});

notesRouter.delete("/:id", async (request, response, next) => {
  const result = await Note.findByIdAndDelete(request.params.id);

  if (result) {
    response.status(204).end();
  } else {
    response.status(204).end();
  }
});

notesRouter.put("/:id", async (request, response, next) => {
  const { content, important } = request.body;

  const updatedNote = await Note.findByIdAndUpdate(
    request.params.id,
    { content, important },
    { new: true, runValidators: true, context: "query" }
  );

  response.json(updatedNote);
});

module.exports = notesRouter;
