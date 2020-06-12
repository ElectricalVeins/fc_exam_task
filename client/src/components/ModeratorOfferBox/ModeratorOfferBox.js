import React from 'react';
import styles from './ModeratorOfferBox.module.sass';
import classNames from 'classnames'
import { connect } from 'react-redux';
import CONSTANTS from "../../constants";
import * as actionCreator from "../../actions/actionCreator";
import { createSetOfferAction } from "../../actions/actionCreator";

const ModeratorOfferBox = props => {
  const {
    text, fileName, contestId,
    id: offerId, userId: creatorId,
    User: {displayName, email: userEmail}
  } = props;

  const banHandler = () => {
    props.setOffer({contestId, offerId, creatorId, userEmail, command: CONSTANTS.OFFER_COMMAND_BAN});
  }

  const approveHandler = () => {
    props.setOffer({contestId, offerId, creatorId, userEmail, command: CONSTANTS.OFFER_COMMAND_APPROVE});
  }

  const onImageHandler = () => {
    props.changeModalView({filePath: fileName, isShowModal: true});
  }

  const renderBody = () => {
    return text
      ? <div className={styles.textContainer}>{text}</div>
      : <div className={styles.fileContainer}>
        <img className={styles.logo}
             onClick={onImageHandler}
             src={`${CONSTANTS.publicURL}${fileName}`}
             alt='logo'/>
      </div>
  };

  return (
    <section className={styles.moderatorOfferBox}>
      <div className={styles.infoContainer}>
        <p>Offer ID:<span>{offerId}</span></p>
        <p>User email:<span>{userEmail}</span></p>
        <p>User login:<span>{displayName}</span></p>
      </div>
      {
        renderBody()
      }
      <div className={styles.buttonContainer}>
        <div className={classNames(styles.button, styles.ban)}
             onClick={banHandler}>Ban
        </div>
        <div className={classNames(styles.button, styles.approve)}
             onClick={approveHandler}>Approve
        </div>
      </div>
    </section>
  );
};

const mapDispatchToProps = dispatch => ({
  setOffer: (data) => dispatch(createSetOfferAction(data)),
  changeModalView: data => dispatch(actionCreator.createChangeModalViewAction(data))
})

export default connect(null, mapDispatchToProps)(ModeratorOfferBox);