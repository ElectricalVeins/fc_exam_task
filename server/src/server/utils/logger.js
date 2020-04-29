const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const { promisify } = require( 'util' );
const { LOG_PROPS, LOG_FILE_PATH } = require( '../../constants' )
const stat = promisify( fs.stat );
const open = promisify( fs.open );

async function checkFileExistence( fPath ) {
  try {
    const result = await open( fPath, 'wx' )
    console.log( 'RESULT=>', result )
    if( result && result.code === 'EEXIST' ) {
      return;
    }
  } catch ( e ) {
    console.log( 'CATCHED ERROR---', e )
    await appendToFile( '[]', 0, LOG_FILE_PATH ) //сделать func createFile
  }
}

async function getFileSize( fPath ) {
  const stats = await stat( fPath );
  return stats.size
}
async function createLogObject( object, start, props ) {
  const time = { time: Date.parse( new Date() ) };
  const properties = _.pick( object, props )
  const logInfo = _.assign( time, properties )
  const jsonStr = JSON.stringify( logInfo )

  if( start !== 1 ) {
    return ',' + jsonStr + ']'
  }
  return jsonStr + ']'
}

async function appendToFile( data, start, fPath ) {
  /*  if( start < 0 ) {
   return;
   }*/
  const streamLog = await fs.createWriteStream( fPath, {
    flags: 'r+',
    start
  } )
  await streamLog.write( data, 'utf-8' );
  streamLog.end();
}

async function logToFile( data ) {
  try {
    //await checkFileExistence( LOG_FILE_PATH )
    const start = await getFileSize( LOG_FILE_PATH ) - 1
    console.log( 'Start Is ==>', start )
    const appendData = await createLogObject( data, start, LOG_PROPS )
    await appendToFile( appendData, start, LOG_FILE_PATH )
  } catch ( err ) {
    throw err
  }
}

module.exports = logToFile;