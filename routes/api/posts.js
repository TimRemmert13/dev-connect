const express = require('express');
const passport = require('passport');

const router = express.Router();

// Post Model
const Post = require('../../models/Post');

// Profile Model
const Profile = require('../../models/Profile');

// Validation
const validatePostInput = require('../../validation/posts');

/**
 * @route GET api/posts/test
 * @desc Tests posts route
 * @access Public
 */
router.get('/test', (req, res) => res.json({ msg: 'Posts works' }));

/**
 * @route GET api/posts
 * @desc get posts
 * @access Public
 */
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(res.status(404).json({ nopostfound: 'No posts found' }));
});

/**
 * @route GET api/posts/:id
 * @desc get posts by id
 * @access Public
 */
router.get('/:id', (req, res) => {
  Post.find(req.params.id)
    .then(post => res.json(post))
    .catch(res.status(404).json({ nopostfound: 'No posts found with that ID' }));
});

/**
 * @route POST api/posts
 * @desc create post
 * @access Private
 */
router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const newPost = new Post({
    text: req.body.text,
    name: req.body.name,
    avatar: req.body.avatar,
    user: req.user.id,
  });

  return newPost.save().then(post => res.json(post));
});

/**
 * @route DELETE api/posts/:id
 * @desc delete posts by id
 * @access Private
 */
router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          // Check for post owner
          if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ notauthorized: 'User not authorized' });
          }
          // Delete
          return post.remove().then(() => res.json({ success: true }));
        })
        .catch(res.status(404).json({ postnotfound: 'No post found' }));
    });
});

/**
 * @route POST api/posts/like/:id
 * @desc like post
 * @access Private
 */
router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ alreadyliked: 'User already liked this post' });
          }
          // Add user id to likes array
          post.likes.unshift({ user: req.user.id });
          return post.save().then(newPost => res.json(newPost));
        })
        .catch(res.status(404).json({ postnotfound: 'No post found' }));
    });
});

/**
 * @route POST api/posts/unlike/:id
 * @desc unlike post
 * @access Private
 */
router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Profile.findOne({ user: req.user.id })
    .then(() => {
      Post.findById(req.params.id)
        .then((post) => {
          if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ notliked: 'You have not yet liked this post' });
          }
          // get remove index
          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          // Splice out of array
          post.likes.splice(removeIndex, 1);

          // Save
          return post.save().then(newPost => res.json(newPost));
        })
        .catch(res.status(404).json({ postnotfound: 'No post found' }));
    });
});

/**
 * @route POST api/posts/comment/:id
 * @desc Add comment to post
 * @access Private
 */
router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
  const { errors, isValid } = validatePostInput(req.body);

  // check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  Post.findById(req.params.id)
    .then((post) => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
      };
      // Add to comments array
      post.comments.unshift(newComment);

      // Save
      return post.save().then(newPost => res.json(newPost));
    })
    .catch(res.status(404).json({ postnotfound: 'No post found' }));
  return null;
});

/**
 * @route DELETE api/posts/comment/:id/:comment_id
 * @desc Remove comment from post
 * @access Private
 */
router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {
  Post.findById(req.params.id)
    .then((post) => {
      // Check to see if comment exists
      if (post.comments.filter(comment => comment._id.toString()
      === req.params.comment_id).length === 0) {
        return res.status(404).json({ commentnotexists: 'Comment does not exist' });
      }

      // Get remove index
      const removeIndex = post.comments
        .map(item => item._id.toString())
        .indexOf(req.params.comment_id);

      // Splice comment out of array
      post.comments.splice(removeIndex, 1);

      return post.save().then(newPost => res.json(newPost));
    })
    .catch(res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;
