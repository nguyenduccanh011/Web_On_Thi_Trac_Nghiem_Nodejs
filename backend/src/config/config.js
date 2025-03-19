//Cấu hình chung cho ứng dụng

module.exports = {
    jwtSecret: process.env.JWT_SECRET ,
    jwtExpiration: process.env.JWT_EXPIRATION || '1h',//Thời gian hến hạn của token
  };