import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import LightBox from 'react-image-lightbox';
import { connect } from 'react-redux';
import * as actionCreator from '../../actions/actionCreator';
import ModeratorOfferBox from "../ModeratorOfferBox/ModeratorOfferBox";
import ModeratorOfferContainer from "../ModeratorOfferContainer/ModeratorOfferContainer";
import CONSTANTS from "../../constants";

const ModeratorDashboard = props => {
  const {isFetching, error, offers, isShowModal, filePath} = props

  useEffect(() => {
    !isFetching && props.getOffers(offers.length || 0);
    return () => {
      props.clearOffers();
    }
  }, [])

  const closeModal = () => props.changeModalView({isShowModal: false, filePath: null})

  return (
    <>
      {
        isShowModal && <LightBox mainSrc={`${CONSTANTS.publicURL}${filePath}`}
                                 onCloseRequest={closeModal}/>
      }
      <ModeratorOfferContainer loadMore={props.getOffers} isFetching={isFetching} error={error}>
        {
          offers.map(offer => <ModeratorOfferBox key={offer.id} {...offer}/>)
        }
      </ModeratorOfferContainer>
    </>
  );
};

const mapStateToProps = state => {
  return {...state.offerStore}

};

const mapDispatchToProps = dispatch => ({
  getOffers: offset => dispatch(actionCreator.createGetOffersAction(offset)),
  clearOffers: () => dispatch(actionCreator.createClearOffersAction()),
  changeModalView: data => dispatch(actionCreator.createChangeModalViewAction(data))
})

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
