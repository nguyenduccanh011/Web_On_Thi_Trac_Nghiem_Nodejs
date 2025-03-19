// src/controllers/forum.controller.js
const forumService = require('../services/forum.service');

exports.getPostsByTopicId = async (req, res) => {
    try {
        const topicId = req.params.id;
        const posts = await forumService.getPostsByTopicId(topicId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topicData = req.body;
        const updatedTopic = await forumService.updateTopic(topicId, topicData);
        res.json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        await forumService.deleteTopic(topicId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postData = req.body;
        const updatedPost = await forumService.updatePost(postId, postData);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        await forumService.deletePost(postId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTopics = async (req, res) => {
    try {
        const topics = await forumService.getAllTopics();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getTopicById = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await forumService.getTopicById(topicId);
        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createTopic = async (req, res) => {
    try {
        const topicData = req.body;
        const newTopic = await forumService.createTopic(topicData);
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createPost = async (req, res) => {
    try {
        const postData = req.body;
        const newPost = await forumService.createPost(postData);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchTopics = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const topics = await forumService.searchTopics(searchTerm);
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPostsByTopicId: exports.getPostsByTopicId,
    updateTopic: exports.updateTopic,
    deleteTopic: exports.deleteTopic,
    updatePost: exports.updatePost,
    deletePost: exports.deletePost,
    getAllTopics: exports.getAllTopics,
    getTopicById: exports.getTopicById,
    createTopic: exports.createTopic,
    createPost: exports.createPost,
    searchTopics: exports.searchTopics
};