
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Subject = require('../models/Subject');
const verifyToken = require('../middleware/verifyToken');

router.get('/:studentId/attendances', verifyToken, async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.isValidObjectId(studentId)) {
            return res.status(400).json({
                message: 'Invalid studentId'
            });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }

        const records = await Attendance.find({ studentId })
            .populate({
                path: 'classId',
                select: 'className subjectId',
                populate: {
                    path: 'subjectId',
                    select: 'name'
                }
            })
            .sort({ date: -1 });

        const result = records.map(a => ({
            className: a.classId ? a.classId.className : null,
            subjectName: a.classId && a.classId.subjectId
                ? a.classId.subjectId.name
                : null,
            date: a.date,
            status: a.status
        }));

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
