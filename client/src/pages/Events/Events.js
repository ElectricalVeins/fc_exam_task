import React, { useEffect } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actionCreator';
import styles from './Events.module.sass'
import Header from "../../components/Header/Header";
import TimerList from "../../components/TimerList/TimerList";
import TimerForm from "../../components/TimerForm/TimerForm";
import Footer from "../../components/Footer/Footer";
import CONSTANTS from '../../constants';
import ACTION from '../../actions/actionTypes';

const Events = props => {
  const { currentTimer, formMode, timers, createTimer, getTimers, updateTimer, deleteTimer, closeEditor } = props;

  useEffect(() => {
    getTimers();
    return () => {
      //cleanup
    };
  }, []);


  const handleSubmit = (newEvent) => {
    if (newEvent.update) {
      const { name, finalDate, warnDate } = newEvent;
      const newTimer = {
        ...currentTimer,
        name,
        finalDate,
        warnDate,
      };
      updateTimer(newTimer);
    } else {
      createTimer(newEvent);
    }
  };

  const renderForm = () => {
    return (<>
      {formMode === CONSTANTS.CREATE_TIMER_MODE && <TimerForm submitHandler={handleSubmit} initialValues={{}} />}
      {formMode === CONSTANTS.UPDATE_TIMER_MODE && <TimerForm submitHandler={handleSubmit} initialValues={currentTimer} />}
    </>)
  };

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <div className={styles.pageInfo}>
          <Link to='/dashboard'
            className={styles.infoElem}>Back to Dashboard</Link>
          <p>Live Upcoming Checks</p>
          <TimerList events={timers}
            deleteTimer={deleteTimer}
            updateTimer={updateTimer}
            itemClass={styles.timerItem} />
        </div>
        <div className={styles.createTimerContainer}>
          <h1 className={styles.headLine}>
            Want to {
              <span className={styles.headerAction} onClick={() => { closeEditor() }}>
                create
                </span>
            } a new Timer before the specific event?</h1>
          {renderForm()}
        </div>
      </div>
      <Footer />
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
  closeEditor: () => dispatch({ type: ACTION.OPEN_CREATE_TIMER_FORM })
});

export default connect(mapStateToProps, mapDispatchToProps)(Events);