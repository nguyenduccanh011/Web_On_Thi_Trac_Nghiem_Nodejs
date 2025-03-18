// src/controllers/forum.controller.js
const forumService = require('../services/forum.service');

// ... (các hàm getAllTopics, getTopicById, createTopic, createPost, searchTopics đã có)

exports.getPostsByTopicId = async (req, res) => {
    try {
        const topicId = req.params.id;
        const posts = await forumService.getPostsByTopicId(topicId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm các hàm update, delete cho Topic và Post nếu cần (tùy vào yêu cầu)
// Ví dụ (nếu có quyền xóa/sửa):
exports.updateTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topicData = req.body;
        // Kiểm tra quyền (ví dụ: chỉ admin hoặc người tạo topic mới được sửa)
        // if (req.user.role !== 'admin' && req.user.userId !== topicData.user_id) {
        //     return res.status(403).json({ message: 'Forbidden' });
        // }
        const updatedTopic = await forumService.updateTopic(topicId, topicData);
        res.json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTopic = async (req, res) => {
  try {
    const topicId = req.params.id;
    // Kiểm tra quyền tương tự như updateTopic

    await forumService.deleteTopic(topicId);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId; // ID của bài viết nằm trong URL
        const postData = req.body;

        // Kiểm tra quyền (chỉ admin hoặc người tạo mới được sửa)
        const updatedPost = await forumService.updatePost(postId, postData);
        res.json(updatedPost);
    } catch(error){
        res.status(500).json({message: error.message});
    }
}

exports.deletePost = async (req, res) => {
    try {
      const postId = req.params.postId;
       // Kiểm tra quyền
      await forumService.deletePost(postId);
      res.status(204).send();
    } catch(error) {
      res.status(500).json({message: error.message});
    }
}