
const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    code: String,
    name: String,
    credits: Number,
    status: String
}, { collection: 'subjects' });

module.exports = mongoose.model('Subject', subjectSchema);
