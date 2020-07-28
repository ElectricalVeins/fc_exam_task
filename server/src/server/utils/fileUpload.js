const multer = require('multer');
const fs = require('fs');
const { promisify } = require('util');
const ServerError = require('../errors/ServerError');
const env = process.env.NODE_ENV || 'development';
const filePath = env==='production'? '/var/www/html/images/' : 'public/images/';

const access = promisify(fs.access);
const mkdir = promisify(fs.mkdir);

const isPathExists = async (filePath) => {
  try {
    await access(filePath);
    return true;
  } catch (err) {
    return false;
  }
};

const createPath = async (filePath) => {
  try{
    await mkdir(filePath, { recursive: true });
  }catch (err) {
    throw new Error('Multer Error');
  }
};

const storageContestFiles = multer.diskStorage({
  async destination(req, file, cb) {
    const exist = await isPathExists(filePath);
    if (!exist) {
      await createPath(filePath);
    }
    cb(null, filePath);
  },
  filename (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const uploadAvatars = multer({ storage: storageContestFiles }).single('file');
const uploadContestFiles = multer({ storage: storageContestFiles }).array('files', 3);
const updateContestFile = multer({ storage: storageContestFiles }).single('file');
const uploadLogoFiles = multer({ storage: storageContestFiles }).single('offerData');

module.exports.uploadAvatar = (req, res, next) => {
  uploadAvatars(req, res, (err)=>{
    if (err instanceof multer.MulterError) {
      return next(new ServerError(err));
    } else if (err) {
      return next(new ServerError(err));
    }
    return next();
  });
};

module.exports.uploadContestFiles = async (req, res, next)=>{
  uploadContestFiles(req, res, (err)=>{
    if (err instanceof multer.MulterError) {
      return next(new ServerError(err));
    } else if (err) {
      return next(new ServerError(err));
    }
    return next();
  });
};

module.exports.updateContestFile=(req, res, next)=>{
  updateContestFile(req, res, (err)=>{
    if (err instanceof multer.MulterError) {
      return next(new ServerError(err));
    } else if (err) {
      return next(new ServerError(err));
    }
    return next();
  });
};

module.exports.uploadLogoFiles=(req, res, next)=>{
  uploadLogoFiles(req, res, (err)=>{
    if (err instanceof multer.MulterError) {
      return next(new ServerError(err));
    } else if (err) {
      return next(new ServerError(err));
    }
    return next();
  });
};

