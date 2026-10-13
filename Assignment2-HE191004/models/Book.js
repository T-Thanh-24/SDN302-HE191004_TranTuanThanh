const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  title: { type: String, required: [true, 'Title is required'], trim: true },
  author: { type: String, required: [true, 'Author is required'], trim: true },
  category: { type: String, required: [true, 'Category is required'], trim: true },
  isbn: { type: String, required: [true, 'ISBN is required'], unique: true, trim: true },
  publishedYear: { type: Number, min: [0, 'Published year cannot be negative'] },
  totalCopies: { type: Number, required: true, min: [0, 'totalCopies cannot be negative'] },
  availableCopies: { type: Number, required: true, min: [0, 'availableCopies cannot be negative'] }
}, { timestamps: true });

bookSchema.pre('validate', function(next) {
  if (this.availableCopies > this.totalCopies) {
    this.invalidate('availableCopies', 'availableCopies cannot exceed totalCopies');
  }
  next();
});

module.exports = mongoose.model('Book', bookSchema);
