// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info', // Các level log: error, warn, info, verbose, debug, silly
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }), // Ghi lại stack trace của lỗi
    winston.format.splat(), // Cho phép truyền nhiều tham số vào hàm log
    winston.format.json() // Định dạng log là JSON
  ),
  defaultMeta: { service: 'trac-nghiem-tieng-anh' }, // Thông tin mặc định (tên service)
  transports: [
    //
    // - Ghi tất cả log có level `info` hoặc thấp hơn vào `combined.log`
    // - Ghi tất cả log có level `error` hoặc thấp hơn vào `error.log`
    //
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ]
});

//
// Nếu không chạy trong môi trường production, ghi log ra console
// với định dạng đơn giản hơn.
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

module.exports = logger;