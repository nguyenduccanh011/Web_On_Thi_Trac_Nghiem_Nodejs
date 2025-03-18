// src/services/leaderboard.service.js
const Leaderboard = require('../models/leaderboard.model');
const User = require('../models/user.model');
const { Sequelize } = require('sequelize');

exports.getLeaderboard = async () => {
    try {
        const leaderboard = await Leaderboard.findAll({
            include: [{ model: User, as: 'user', attributes: { exclude: ['password'] } }], // Include user info, exclude password
            order: [['score', 'DESC'], ['last_attempt_date', 'ASC']], // Sắp xếp theo điểm giảm dần, rồi thời gian tăng dần
        });
        return leaderboard;
    } catch (error) {
        throw error;
    }
};

// Cập nhật bảng xếp hạng (có thể được gọi sau mỗi lần user hoàn thành bài thi)
exports.updateLeaderboard = async (userId, score) => {
    try {
        // Kiểm tra xem user đã có trong bảng xếp hạng chưa
        let leaderboardEntry = await Leaderboard.findOne({ where: { user_id: userId } });

        if (leaderboardEntry) {
            // Nếu có, cập nhật điểm và ngày thi cuối
            await leaderboardEntry.update({
                score: score, // Cập nhật điểm (hoặc logic phức tạp hơn, ví dụ: tính điểm trung bình)
                last_attempt_date: new Date(),
            });
        } else {
            // Nếu chưa, thêm user vào bảng xếp hạng
            await Leaderboard.create({
                user_id: userId,
                score: score,
                last_attempt_date: new Date(),
            });
        }

        // Tính toán lại rank (cách này có thể không tối ưu cho bảng xếp hạng lớn)
        await recalculateRanks();

        return { message: 'Leaderboard updated' };
    } catch (error) {
        throw error;
    }
};

// Hàm tính toán lại rank (nên được tối ưu hóa nếu có nhiều user)
async function recalculateRanks() {
    try {
      // Lấy tất cả entries, sắp xếp theo điểm giảm dần và thời gian làm bài tăng dần.
      const entries = await Leaderboard.findAll({
        order: [['score', 'DESC'], ['last_attempt_date', 'ASC']],
      });
  
      // Cập nhật rank cho từng entry.
      let currentRank = 1;
      let previousScore = null;
      let previousAttemptDate = null;
  
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i];
  
        // Nếu điểm số hoặc thời gian làm bài khác với entry trước,
        // thì tăng rank lên.
        if (entry.score !== previousScore || entry.last_attempt_date !== previousAttemptDate) {
          currentRank = i + 1;
        }
  
        // Cập nhật rank và lưu lại.
        await entry.update({ rank: currentRank });
  
        // Cập nhật điểm và thời gian làm bài trước đó.
        previousScore = entry.score;
        previousAttemptDate = entry.last_attempt_date;
      }
    } catch (error) {
      console.error('Error recalculating ranks:', error);
      throw error;
    }
  }