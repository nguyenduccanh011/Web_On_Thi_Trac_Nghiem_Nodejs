// src/routes/forum.routes.js
const express = require('express');
const forumController = require('../controllers/forum.controller');
const authMiddleware = require('../middlewares/auth.middleware');

const router = express.Router();

// Lấy tất cả topic
router.get('/topics', forumController.getAllTopics);

// Lấy topic theo ID
router.get('/topics/:id', forumController.getTopicById);

// Tạo topic mới (cần xác thực)
router.post('/topics', authMiddleware.verifyToken, forumController.createTopic);

// Lấy tất cả bài viết theo topic ID
router.get('/topics/:id/posts', forumController.getPostsByTopicId);

// Tạo bài viết mới trong một topic (cần xác thực)
router.post('/posts', authMiddleware.verifyToken, forumController.createPost);

// Tìm kiếm topic
router.get('/search', forumController.searchTopics);

// Cập nhật topic (cần xác thực và kiểm tra quyền)
router.put('/topics/:id', authMiddleware.verifyToken, forumController.updateTopic);

// Xóa topic (cần xác thực và kiểm tra quyền)
router.delete('/topics/:id', authMiddleware.verifyToken, forumController.deleteTopic);

// Update post (cần xác thực)
router.put('/posts/:postId', authMiddleware.verifyToken, forumController.updatePost);

// Delete post (cần xác thực)
router.delete('/posts/:postId', authMiddleware.verifyToken, forumController.deletePost);

module.exports = router;