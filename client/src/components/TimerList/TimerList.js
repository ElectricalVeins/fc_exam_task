import React from 'react';
import Timer from "../Timer/Timer";
import styles from './TimerList.module.sass';

const TimerList = ({ events, ...props }) => {

  return (
    <ul className={styles.list}>
      {
        events && events.length > 0 && events.map((item) => <Timer key={item.id} {...item} {...props} />)
      }
    </ul>
  );
};

export default TimerList;