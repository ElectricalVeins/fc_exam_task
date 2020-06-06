import ACTION from '../actions/actionTypes';
import _ from 'lodash';

const initialState = {
  isFetching: false,
  error: null,
  offers: [],
  isShowModal: false,
  filePath: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case ACTION.GET_UN_MODERATED_OFFERS: {
      return {
        ...state,
        isFetching: true,
      };
    }
    case ACTION.GET_UN_MODERATED_OFFERS_ERROR: {
      return {
        ...state,
        error: action.data,
        isFetching: false,
      };
    }
    case  ACTION.GET_UN_MODERATED_OFFERS_SUCCESS: {
      return {
        ...state,
        isFetching: false,
        offers: [...state.offers, ...action.data]
      };
    }
    case ACTION.CLEAR_OFFER_STORE: {
      return initialState;
    }
    case ACTION.MODERATOR_SET_OFFER_SUCCESS: {
      const {data} = action;
      const {offers} = state;

      const newOffers = _.clone(offers);
      const key = _.findIndex(newOffers, {id: data.id},)
      newOffers.splice(key, 1)

      return {
        ...state,
        offers: [...newOffers]
      };
    }
    case ACTION.MODERATOR_SET_OFFER_ERROR:{
      return {
        ...state,
        error: action.data
      }
    }
    case ACTION.CHANGE_MODERATOR_OFFERS_MODAL: {
      const {data: {isShowModal, filePath}} = action
      return {
        ...state,
        isShowModal,
        filePath
      }
    }
    default:
      return state;
  }

}