const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentCode: String,
    fullName: String,
    email: String
}, { collection: 'students' });

module.exports = mongoose.model('Student', studentSchema);
