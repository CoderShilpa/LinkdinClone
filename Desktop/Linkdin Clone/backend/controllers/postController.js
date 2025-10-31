// import Post from '../models/Post.js';
// import { validationResult } from 'express-validator';
// import mongoose from 'mongoose';

// // @desc    Create a post
// // @route   POST /api/posts
// // @access  Private
// export const createPost = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         // NOTE: Ensure req.user.name is available via the auth middleware/JWT payload
//         const newPost = new Post({
//             user: req.user.id,
//             name: req.user.name,
//             text: req.body.text
//         });

//         const post = await newPost.save();
//         res.json(post);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Get all posts
// // @route   GET /api/posts
// // @access  Private
// export const getPosts = async (req, res) => {
//     try {
//         // Sort by date descending (most recent first)
//         const posts = await Post.find().sort({ date: -1 });
//         res.json(posts);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Get post by ID
// // @route   GET /api/posts/:id
// // @access  Private
// export const getPostById = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
        
//         res.json(post);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Delete a post
// // @route   DELETE /api/posts/:id
// // @access  Private
// export const deletePost = async (req, res) => {
//     try {
//         const postId = req.params.id;
        
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
        
//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         // Check user ownership
//         if (post.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'User not authorized' });
//         }

//         await Post.findByIdAndDelete(postId);
//         res.json({ msg: 'Post removed' });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Update a post
// // @route   PUT /api/posts/:id
// // @access  Private
// export const updatePost = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const postId = req.params.id;
//         const { text } = req.body;
        
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         let post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         // CRITICAL: Check user ownership
//         if (post.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'User not authorized to update this post' });
//         }

//         post.text = text;
//         await post.save();
//         res.json(post);

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Add a comment to a post
// // @route   POST /api/posts/comment/:id
// // @access  Private
// export const addComment = async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//     }

//     try {
//         const postId = req.params.id;
//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         const newComment = {
//             user: req.user.id,
//             name: req.user.name,
//             text: req.body.text
//         };

//         // Add the comment to the beginning of the array (most recent first)
//         post.comments.unshift(newComment);
//         await post.save();
        
//         // Return the whole comment array
//         res.json(post.comments); 

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Delete a comment from a post
// // @route   DELETE /api/posts/comment/:id/:comment_id
// // @access  Private
// export const deleteComment = async (req, res) => {
//     try {
//         const { id: postId, comment_id } = req.params;

//         if (!mongoose.Types.ObjectId.isValid(postId) || !mongoose.Types.ObjectId.isValid(comment_id)) {
//             return res.status(404).json({ msg: 'Post or Comment not found' });
//         }

//         const post = await Post.findById(postId);
//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         // Pull out the comment by ID
//         const comment = post.comments.find(comm => comm.id === comment_id);

//         // Check if comment exists
//         if (!comment) {
//             return res.status(404).json({ msg: 'Comment does not exist' });
//         }

//         // Check user ownership of the comment
//         if (comment.user.toString() !== req.user.id) {
//             return res.status(401).json({ msg: 'User not authorized to delete this comment' });
//         }

//         // Get remove index
//         const removeIndex = post.comments
//             .map(comm => comm.id)
//             .indexOf(comment_id);

//         // Remove the comment from the array
//         post.comments.splice(removeIndex, 1);
//         await post.save();
        
//         // Return the updated comments array
//         res.json(post.comments);
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };


// // @desc    Like a post (Toggle logic - FIXED)
// // @route   PUT /api/posts/:id/like
// // @access  Private
// export const likePost = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const userId = req.user.id;

//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
        
//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         // 1. Check if the user has already liked it
//         const hasLiked = post.likes.some(like => like.user.toString() === userId);

//         // 2. Remove Dislike if present (Mutual Exclusivity)
//         const dislikeIndex = post.dislikes.findIndex(dislike => dislike.user.toString() === userId);
//         if (dislikeIndex !== -1) {
//             post.dislikes.splice(dislikeIndex, 1);
//         }

//         if (hasLiked) {
//             // If already liked, unlike it (remove the like)
//             const likeIndex = post.likes.findIndex(like => like.user.toString() === userId);
//             post.likes.splice(likeIndex, 1);
//         } else {
//             // If not liked, like it (add the like)
//             post.likes.unshift({ user: userId });
//         }

//         await post.save();
        
//         // Return the updated likes and dislikes arrays
//         res.json({ likes: post.likes, dislikes: post.dislikes });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };

// // @desc    Dislike a post (Toggle logic - FIXED)
// // @route   PUT /api/posts/:id/dislike
// // @access  Private
// export const dislikePost = async (req, res) => {
//     try {
//         const postId = req.params.id;
//         const userId = req.user.id;

//         if (!mongoose.Types.ObjectId.isValid(postId)) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }
        
