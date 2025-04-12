

const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const DifficultyLevel = sequelize.define(
  "DifficultyLevel",
  {
    difficult_level_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    difficult_level_text: {
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
  },
  {
    tableName: "difficulty_levels",
    timestamps: true,
    updatedAt: "updated_at",
    createdAt: "created_at",
  }
);
module.exports = DifficultyLevel;
