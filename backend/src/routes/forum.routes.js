// src/routes/forum.routes.js
const express = require('express');
const forumController = require('../controllers/forum.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Public routes
router.get('/topics', forumController.getAllTopics);
router.get('/topics/:id', forumController.getTopicById);
router.get('/topics/:id/posts', forumController.getPostsByTopicId);
router.get('/search', forumController.searchTopics);

// Protected routes - require authentication
router.post('/topics', authMiddleware, forumController.createTopic);
router.post('/posts', authMiddleware, forumController.createPost);
router.put('/topics/:id', authMiddleware, forumController.updateTopic);
router.delete('/topics/:id', authMiddleware, forumController.deleteTopic);
router.put('/posts/:postId', authMiddleware, forumController.updatePost);
router.delete('/posts/:postId', authMiddleware, forumController.deletePost);

module.exports = router;