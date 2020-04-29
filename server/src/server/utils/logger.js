const fs = require( 'fs' );
const path = require( 'path' );
const _ = require( 'lodash' );
const { promisify } = require( 'util' );
const { LOG_PROPS, LOG_FILE_PATH } = require( '../../constants' )
const stat = promisify( fs.stat );
const open = promisify( fs.open );
