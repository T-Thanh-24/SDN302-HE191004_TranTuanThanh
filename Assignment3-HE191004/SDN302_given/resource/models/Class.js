const mongoose = require('mongoose');

const classSchema = new mongoose.Schema({
    className: String,
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject'
    },
    lecturerName: String,
    status: String,
    enrollments: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student'
        },
        status: String
    }]
}, { collection: 'classes' });

module.exports = mongoose.model('Class', classSchema);
