const fs = require('fs');
const _ = require('lodash');
const { promisify } = require('util');
const { LOG_PROPS, LOG_FILE_PATH, LAST_CHARS_TO_DELETE, DUMPS_PATH } = require('../../../constants');
const appendToFile = require('./appendToFile.js');
const ensureExists = require('./ensurePathExist');
const stat = promisify(fs.stat);
const open = promisify(fs.open);

async function checkFileExistence(filePath) {
  try {
    const result = await open(filePath, 'r');
    return typeof result === 'number';
  } catch (err) {
    if (err && (err.code === 'EEXIST' || err.code === 'ENOENT')) {
      return false;
    }
    throw err;
  }
}

async function getFileSize(filePath) {
  const stats = await stat(filePath);
  return stats.size;
}

function createLogObject(object, start, props) {
  const time = { time: Date.parse(new Date()) };
  const properties = _.pick(object, props);
  const logInfo = _.assign(time, properties);
  const jsonStr = JSON.stringify(logInfo);
  if (start === 1) {
    return jsonStr + ']';
  }
  return ',' + jsonStr + ']';
}

module.exports.logToFile = async (data) => {
  try {
    await ensureExists(DUMPS_PATH);
    const isFileExist = await checkFileExistence(LOG_FILE_PATH);

    if (!isFileExist) {
      await appendToFile(LOG_FILE_PATH, '[]', 0, 'w');
    }

    let start = await getFileSize(LOG_FILE_PATH) - LAST_CHARS_TO_DELETE;

    if (start === -1) {
      start = await getFileSize(LOG_FILE_PATH) - LAST_CHARS_TO_DELETE;
    }

    const appendData = await createLogObject(data, start, LOG_PROPS);
    await appendToFile(LOG_FILE_PATH, appendData, start, 'r+');
  } catch (err) {
    console.log(err);
  }
};
