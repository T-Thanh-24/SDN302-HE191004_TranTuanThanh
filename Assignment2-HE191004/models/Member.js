const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
  fullName: { type: String, required: [true, 'fullName is required'], trim: true },
email: {
  type: String,
  required: [true, 'Email is required'],
  unique: true,
  trim: true,
  lowercase: true,
  match: [
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Email address is invalid'
  ]
},
  phone: { type: String, required: [true, 'Phone is required'], trim: true },
  membershipType: { type: String, enum: { values: ['Student', 'Teacher', 'Guest'], message: 'membershipType must be Student, Teacher, or Guest' }, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
