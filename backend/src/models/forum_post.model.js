// src/models/forum_post.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ForumTopic = require('./forum_topic.model');
const User = require('./user.model'); // Import model User

const ForumPost = sequelize.define('ForumPost', {
    post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    topic_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ForumTopic,
            key: 'topic_id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { // Thêm references để xác định khóa ngoại
          model: User,
          key: 'user_id'
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updated_at: {
        type: DataTypes.DATE,
    },
}, {
    tableName: 'forum_posts',
    timestamps: true, // Bật timestamps
    updatedAt: 'updated_at',
    createdAt: 'created_at',
});

ForumPost.belongsTo(ForumTopic, { foreignKey: 'topic_id', as: 'topic' });
ForumPost.belongsTo(User, { foreignKey: 'user_id', as: 'user' }); // Thêm mối quan hệ với User

module.exports = ForumPost;