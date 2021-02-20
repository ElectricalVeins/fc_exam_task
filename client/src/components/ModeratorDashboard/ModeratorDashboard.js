import React, { useEffect } from 'react';
import LightBox from 'react-image-lightbox';
import { connect } from 'react-redux';
import styles from './ModeratorDashboard.module.sass';
import * as actionCreator from '../../actions/actionCreator';
import ModeratorOfferBox from '../ModeratorOfferBox/ModeratorOfferBox';
import ModeratorOfferContainer from '../ModeratorOfferContainer/ModeratorOfferContainer';
import CONSTANTS from '../../constants';

const ModeratorDashboard = props => {
  const {
    isFetching,
    error,
    offers,
    isShowModal,
    filePath,
    getOffers,
    clearOffers,
    changeModalView,
  } = props;

  useEffect(() => {
    !isFetching && getOffers(offers.length || 0);
    return () => {
      clearOffers();
    };
  }, []);

  const closeModal = () =>
    changeModalView({ isShowModal: false, filePath: null });

  return (
    <div className={styles.pageWrapper}>
      {isShowModal && (
        <LightBox
          mainSrc={`${CONSTANTS.publicURL}${filePath}`}
          onCloseRequest={closeModal}
        />
      )}
      <ModeratorOfferContainer
        loadMore={getOffers}
        isFetching={isFetching}
        error={error}
      >
        {offers.map(offer => (
          <ModeratorOfferBox key={offer.id} {...offer} />
        ))}
      </ModeratorOfferContainer>
    </div>
  );
};

const mapStateToProps = state => {
  return { ...state.offerStore };
};

const mapDispatchToProps = dispatch => ({
  getOffers: offset => dispatch(actionCreator.createGetOffersAction(offset)),
  clearOffers: () => dispatch(actionCreator.createClearOffersAction()),
  changeModalView: data =>
    dispatch(actionCreator.createChangeModalViewAction(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ModeratorDashboard);
