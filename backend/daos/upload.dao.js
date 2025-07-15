const Upload = require('../models/upload.model');

const getAllUploads = () => {
 return Upload.find({});
}
const createUpload = (imageData) => {
  return Upload.create(imageData)
};

module.exports = {
  getAllUploads,
  createUpload
};
