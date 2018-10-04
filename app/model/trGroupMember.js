const mongoose = require('mongoose');
const db = require('./index');

const trGroupMember = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrGroup'
  },
  fullName: {
    type: String
  },
  lineId: {
    type: String,
    required: true
  },
  target: {
    type: Boolean
  },
  questioner: {
    type: Boolean
  }
}, {
    timestamps: true
  });

const TrGroupMember = mongoose.model('TrGroupMember', trGroupMember);

module.exports = TrGroupMember;