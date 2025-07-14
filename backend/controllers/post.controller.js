// controllers/post.controller.js
const postDao = require('../daos/post.dao');

const createPost = async (req, res) => {
  try {
    const { content, subPage } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content' });
    }

    const savedPost = await postDao.createPost(content, subPage);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while saving post' });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content, subPage } = req.body;

    if (!content || !content.blocks) {
      return res.status(400).json({ error: 'Invalid EditorJS content for edit post' });
    }

    const savedPost = await postDao.editPost(postId, content, subPage);

    res.status(200).json(savedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while editing post' });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postDao.getAllPosts()
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Server error while fetching posts' })
  }
}

const getPostById = async (req, res) => {
  const { postId } = req.params;
  try {
    const post = await postDao.getPostById(postId);
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(post);
  } catch (error) {
    console.error('Get Post Error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createPost,
  editPost,
  getPostById,
  getAllPosts,
};
