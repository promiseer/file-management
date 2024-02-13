const httpStatus = require('http-status');
// const Busboy = require('busbooy');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { fileService } = require('../services');

const uploadFile = catchAsync(async (req, res) => {
  const { file } = req;
  const user = await fileService.uploadFile(file, req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getFiles = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'size']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await fileService.listFiles(filter, options);
  res.send(result);
});

const getFile = catchAsync(async (req, res) => {
  const file = await fileService.getFileById(req.params.id);
  if (!file) {
    throw new ApiError(httpStatus.NOT_FOUND, 'File not found');
  }
  res.send(file);
});

const updateFile = catchAsync(async (req, res) => {
  const user = await fileService.updateFileById(req.params.userId, req.body);
  res.send(user);
});

const deleteFile = catchAsync(async (req, res) => {
  const file = await fileService.deleteFileById(req.params.id);
  res.status(httpStatus.OK).send(file);
});

module.exports = {
  uploadFile,
  getFiles,
  getFile,
  updateFile,
  deleteFile,
};
