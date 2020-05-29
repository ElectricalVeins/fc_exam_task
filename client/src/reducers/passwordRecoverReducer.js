import ACTION from '../actions/actionTypes';


const initialState = {
  isFetching: false,
  error: null,
  formResult: null,
  data: null,
};

export default function ( state = initialState, action ) {
  switch ( action.type ) {
    case ACTION.RESTORE_PASSWORD_ACTION: {
      return {
        ...state,
        isFetching: true
      }
    }
    case ACTION.RESTORE_PASSWORD_SUCCESS: {
      return {
        ...state,
        formResult: action.data,
        isFetching: false,
      }
    }
    case ACTION.UPDATE_PASSWORD_ERROR: {
      const { error } = action
      return {
        ...state,
        error,
        isFetching: false
      }
    }
    case ACTION.UPDATE_PASSWORD_SUCCESS: {
      const { data } = action
      return {
        ...state,
        data,
        isFetching: false
      }
    }
    case ACTION.UPDATE_LOST_PASSWORD: {
      return {
        ...state,
        isFetching: true
      }
    }
    case ACTION.CLEAR_PASSWORD_RECOVER_STATE: {
      return initialState
    }
    default:
      return state;
  }
}