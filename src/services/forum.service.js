// src/services/forum.service.js
const ForumTopic = require('../models/forum_topic.model');
const ForumPost = require('../models/forum_post.model');
const User = require('../models/user.model');
const { Sequelize } = require("sequelize");

exports.getAllTopics = async () => {
    try {
        const topics = await ForumTopic.findAll({
            include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }], // Include user info, exclude password
        });
        return topics;
    } catch (error) {
        throw error;
    }
};

exports.getTopicById = async (topicId) => {
    try {
        const topic = await ForumTopic.findByPk(topicId, {
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                {
                    model: ForumPost,
                    as: 'posts', // 'posts' là alias bạn đặt trong mối quan hệ
                    include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
                },
            ],
        });
        if (!topic) {
            throw new Error('Topic not found');
        }
        return topic;
    } catch (error) {
        throw error;
    }
};

exports.createTopic = async (topicData) => {
    try {
        // Kiểm tra quyền user (nếu cần)
        const newTopic = await ForumTopic.create(topicData);
          // Lấy lại thông tin topic với thông tin người dùng (tùy chọn):
        const createdTopic = await ForumTopic.findByPk(newTopic.topic_id, {
            include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
        });
        return createdTopic;
    } catch (error) {
        throw error;
    }
};

exports.createPost = async (postData) => {
    try {
        const newPost = await ForumPost.create(postData);
         // Lấy lại thông tin post với thông tin người dùng và topic (tùy chọn):
        const createdPost = await ForumPost.findByPk(newPost.post_id, {
            include: [
              { model: ForumTopic, as: 'topic' },
              { model: User, as: 'user', attributes: { exclude: ['password'] } },
            ],
          });
        return createdPost;
    } catch (error) {
        throw error;
    }
};
// Tìm kiếm topic
exports.searchTopics = async (searchTerm) => {
  try {
    const topics = await ForumTopic.findAll({
      where: {
        title: {
          [Sequelize.Op.like]: `%${searchTerm}%`,
        },
      },
      include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }],
    });
    return topics;
  } catch (error) {
    throw error;
  }
};

// Lấy các bài post theo topic ID
exports.getPostsByTopicId = async (topicId) => {
    try {
        const posts = await ForumPost.findAll({
            where: { topic_id: topicId },
            include: [
                { model: User, as: 'user', attributes: { exclude: ['password'] } },
                { model: ForumTopic, as: 'topic' }, // Include topic info if needed
            ],
        });
        return posts;
    } catch (error) {
        throw error;
    }
};

//update topic
exports.updateTopic = async (topicId, topicData) => {
    try {
        const topic = await ForumTopic.findByPk(topicId);
        if(!topic) {
            throw new Error('Topic not found');
        }
        await topic.update(topicData);
        const updatedTopic = await ForumTopic.findByPk(topicId, {
            include: [{ model: User, as: 'user', attributes: {exclude: ['password']}}]
        });
        return updatedTopic;
    } catch (error) {
        throw error;
    }
}

//update post
exports.updatePost = async (postId, postData) => {
    try {
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }
  
      await post.update(postData);
      const updatePost = await ForumPost.findByPk(postId, {
        include: [
            { model: ForumTopic, as: 'topic' },
            { model: User, as: 'user', attributes: { exclude: ['password'] } },
          ],
      });
      return updatePost;
    } catch (error) {
      throw error;
    }
  };

  //delete topic
  exports.deleteTopic = async (topicId) => {
    try {
        const topic = await ForumTopic.findByPk(topicId);
        if(!topic) {
            throw new Error("Topic not found");
        }

        // Xóa các bài post liên quan đến topic đó
        await ForumPost.destroy({where: {topic_id: topicId}});

        //xóa topic
        await topic.destroy();
        return {message: "Topic deleted successfully"};
    } catch (error) {
        throw error
    }
  }

  //delete post
  exports.deletePost = async (postId) => {
    try {
      const post = await ForumPost.findByPk(postId);
      if (!post) {
        throw new Error('Post not found');
      }
      await post.destroy();
      return { message: 'Post deleted successfully' };
    } catch (error) {
      throw error;
    }
  };