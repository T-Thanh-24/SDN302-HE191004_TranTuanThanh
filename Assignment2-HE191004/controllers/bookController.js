const mongoose = require('mongoose');
const Book = require('../models/Book');
const { handleMongooseError, sendError } = require('../utils/errors');

exports.getBooks = async (req, res) => {
  const books = await Book.find().sort({ title: 1 });
  res.json({ success: true, count: books.length, data: books });
};

exports.getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return sendError(res, 404, 'Book not found');
  res.json({ success: true, data: book });
};

exports.createBook = async (req, res) => {
  try {
    const required = ['title', 'author', 'isbn', 'category', 'totalCopies'];
    const missing = required.filter(k => req.body[k] === undefined || req.body[k] === '');
    if (missing.length) return sendError(res, 400, `Missing required fields: ${missing.join(', ')}`);
    if (req.body.totalCopies < 0 || (req.body.availableCopies !== undefined && req.body.availableCopies < 0))
      return sendError(res, 400, 'Book copies cannot be negative');
    const payload = { ...req.body };
    if (payload.availableCopies === undefined) payload.availableCopies = payload.totalCopies;
    const book = await Book.create(payload);
    res.status(201).json({ success: true, message: 'Book created successfully', data: book });
  } catch (e) { handleMongooseError(e, res); }
};

exports.updateBook = async (req, res) => {
  try {
    if (['totalCopies', 'availableCopies'].some(k => req.body[k] !== undefined && req.body[k] < 0))
      return sendError(res, 400, 'Book copies cannot be negative');
    const book = await Book.findById(req.params.id);
    if (!book) return sendError(res, 404, 'Book not found');
    Object.assign(book, req.body);
    await book.save();
    res.json({ success: true, message: 'Book updated successfully', data: book });
  } catch (e) { handleMongooseError(e, res); }
};

exports.deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) return sendError(res, 404, 'Book not found');
  const Loan = require('../models/Loan');
  const referenced = await Loan.exists({ 'items.book_id': book._id, status: 'Borrowing' });
  if (referenced) return sendError(res, 409, 'Cannot delete a book that is currently on loan');
  await book.deleteOne();
  res.json({ success: true, message: 'Book deleted successfully' });
};
