const mongoose = require('mongoose');
const Member = require('../models/Member');
const Loan = require('../models/Loan');
const { handleMongooseError, sendError } = require('../utils/errors');

exports.getMembers = async (req, res) => {
  const members = await Member.find().sort({ fullName: 1 });
  res.json({ success: true, count: members.length, data: members });
};
exports.getMemberById = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return sendError(res, 404, 'Member not found');
  res.json({ success: true, data: member });
};
exports.createMember = async (req, res) => {
  try {
    const missing = ['fullName', 'email', 'membershipType'].filter(k => !req.body[k]);
    if (missing.length) return sendError(res, 400, `Missing required fields: ${missing.join(', ')}`);
    const member = await Member.create({ ...req.body, isActive: req.body.isActive ?? true });
    res.status(201).json({ success: true, message: 'Member created successfully', data: member });
  } catch (e) { handleMongooseError(e, res); }
};
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return sendError(res, 404, 'Member not found');
    Object.assign(member, req.body);
    await member.save();
    res.json({ success: true, message: 'Member updated successfully', data: member });
  } catch (e) { handleMongooseError(e, res); }
};
exports.deleteMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return sendError(res, 404, 'Member not found');
  if (await Loan.exists({ member: member._id, status: 'Borrowed' }))
    return sendError(res, 409, 'Cannot delete a member with active loans');
  await member.deleteOne();
  res.json({ success: true, message: 'Member deleted successfully' });
};