//         const post = await Post.findById(postId);

//         if (!post) {
//             return res.status(404).json({ msg: 'Post not found' });
//         }

//         // 1. Check if the user has already disliked it
//         const hasDisliked = post.dislikes.some(dislike => dislike.user.toString() === userId);

//         // 2. Remove Like if present (Mutual Exclusivity)
//         const likeIndex = post.likes.findIndex(like => like.user.toString() === userId);
//         if (likeIndex !== -1) {
//             post.likes.splice(likeIndex, 1);
//         }

//         if (hasDisliked) {
//             // If already disliked, undislike it (remove the dislike)
//             const dislikeIndex = post.dislikes.findIndex(dislike => dislike.user.toString() === userId);
//             post.dislikes.splice(dislikeIndex, 1);
//         } else {
//             // If not disliked, dislike it (add the dislike)
//             post.dislikes.unshift({ user: userId });
//         }

//         await post.save();
        
//         // Return the updated likes and dislikes arrays
//         res.json({ likes: post.likes, dislikes: post.dislikes });

//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// };
// backend/controllers/postController.js

import Post from '../models/Post.js';
import { validationResult } from 'express-validator';

// ===================================
//  1. NEW FUNCTION: GET USER'S POSTS (For Profile Page)
// ===================================

// @desc    Get all posts by the current authenticated user
// @route   GET /api/posts/me
// @access  Private
export const getUsersPosts = async (req, res) => {
    try {
        const posts = await Post.find({ user: req.user.id })
            .sort({ date: -1 })
            .populate('user', ['name']); 

        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error: Failed to fetch user posts');
    }
};

// ===================================
//  2. EXISTING CONTROLLER FUNCTIONS (Cleaned up for inline export)
// ===================================

// @desc    Create a post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const newPost = new Post({
            text: req.body.text,
            name: req.user.name,
            user: req.user.id
        });

        const post = await newPost.save();
        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get all posts
// @route   GET /api/posts
// @access  Private
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find()
            .sort({ date: -1 })
            .populate('user', ['name']);
        res.json(posts);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('user', ['name']);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user (Post owner)
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        post.text = req.body.text;
        await post.save();

        res.json(post);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }

        // Check user (Post owner)
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Post.deleteOne({ _id: req.params.id });

        res.json({ msg: 'Post removed' });
    } catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');
    }
};

// @desc    Like a post (toggle)
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const userId = req.user.id;
        
        // Check if the post has already been liked by this user
        const alreadyLiked = post.likes.some(like => like.user.toString() === userId);
        
        if (alreadyLiked) {
            // User has liked it, so unlike it (pull)
            post.likes = post.likes.filter(like => like.user.toString() !== userId);
        } else {
            // User hasn't liked it, so push the like
            post.likes.unshift({ user: userId });
            
            // If they disliked it, remove the dislike
            post.dislikes = post.dislikes.filter(dislike => dislike.user.toString() !== userId);
        }

        await post.save();
        res.json({ likes: post.likes, dislikes: post.dislikes });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Dislike a post (toggle)
// @route   PUT /api/posts/:id/dislike
// @access  Private
export const dislikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) return res.status(404).json({ msg: 'Post not found' });

        const userId = req.user.id;
        
        // Check if the post has already been disliked by this user
        const alreadyDisliked = post.dislikes.some(dislike => dislike.user.toString() === userId);
        
        if (alreadyDisliked) {
            // User has disliked it, so remove the dislike (pull)
            post.dislikes = post.dislikes.filter(dislike => dislike.user.toString() !== userId);
        } else {
            // User hasn't disliked it, so push the dislike
            post.dislikes.unshift({ user: userId });
            
            // If they liked it, remove the like
            post.likes = post.likes.filter(like => like.user.toString() !== userId);
        }

        await post.save();
        res.json({ likes: post.likes, dislikes: post.dislikes });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Add a comment to a post
// @route   POST /api/posts/comment/:id
// @access  Private
export const addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const post = await Post.findById(req.params.id);

        const newComment = {
            text: req.body.text,
            name: req.user.name,
            user: req.user.id
        };

        post.comments.unshift(newComment);
        await post.save();
        
        res.json(post.comments); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a comment from a post
// @route   DELETE /api/posts/comment/:id/:comment_id
// @access  Private
export const deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        // Pull out comment
        const comment = post.comments.find(
            (comment) => comment.id === req.params.comment_id
        );
        
        if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' });
        }

        // Check user (User must be the owner of the comment)
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized to delete this comment' });
        }

        // Get remove index
        const removeIndex = post.comments
            .map((comment) => comment.id)
            .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        await post.save();
        
        res.json(post.comments); 

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
// NOTE: I have removed the final 'export { ... }' block to eliminate all duplicate export errors.