import ACTION from '../actions/actionTypes';
import CONSTANTS from '../constants';

const initialState = {
    formMode: CONSTANTS.CREATE_TIMER_MODE,
    isFetching: true,
    error: null,
    timers: null,
    currentTimer: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case ACTION.GET_TIMERS: {
            return {
                ...state,
                isFetching: true,
                error: null,
                timers: null
            }
        }
        case ACTION.GET_TIMERS_SUCCESS: {
            return {
                ...state,
                isFetching: false,
                error: null,
                timers: action.data
            }
        }
        case ACTION.GET_TIMERS_ERROR: {
            return {
                ...state,
                isFetching: false,
                error: action.error,
                timers: null
            }
        }
        case ACTION.CREATE_TIMER_ERROR: {
            return {
                ...state,
                error: action.error,
            }
        }
        case ACTION.CREATE_TIMER_SUCCESS: {
            const { timers } = state;
            return {
                ...state,
                timers: [...timers, action.data],
            }
        }
        case ACTION.CLEAR_TIMER_ERROR: {
            return {
                ...state,
                error: null,
            }
        }
        case ACTION.DELETE_TIMER_SUCCESS: {
            const newTimerArray = [];
            const { timers } = state;
            const { data } = action;

            for (const timer of timers) {
                if (timer.id !== data.id) {
                    newTimerArray.push(timer);
                }
            }

            return {
                ...state,
                timers: newTimerArray,
            }
        }
        case ACTION.DELETE_TIMER_ERROR: {
            return {
                ...state,
                error: action.error,
            }
        }
        case ACTION.UPDATE_TIMER_SUCCESS: {
            const newTimerArray = [];
            const { timers } = state;
            const { data } = action;
            for (const timer of timers) {
                if (timer.id === data.id) {
                    newTimerArray.push(data);
                    continue;
                }
                newTimerArray.push(timer);
            }

            return {
                ...state,
                timers: newTimerArray,
            }
        }
        case ACTION.UPDATE_TIMER_ERROR: {
            return {
                ...state,
                error: action.error,
            }
        }
        case ACTION.CLEAR_TIMER_STORE: {
            return initialState;
        }
        case ACTION.OPEN_EDIT_TIMER_FORM: {
            const currentTimer = { ...action.data }
            return {
                ...state,
                currentTimer,
                formMode: CONSTANTS.UPDATE_TIMER_MODE,
            }
        }
        case ACTION.OPEN_CREATE_TIMER_FORM: {
            return {
                ...state,
                currentTimer: null,
                formMode: CONSTANTS.CREATE_TIMER_MODE,
            }
        }
        default:
            return state;
    }
}

