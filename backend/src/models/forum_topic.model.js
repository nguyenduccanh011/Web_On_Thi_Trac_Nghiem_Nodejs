// src/models/forum_topic.model.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user.model');

const ForumTopic = sequelize.define('ForumTopic', {
    topic_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    title: {
        type: DataTypes.STRING(255),
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
    tableName: 'forum_topics',
    timestamps: true,
     updatedAt: 'updated_at',
    createdAt: 'created_at',
});

ForumTopic.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = ForumTopic;