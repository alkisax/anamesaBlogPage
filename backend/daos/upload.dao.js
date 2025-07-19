const Upload = require('../models/upload.model');

const getAllUploads = () => {
 return Upload.find({}, { 'file.data': 0 });
}
const createUpload = (imageData) => {
  return Upload.create(imageData)
};

const deleteUpload = (uploadId) => {
  return Upload.findByIdAndDelete(uploadId);
};

module.exports = {
  getAllUploads,
  createUpload,
  deleteUpload
};
