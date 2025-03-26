// src/controllers/forum.controller.js
const forumService = require('../services/forum.service');

const getPostsByTopicId = async (req, res) => {
    try {
        const topicId = req.params.id;
        const posts = await forumService.getPostsByTopicId(topicId);
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topicData = req.body;
        const updatedTopic = await forumService.updateTopic(topicId, topicData);
        res.json(updatedTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteTopic = async (req, res) => {
    try {
        const topicId = req.params.id;
        await forumService.deleteTopic(topicId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const postData = req.body;
        const updatedPost = await forumService.updatePost(postId, postData);
        res.json(updatedPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        await forumService.deletePost(postId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllTopics = async (req, res) => {
    try {
        const topics = await forumService.getAllTopics();
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTopicById = async (req, res) => {
    try {
        const topicId = req.params.id;
        const topic = await forumService.getTopicById(topicId);
        res.json(topic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createTopic = async (req, res) => {
    try {
        const topicData = req.body;
        const newTopic = await forumService.createTopic(topicData);
        res.status(201).json(newTopic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createPost = async (req, res) => {
    try {
        const postData = req.body;
        const newPost = await forumService.createPost(postData);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchTopics = async (req, res) => {
    try {
        const searchTerm = req.query.q;
        const topics = await forumService.searchTopics(searchTerm);
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPostsByTopicId,
    updateTopic,
    deleteTopic,
    updatePost,
    deletePost,
    getAllTopics,
    getTopicById,
    createTopic,
    createPost,
    searchTopics
};