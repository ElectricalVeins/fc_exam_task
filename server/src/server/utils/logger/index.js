const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const { promisify } = require( 'util' );
const { LOG_PROPS, LOG_FILE_PATH, LAST_CHARS_TO_DELETE } = require( '../../../constants' )
const stat = promisify( fs.stat );
const open = promisify( fs.open );

async function checkFileExistence( fPath ) {
  try {
    const result = await open( fPath, 'r' )
    return typeof result === 'number';
  } catch ( err ) {
    if( err && ( err.code === 'EEXIST' || err.code === 'ENOENT' ) ) {
      return false;
    }
    throw err
  }
}

async function getFileSize( fPath ) {
  try {
    const stats = await stat( fPath );
    return stats.size
  } catch ( e ) {
    throw e
  }
}

function createLogObject( object, start, props ) {
  const time = { time: Date.parse( new Date() ) };
  const properties = _.pick( object, props )
  const logInfo = _.assign( time, properties )
  const jsonStr = JSON.stringify( logInfo )
  if( start === 1 ) {
    return jsonStr + ']'
  }
  return ',' + jsonStr + ']' //изменено
}

async function appendToFile( fPath, data, start, flags ) {
  try {
    const streamLog = await fs.createWriteStream( fPath, {
      flags,
      start
    } )
    await streamLog.write( data, 'utf-8' );
    streamLog.end();
  } catch ( e ) {
    throw e
  }
}

async function logToFile( data ) {
  try {
    const isFileExist = await checkFileExistence( LOG_FILE_PATH )

    if( !isFileExist ) {
      await appendToFile( LOG_FILE_PATH, '[]', 0, 'w' ); //или создавать файл синхронно?
    }

    let start = await getFileSize( LOG_FILE_PATH ) - LAST_CHARS_TO_DELETE

    if( start === -1 ) {
      start = await getFileSize( LOG_FILE_PATH ) - LAST_CHARS_TO_DELETE
    }

    const appendData = await createLogObject( data, start, LOG_PROPS )
    await appendToFile( LOG_FILE_PATH, appendData, start, 'r+' )

    console.log( 'RETURN' )
  } catch ( err ) {
    console.log( 'RETURN MAIN FUNC ERROR' )
    throw err
  }
}

module.exports = logToFile;