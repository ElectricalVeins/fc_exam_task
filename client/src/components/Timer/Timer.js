import React, { useState, useEffect } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { LinearProgress } from '@material-ui/core';
import styles from './Timer.module.sass';


const Timer = props => {
  const { id, name, finalDate, createdAt, warnDate, itemClass, } = props;

  const checkWarn = () => moment( warnDate ).isBefore( new Date() );
  const checkProgress = () => setProgress( definePercent() );

  const [ progress, setProgress ] = useState( 0 );
  const [ isWarning, setWarning ] = useState( checkWarn() );

  const intervalHandler = () => {
    checkProgress();
    checkWarn() && setWarning( true )  //можно вызвать toast для доп. уведомления
  };

  useEffect( () => {
    checkProgress() // initial definition of the progress bar percentage
    const interval = setInterval( intervalHandler, 5000 );
    return () => {clearInterval( interval )}
  } );

  const definePercent = () => {
    const createdTime = Date.parse( createdAt );
    const total = Date.parse( finalDate ) - createdTime;
    const current = Date.parse( new Date() ) - createdTime;
    const result = 100 / ( total / current );

    return result > 100 ? 100 //delete timer when >110 ?
                        : result
  };

  const listStyles = classNames( styles.listItem, itemClass );

  const renderWarning = () => <>{isWarning &&
  <span className={styles.warn} title={'Warning!'}> </span>}</>

  const deleteHandler = () => {
    props.deleteTimer({name, finalDate, warnDate, id});
  };

  return (
    <li className={listStyles} title={finalDate} onClick={deleteHandler}>
      <div className={styles.info}>
        {
          renderWarning()
        }
        <span className={styles.name}>{name}</span>
        <span className={styles.time}>{moment().to( finalDate, true )}</span>
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

export default Timer;