// backend/routes/postRoutes.js

import express from 'express';
import auth from '../middleware/auth.js';
import Post from '../models/Post.js';
import User from '../models/User.js';

const router = express.Router();

// @route    POST /api/posts
// @desc     Create a text post
// @access   Private
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim() === '') {
      return res.status(400).json({ msg: 'Post text is required' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const newPost = new Post({
      text,
      name: user.name,
      user: req.user.id,
    });

    const post = await newPost.save();
    res.json(post);
  } catch (err) {
    console.error('Error creating post:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET /api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default router;
