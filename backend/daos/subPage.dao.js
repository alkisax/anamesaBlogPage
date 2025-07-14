const SubPage = require('../models/subPage.model');

const getAllSubPages = () => {
 return SubPage.find({});
}
const createSubPage = (name) => {
  return SubPage.create({ name })
};

module.exports = {
  getAllSubPages,
  createSubPage
};
