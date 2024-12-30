const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    uniqueId: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String
    },
    teamId: {
      type: mongoose.Schema.Types.String,
      ref: 'Team',
      required: true
    }
  }, { timestamps: true });
  
  const Member = mongoose.model('Member', MemberSchema);
  module.exports = Member;
  