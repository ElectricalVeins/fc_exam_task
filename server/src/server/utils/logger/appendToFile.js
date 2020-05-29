const fs = require('fs');

async function appendToFile(fPath, data, start, flags) {
  try {
    const streamLog = await fs.createWriteStream(fPath, {
      flags,
      start,
    });
    await streamLog.write(data, 'utf-8');
    streamLog.end();
  } catch (err) {
    throw err;
  }
}

module.exports = appendToFile;
