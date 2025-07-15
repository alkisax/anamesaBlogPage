const mongoose = require('mongoose');

const uploadSchema  = new mongoose.Schema({
  name: String,
  desc: String,
  file: {
    data: Buffer,
    contentType: String,
    originalName: String,
    filename: String
  }
});

module.exports = mongoose.model('Upload', uploadSchema );