import { put } from 'redux-saga/effects';
import ACTION from '../actions/actionTypes';
import history from '../browserHistory';
import CONSTANTS from '../constants';
import * as restController from '../api/rest/restController';



export function* getTimersSaga(action) {
    try {
        const { data } = yield restController.getTimers();
        yield put({ type: ACTION.GET_TIMERS_SUCCESS, data });
    }
    catch (err) {
        yield put({ type: ACTION.GET_TIMERS_ERROR, error: err.response });
    }
}

export function* createTimerSaga(action) {
    try {
        const { data } = yield restController.createTimer(action.data);
        yield put({ type: ACTION.CREATE_TIMER_SUCCESS, data });
    }
    catch (err) {
        yield put({ type: ACTION.CREATE_TIMER_ERROR, error: err.response });
    }
}

export function* deleteTimerSaga(action) {
    try {
        const { data } = yield restController.deleteTimer(action.data.id);
        yield put({ type: ACTION.DELETE_TIMER_SUCCESS, data: action.data });
    }
    catch (err) {
        yield put({ type: ACTION.DELETE_TIMER_ERROR, error: err.response });
    }
}

export function* updateTimerSaga(action) {
    try {
        const { data } = yield restController.updateTimer(action.data);
        yield put({ type: ACTION.UPDATE_TIMER_SUCCESS, data });
    }
    catch (err) {
        yield put({ type: ACTION.UPDATE_TIMER_ERROR, error: err.response });
    }
}



