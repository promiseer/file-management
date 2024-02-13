const httpStatus = require('http-status');
const path = require('path');
const fs = require('fs');
const { File } = require('../models');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

const storagePath = path.join(__dirname, 'public', process.env.FILE_UPLOAD_PATH);

/**
 * Create a user
 * @param {Object} file
 * @returns {Promise<User>}
 */
const uploadFile = async (file) => {
  const filePath = `${storagePath}/${file.originalname}`;
  if (!file) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid file object');
  }
  if (fs.existsSync(filePath)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'file already uploaded!');
  }

  fs.writeFileSync(`${storagePath}/${file.originalname}`, file.buffer, (err) => {
    if (err) {
      logger.error('Error writing file:', err);
      return new ApiError(httpStatus.BAD_REQUEST, 'Error writing file');
    }
  });
  await File.create({
    name: file.originalname,
    encoding: file.encoding,
    mime: file.mimetype,
    size: file.size,
    location: filePath,
  });

  return { message: 'File uploaded successfully' };
};

const listFiles = async (filter, options) => {
  const files = await File.paginate(filter, options);
  return files;
};

const updateFileById = async () => {
  const files = await fs.promises.readdir(storagePath);
  return files;
};

const getFileById = async (id) => {
  return File.findById(id);
};

const deleteFileById = async (id) => {
  const file = await getFileById(id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  const filePath = path.join(storagePath, file.name);
  await fs.promises.unlink(filePath);
  await file.remove();
  return { message: 'File deleted successfully' };
};

module.exports = {
  uploadFile,
  listFiles,
  getFileById,
  updateFileById,
  deleteFileById,
};
