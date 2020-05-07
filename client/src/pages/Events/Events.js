import React, { useEffect, useState } from 'react';
import PropTypes                      from 'prop-types';
import { Link }                       from 'react-router-dom'
import styles                         from './Events.module.sass'
import Header                         from "../../components/Header/Header";
import TimerList                      from "../../components/TimerList/TimerList";
import TimerForm                      from "../../components/TimerForm/TimerForm";
import Footer                         from "../../components/Footer/Footer";

const Events = props => {
  const [ events, setEvents ] = useState( [ {
    id: '1',
    name: 'TimerList name1',
    date: '2020-06-30 9:00',
    createdAt: '2019-03-30 9:00',
    warningTime: '2019-03-30 8:00'
  }, {
    id: '2',
    name: 'TimerList name2',
    date: '2020-06-01 9:00',
    createdAt: '2020-04-30 9:00',
    warningTime: '2020-04-30 8:00'
  }, {
    id: '3',
    name: 'TimerList name3',
    date: '2020-06-28 9:00',
    createdAt: '2020-04-30 9:00',
    warningTime: '2020-04-30 8:00'
  }, {
    id: '4',
    name: 'TimerList name4',
    date: '2020-06-28 9:00',
    createdAt: '2020-04-27 9:00',
    warningTime: '2020-04-27 8:00'
  }, {
    id: '5',
    name: 'Close Timer',
    date: '2020-05-08 19:46',
    createdAt: '2020-05-07 9:00',
    warningTime: '2020-05-07 8:00'
  }
  ] )

  const handleSubmit = ( newEvent ) => {
    newEvent.id = Math.floor( Math.random() * 1000 )
    newEvent.createdAt = new Date();

    setEvents( [ ...events, newEvent ] )
  }

  return (
    <>
      <Header/>
      <div className={styles.pageContainer}>
        <div className={styles.pageInfo}>
          <Link to='/dashboard'
                className={styles.infoElem}>Back to Dashboard</Link>
          <p>Live Upcoming Checks</p>
          <TimerList events={events}
                     itemClass={styles.timerItem}/>
        </div>
        <div className={styles.createTimerContainer}>
          <h1 className={styles.headLine}>Want to create a new Timer before the specific event?</h1>
          <TimerForm submitHandler={handleSubmit}/>
        </div>
      </div>
      <Footer/>
    </>
  );
};


export default Events;