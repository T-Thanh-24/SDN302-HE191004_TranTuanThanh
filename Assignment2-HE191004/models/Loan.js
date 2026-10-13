const mongoose = require('mongoose');

const loanItemSchema = new mongoose.Schema({
  book_id: { type: String, ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: [1, 'Quantity must be at least 1'] }
}, { _id: false });

const loanSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  member_id: { type: String, ref: 'Member', required: [true, 'member_id is required'] },
  items: { type: [loanItemSchema], required: true, validate: [v => v.length > 0, 'At least one book item is required'] },
  borrowDate: { type: Date, default: Date.now },
  dueDate: { type: Date, required: [true, 'dueDate is required'] },
  returnDate: { type: Date, default: null },
  status: { type: String, enum: ['Borrowing', 'Returned', 'Overdue'], default: 'Borrowing' }
}, { timestamps: true });

module.exports = mongoose.model('Loan', loanSchema);
