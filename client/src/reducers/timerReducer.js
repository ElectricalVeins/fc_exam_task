import ACTION from '../actions/actionTypes';
import actions from 'redux-form/lib/actions';

const initialState = {
    isFetching: true,
    error: null,
    timers: null
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
        default:
            return state;
    }
}

