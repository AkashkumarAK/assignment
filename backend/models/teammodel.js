const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    organizationId: {
      type: mongoose.Schema.Types.String,
      ref: 'Organization',
      required: true
    },
    teamId:
    {
        type: String,  // Use ObjectId type
        required: true,
        
    }
  }, { timestamps: true });
  
  const Team = mongoose.model('Team', TeamSchema);
  module.exports = Team