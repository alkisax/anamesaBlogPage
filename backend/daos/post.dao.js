const Post = require('../models/post.model');

const getAllPosts = () => {
  return Post.find({}).populate('subPage');
};

const getPostById = async (postId) => {
  return await Post.findById(postId).populate('subPage');
};

const createPost = (content, subPage) => {
  return Post.create({ content, subPage });
};

const editPost = async (postId, content, subPage) => {
  const post = await Post.findById(postId);
  if (!post) {
    throw new Error('post not found');
  }
  post.content = content;

    if (subPage !== undefined) {
    post.subPage = subPage;
  }
  
  return await post.save();
};

module.exports = {
  getAllPosts,
  getPostById,
  createPost,
  editPost,
};