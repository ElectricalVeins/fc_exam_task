import React, { useEffect, useState } from 'react';
import moment from 'moment';
import Timer from "../Timer/Timer";
import styles from './TimerList.module.sass';

const TimerList = ( { events, ...props } ) => {


/*    useEffect( () => {
    sortArrayByDate( events );
  }, [ events ] );

  const sortArrayByDate = ( arr ) => {
    return arr.sort( ( a, b ) => {
      const momentDate1 = moment( new Date( a.date ).toISOString() );
      const momentDate2 = moment( new Date( b.date ).toISOString() );

      return moment( momentDate1 ).isBefore( momentDate2 ) ? -1
                                                           : 1
    } );
  };  */

  return (
    <ul className={styles.list}>
      {
        events && events.length > 0 && events.map( ( item ) => <Timer key={item.id} {...item} {...props} /> )
      }
    </ul>
  );
};

export default TimerList;