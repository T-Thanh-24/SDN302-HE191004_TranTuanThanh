
const mongoose = require('mongoose');
const Loan = require('../models/Loan');
const Book = require('../models/Book');
const Member = require('../models/Member');
const { handleMongooseError, sendError } = require('../utils/errors');

// Populate member and book information
const population = [
  {
    path: 'member_id',
    select: 'fullName email phone membershipType isActive'
  },
  {
    path: 'items.book_id',
    select: 'title author category isbn publishedYear totalCopies availableCopies'
  }
];

// GET /api/loans
// Retrieve all borrowing records
exports.getLoans = async (req, res) => {
  try {
    const loans = await Loan.find()
      .populate(population)
      .sort({ borrowDate: -1 });

    return res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    return handleMongooseError(error, res);
  }
};

// GET /api/loans/:id
// Retrieve a borrowing record by ID
exports.getLoanById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid loan ID');
    }

    const loan = await Loan.findById(id).populate(population);

    if (!loan) {
      return sendError(res, 404, 'Loan record not found');
    }

    return res.status(200).json({
      success: true,
      data: loan
    });
  } catch (error) {
    return handleMongooseError(error, res);
  }
};

// GET /api/loans/member/:memberID
// Retrieve all borrowing records belonging to a member
exports.getMemberLoans = async (req, res) => {
  try {
    const { memberID } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberID)) {
      return sendError(res, 400, 'Invalid memberID');
    }

    const member = await Member.findById(memberID);

    if (!member) {
      return sendError(res, 404, 'Member not found');
    }

    const loans = await Loan.find({ member_id: memberID })
      .populate(population)
      .sort({ borrowDate: -1 });

    return res.status(200).json({
      success: true,
      count: loans.length,
      data: loans
    });
  } catch (error) {
    return handleMongooseError(error, res);
  }
};

// POST /api/loans
// Create a borrowing record and decrease available book copies
exports.createLoan = async (req, res) => {
  const deducted = [];

  try {
    const { member_id, items, dueDate } = req.body;

    // Validate required fields
    if (!member_id || !mongoose.Types.ObjectId.isValid(member_id)) {
      return sendError(res, 400, 'A valid member_id is required');
    }

    if (!Array.isArray(items) || items.length === 0) {
      return sendError(
        res,
        400,
        'items must be a non-empty array'
      );
    }

    if (!dueDate || Number.isNaN(Date.parse(dueDate))) {
      return sendError(res, 400, 'A valid dueDate is required');
    }

    // Check member
    const memberDoc = await Member.findById(member_id);

    if (!memberDoc) {
      return sendError(res, 404, 'Member not found');
    }

    if (!memberDoc.isActive) {
      return sendError(
        res,
        403,
        'Inactive members cannot borrow books'
      );
    }

    // Validate items and combine duplicate book IDs
    const quantities = new Map();

    for (const item of items) {
      if (
        !item.book_id ||
        !mongoose.Types.ObjectId.isValid(item.book_id) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return sendError(
          res,
          400,
          'Each item must contain a valid book_id and a positive integer quantity'
        );
      }

      const bookId = String(item.book_id);

      quantities.set(
        bookId,
        (quantities.get(bookId) || 0) + item.quantity
      );
    }

    // Verify all books and available quantities
    const books = [];

    for (const [bookId, quantity] of quantities) {
      const book = await Book.findById(bookId);

      if (!book) {
        return sendError(res, 404, `Book not found: ${bookId}`);
      }

      if (book.availableCopies < quantity) {
        return sendError(
          res,
          400,
          `Not enough available copies for "${book.title}"`
        );
      }

      books.push({ book, quantity });
    }

    // Decrease inventory safely
    for (const { book, quantity } of books) {
      const result = await Book.updateOne(
        {
          _id: book._id,
          availableCopies: { $gte: quantity }
        },
        {
          $inc: { availableCopies: -quantity }
        }
      );

      if (result.modifiedCount !== 1) {
        // Restore previously deducted quantities
        for (const entry of deducted) {
          await Book.updateOne(
            { _id: entry.book._id },
            { $inc: { availableCopies: entry.quantity } }
          );
        }

        deducted.length = 0;

        return sendError(
          res,
          409,
          `Not enough available copies for "${book.title}"`
        );
      }

      deducted.push({ book, quantity });
    }

    // Create loan record
    const loan = await Loan.create({
      member_id,
      items: [...quantities].map(([book_id, quantity]) => ({
        book_id,
        quantity
      })),
      dueDate,
      status: 'Borrowing'
    });

    const populatedLoan = await Loan.findById(loan._id)
      .populate(population);

    return res.status(201).json({
      success: true,
      message: 'Books borrowed successfully',
      data: populatedLoan
    });
  } catch (error) {
    // Restore book quantities if loan creation or another operation fails
    for (const entry of deducted) {
      try {
        await Book.updateOne(
          { _id: entry.book._id },
          { $inc: { availableCopies: entry.quantity } }
        );
      } catch (restoreError) {
        console.error('Failed to restore book quantity:', restoreError);
      }
    }

    return handleMongooseError(error, res);
  }
};

// PUT /api/loans/:id/return
// Return borrowed books and restore available quantities
exports.returnLoan = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return sendError(res, 400, 'Invalid loan ID');
    }

    const loan = await Loan.findById(id);

    if (!loan) {
      return sendError(res, 404, 'Loan record not found');
    }

    if (loan.status === 'Returned' || loan.returnDate) {
      return sendError(
        res,
        409,
        'This loan has already been returned'
      );
    }

    // Verify all referenced books exist before restoring quantities
    for (const item of loan.items) {
      const bookExists = await Book.exists({ _id: item.book_id });

      if (!bookExists) {
        return sendError(
          res,
          404,
          `Book not found: ${item.book_id}`
        );
      }
    }

    // Restore book quantities
    const restored = [];

    for (const item of loan.items) {
      const result = await Book.updateOne(
        {
          _id: item.book_id,
          $expr: {
            $lte: [
              { $add: ['$availableCopies', item.quantity] },
              '$totalCopies'
            ]
          }
        },
        {
          $inc: { availableCopies: item.quantity }
        }
      );

      if (result.modifiedCount !== 1) {
        // Roll back quantities already restored in this operation
        for (const previous of restored) {
          await Book.updateOne(
            { _id: previous.book_id },
            { $inc: { availableCopies: -previous.quantity } }
          );
        }

        return sendError(
          res,
          409,
          'Cannot return books because the available quantity would exceed totalCopies'
        );
      }

      restored.push({
        book_id: item.book_id,
        quantity: item.quantity
      });
    }

    // Update loan status
    loan.returnDate = new Date();
    loan.status = 'Returned';

    await loan.save();

    const populatedLoan = await Loan.findById(loan._id)
      .populate(population);

    return res.status(200).json({
      success: true,
      message: 'Books returned successfully',
      data: populatedLoan
    });
  } catch (error) {
    return handleMongooseError(error, res);
  }
};
