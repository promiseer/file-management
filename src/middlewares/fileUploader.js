const multer = require('multer');

const limits = {
  fileSize: parseInt(process.env.FILE_SIZE, 10) * 1024 * 1024, // 200MB
};

const upload = multer({ storage: multer.memoryStorage(), limits });
module.exports = upload;
