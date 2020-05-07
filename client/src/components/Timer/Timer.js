import React, { useState, useEffect } from 'react';
import PropTypes                      from 'prop-types';
import moment                         from 'moment'
import classNames                     from 'classnames'
import { LinearProgress }             from '@material-ui/core';
import styles                         from './Timer.module.sass'


const Timer = props => {
  const {
    name,
    date,
    createdAt,
    warningTime,
    itemClass,
    progressBarStyle
  } = props;

  const [ progress, setProgress ] = useState( 0 )

  useEffect( () => {
    setProgress( definePercent() ) // initial definition of the progress bar percentage

    const interval = setInterval( () => setProgress( definePercent() ), 5000 )
    return () => {clearInterval( interval )}
  } )

  const definePercent = () => {
    const createdTime = Date.parse( createdAt );
    const total = Date.parse( date ) - createdTime;
    const current = Date.parse( new Date() ) - createdTime;
    const result = 100 / ( total / current );

    return result > 100 ? 100 : result
  };

  const listStyles = classNames( styles.listItem, itemClass )

  return (
    <li className={listStyles} title={date}>
      <div className={styles.info}>
        <span className={styles.name}>{name}</span>
        <span className={styles.time}>{moment().to( date, true )}</span>
      </div>
      <LinearProgress value={+progress}
                      variant='determinate'
                      classes={{
                        root: styles.progressBar,
                        colorPrimary: styles.colorPrimary,
                        barColorPrimary: styles.barColorPrimary
                      }}/>
    </li>
  );
};

Timer.propTypes = {};

export default Timer;