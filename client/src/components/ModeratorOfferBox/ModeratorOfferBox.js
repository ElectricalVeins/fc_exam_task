import React from 'react';
import styles from './ModeratorOfferBox.module.sass'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CONSTANTS from "../../constants";
import * as actionCreator from "../../actions/actionCreator";
import { createSetOfferAction } from "../../actions/actionCreator";

const ModeratorOfferBox = props => {
  const {id, text, fileName, User: {displayName, email}} = props;

  const banHandler = () => {
    props.setOffer({id, command: CONSTANTS.OFFER_COMMAND_BAN, email})
  }

  const approveHandler = () => {
    props.setOffer({id, command: CONSTANTS.OFFER_COMMAND_APPROVE, email})
  }

  const onImageHandler = () => {
    props.changeModalView({filePath: fileName, isShowModal: true})
  }

  const renderBody = () => {
    return text
      ? <div className={styles.textContainer}>{text}</div>
      : <div className={styles.fileContainer}>{
        <img className={styles.logo}
             onClick={onImageHandler}
             src={`${CONSTANTS.publicURL}${fileName}`}
             alt='logo'/>
      }</div>
  }

  /*onClick={() => props.changeShowImage({imagePath: data.fileName, isShowOnFull: true})}*/
  return (
    <section className={styles.moderatorOfferBox}>
      <div className={styles.infoContainer}>
        <p>Offer ID:<span>{id}</span></p>
        <p>User email:<span>{email}</span></p>
        <p>User login:<span>{displayName}</span></p>
      </div>
      {renderBody()}
      <div className={styles.buttonContainer}>
        <div className={styles.button} onClick={banHandler}>Ban</div>
        <div className={styles.button} onClick={approveHandler}>Approve</div>
      </div>
    </section>
  );
};

ModeratorOfferBox.propTypes = {};

const mapDispatchToProps = dispatch => ({
  setOffer: (data) => dispatch(createSetOfferAction(data)),
  changeModalView: data => dispatch(actionCreator.createChangeModalViewAction(data))
})

export default connect(null, mapDispatchToProps)(ModeratorOfferBox);