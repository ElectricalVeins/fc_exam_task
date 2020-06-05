import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import * as actionCreator from '../../actions/actionCreator';
import { connect } from 'react-redux';
import SpinnerLoader from "../Spinner/Spinner";
import TryAgain from "../TryAgain/TryAgain";
import ModeratorOfferBox from "../ModeratorOfferBox/ModeratorOfferBox";

const ModeratorDashboard = props => {

  const {offerStore: {isFetching, error, offers}, userData} = props

  useEffect(() => {
    !isFetching && props.getOffers(offers.length || 0);
    return () => props.clearOffers();
  }, [])

  if (isFetching) return <SpinnerLoader/>
  if (error) return <TryAgain getData={props.getOffers}/>

  return (
    <div>
      {
        offers.map(offer => <ModeratorOfferBox key={offer.id} {...offer}/>)
      }
    </div>
  );
};

const mapStateToProps = state => {
  return {
    offerStore: state.offerStore,
    userData: state.userStore.data,

  }
};

const mapDispatchToProps = dispatch => ({
  getOffers: offset => dispatch(actionCreator.createGetOffersAction(offset)),
  clearOffers: () => dispatch(actionCreator.createClearOffersAction())
})

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
