const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  organizationId: {
    type: String,  // Use ObjectId type
    required:true,
     
      },
  location: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Organization = mongoose.model('Organization', OrganizationSchema);
module.exports = Organization;
