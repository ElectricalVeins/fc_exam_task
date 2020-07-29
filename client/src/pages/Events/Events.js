import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import {connect} from 'react-redux';
import * as actionCreator from '../../actions/actionCreator';
import styles from './Events.module.sass'
import Header from "../../components/Header/Header";
import TimerList from "../../components/TimerList/TimerList";
import TimerForm from "../../components/TimerForm/TimerForm";
import Footer from "../../components/Footer/Footer";

const Events = props => {
  //exam react task. use only react
  const {timers,createTimer,getTimers,updateTimer,deleteTimer} = props;

  useEffect(() => {
    getTimers();
    return () => {
      //cleanup
    };
  }, []);

  const handleSubmit = ( newEvent ) => {
    createTimer( newEvent );
  }

  return (
    <>
      <Header/>
      <div className={styles.pageContainer}>
        <div className={styles.pageInfo}>
          <Link to='/dashboard'
                className={styles.infoElem}>Back to Dashboard</Link>
          <p>Live Upcoming Checks</p>
          <TimerList events={timers}
                     deleteTimer={deleteTimer}
                     updateTimer={updateTimer}
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

const mapStateToProps = (state) => {
  return state.timerStore
};

const mapDispatchToProps = dispatch => ({
  getTimers: () => dispatch(actionCreator.createGetTimersAction()),
  createTimer: data => dispatch(actionCreator.createCreateTimerAction(data)),
  deleteTimer: data => dispatch(actionCreator.createDeleteTimerAction(data)),
  updateTimer: data => dispatch(actionCreator.createUpdateTimerAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);