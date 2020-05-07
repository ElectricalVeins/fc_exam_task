import React, { useEffect, useState } from 'react';
import moment                         from 'moment'
import PropTypes                      from 'prop-types';
import Timer                          from "../Timer/Timer";
import styles                         from './TimerList.module.sass'

const TimerList = ( { events, ...props } ) => {

  const [ timers, setTimers ] = useState( null )

  useEffect( () => {
    setTimers( sortArrayByDate( events ) )
  }, [ events ] )

  const sortArrayByDate = ( arr ) => {
    return arr.sort(
      ( a, b ) => {
        const momentDate1 = moment( new Date( a.date ).toISOString() );
        const momentDate2 = moment( new Date( b.date ).toISOString() );

        return moment( momentDate1 ).isBefore( momentDate2 ) ? -1
                                                             : 1
      }
    )
  }

  return (
    <ul className={styles.list}>
      {
        timers && timers.map( ( item ) => <Timer key={item.id} {...item} {...props} /> )
      }
    </ul>
  );
};

TimerList.propTypes = {};

export default TimerList;