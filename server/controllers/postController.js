const asyncHandler = require('express-async-handler');
const Post = require('../models/Post');

const index = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const create = asyncHandler(async (req, res) => {
  const { title, description, image, user } = req.body;
  try {
    const newPost = await Post.create({
      title,
      description,
      image,
      user,
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

const show = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  try {
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const update = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    if (post.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description,
        image: req.body.image,
        user: req.user.id,
      },
      { new: true, runValidators: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

const destroy = asyncHandler(async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
    }
    if (!req.user) {
      res.status(401);
      throw new Error('User not found');
    }
    if (post.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }
    await Post.remove();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});
const postController = {
  index,
  create,
  show,
  update,
  destroy,
};

module.exports = postController;
