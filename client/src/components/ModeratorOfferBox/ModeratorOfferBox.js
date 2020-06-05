import React from 'react';
import styles from './ModeratorOfferBox.module.sass'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CONSTANTS from "../../constants";
import * as actionCreator from "../../actions/actionCreator";
import { createSetOfferAction } from "../../actions/actionCreator";

const ModeratorOfferBox = props => {
  const {id, userId, status, text, fileName, User: {displayName, email}} = props;

  const banHandler = () => {
    props.setOffer({id, command: CONSTANTS.OFFER_COMMAND_BAN})
  }

  const approveHandler = () => {
    props.setOffer({id, command: CONSTANTS.OFFER_COMMAND_APPROVE})
  }

  const renderBody = () => {
    return text
      ? <div className={styles.textContainer}>{text}</div>
      : <div className={styles.fileContainer}>{
        <img className={styles.logo}
             src={`${CONSTANTS.publicURL}${fileName}`}
             alt='logo'/>
      }</div>
  }

  /*onClick={() => props.changeShowImage({imagePath: data.fileName, isShowOnFull: true})}*/
  return (
    <section className={styles.moderatorOfferBox}>
      <div className={styles.infoContainer}>
        <h5>Offer ID:<span>{id}</span></h5>
        <h5>User ID:<span>{userId}</span></h5>
        <h5>User email:<span>{email}</span></h5>
        <h5>User name:<span>{displayName}</span></h5>
        <h5>Offer status:<span>{status}</span></h5>
      </div>
      {renderBody()}
      <div className={styles.btnCnt}>
        <div className={styles.btn} onClick={banHandler}>BAN</div>
        <div className={styles.btn} onClick={approveHandler}>APPROVE</div>
      </div>
    </section>
  );
};

ModeratorOfferBox.propTypes = {};

const mapDispatchToProps = dispatch => ({
  setOffer: (data) => dispatch(createSetOfferAction(data))
})

export default connect(null, mapDispatchToProps)(ModeratorOfferBox);