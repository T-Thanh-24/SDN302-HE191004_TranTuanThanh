const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Class = require('../models/Class');
const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const verifyToken = require('../middleware/verifyToken');

router.get('/:classId/students', verifyToken, async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                message: 'Invalid classId'
            });
        }

        const status = String(req.query.status || 'enrolled').toLowerCase();

        if (!['enrolled', 'dropped'].includes(status)) {
            return res.status(400).json({
                message: 'Invalid status'
            });
        }

        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        const ids = classData.enrollments
            .filter(e => e.status.toLowerCase() === status)
            .map(e => e.studentId);

        const students = await Student.find({
            _id: { $in: ids }
        }).select('_id studentCode fullName email').lean();

        const result = students.map(s => ({
            studentId: s._id,
            studentCode: s.studentCode,
            fullName: s.fullName,
            email: s.email
        }));

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.get('/:classId/attendance-summary', verifyToken, async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                message: 'Invalid classId'
            });
        }

        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        const ids = classData.enrollments
            .filter(e => e.status.toLowerCase() === 'enrolled')
            .map(e => e.studentId);

        const students = await Student.find({
            _id: { $in: ids }
        });

        const attendances = await Attendance.find({
            classId,
            studentId: { $in: ids }
        });

        const result = students.map(student => {
            const records = attendances.filter(
                a => a.studentId.toString() === student._id.toString()
            );

            const totalSessions = records.length;

            const present = records.filter(
                a => a.status === 'PRESENT'
            ).length;

            const absent = records.filter(
                a => a.status === 'ABSENT'
            ).length;

            const attendanceRate = totalSessions
                ? Math.round(present / totalSessions * 1000) / 10
                : 0;

            return {
                studentId: student._id,
                studentCode: student.studentCode,
                fullName: student.fullName,
                totalSessions,
                present,
                absent,
                attendanceRate,
                warming: attendanceRate < 80
            };
        });

        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

router.post('/:classId/attendances', async (req, res) => {
    try {
        const { classId } = req.params;

        if (!mongoose.isValidObjectId(classId)) {
            return res.status(400).json({
                message: 'Invalid classId'
            });
        }

        const classData = await Class.findById(classId);

        if (!classData) {
            return res.status(404).json({
                message: 'Class not found'
            });
        }

        const { date, records } = req.body || {};

        if (
            typeof date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(date)
        ) {
            return res.status(400).json({
                message: 'Date must be YYYY-MM-DD'
            });
        }

        const day = new Date(date + 'T00:00:00.000Z');

        if (
            Number.isNaN(day.getTime()) ||
            day.toISOString().slice(0, 10) !== date ||
            day.getTime() > Date.now()
        ) {
            return res.status(400).json({
                message: 'Invalid or future date'
            });
        }

        if (!Array.isArray(records) || records.length === 0) {
            return res.status(400).json({
                message: 'Records must be a non-empty array'
            });
        }

        const enrolledIds = classData.enrollments
            .filter(e => e.status.toLowerCase() === 'enrolled')
            .map(e => String(e.studentId));

        const submittedIds = records.map(
            r => String(r && r.studentId)
        );

        if (
            records.length !== enrolledIds.length ||
            new Set(submittedIds).size !== records.length
        ) {
            return res.status(400).json({
                message: 'Provide exactly one record for every enrolled student'
            });
        }

        for (const record of records) {
            if (
                !record ||
                !mongoose.isValidObjectId(record.studentId) ||
                !enrolledIds.includes(String(record.studentId)) ||
                !['PRESENT', 'ABSENT'].includes(record.status)
            ) {
                return res.status(400).json({
                    message: 'Invalid studentId, enrollment, or attendance status'
                });
            }
        }

        const operations = records.map(record => ({
            updateOne: {
                filter: {
                    classId,
                    studentId: record.studentId,
                    date: day
                },
                update: {
                    $set: { status: record.status }
                },
                upsert: true
            }
        }));

        const result = await Attendance.bulkWrite(operations);

        return res.json({
            message: 'Attendance saved successfully',
            matchedCount: result.matchedCount,
            modifiedCount: result.modifiedCount,
            upsertedCount: result.upsertedCount
        });
    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;
