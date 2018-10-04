const mongoose = require('mongoose');
const db = require('./index');

const trGroup = new mongoose.Schema({
  lineId: {
    type: String,
    required: true
  },
  ingame: {
    type: Boolean
  },
  groupMembers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrGroupMember'
  }],
  state: {
    type: String
  }
}, {
    timestamps: true
  });

const TrGroup = mongoose.model('TrGroup', trGroup);

module.exports = TrGroup;