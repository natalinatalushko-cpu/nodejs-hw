
import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

// Отримати всі нотатки
export const getAllNotes = async (req, res) => {
  const notes = await Note.find();
  res.status(200).json(notes);
};

// Отримати нотатку за ID
export const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findById(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Створити нотатку
export const createNote = async (req, res) => {
  const note = await Note.create(req.body);
  res.status(201).json(note);
};

// Оновити нотатку
export const updateNote = async (req, res) => {
  const { noteId } = req.params;

  const note = await Note.findByIdAndUpdate(
    noteId,
    req.body,
    { returnDocument: 'after', runValidators: true },
  );

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};

// Видалити нотатку
export const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  const note = await Note.findByIdAndDelete(noteId);

  if (!note) {
    throw createHttpError(404, 'Note not found');
  }

  res.status(200).json(note);
};
