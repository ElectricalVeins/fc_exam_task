import React from "react"
import classNames from "classnames"
import { confirmAlert } from "react-confirm-alert"
import "react-confirm-alert/src/react-confirm-alert.css"
import { connect } from "react-redux"
import Rating from "react-rating"
import { withRouter } from "react-router-dom"
import styles from "./OfferBox.module.sass"
import CONSTANTS from "../../constants"
import {
  changeMark,
  clearChangeMarkError,
  changeShowImage,
} from "../../actions/actionCreator"
import "./confirmStyle.css"
import OpenDialogButton from "../OpenDialogButton/OpenDialogButton"

const OfferBox = (props) => {
  const { data, role, id, contestType, setOfferStatus, clearError, changeMark, changeShowImage, dialogsPreview, needButtons } = props
  const { avatar, firstName, lastName, email, rating } = props.data.User

  const resolveOffer = () => {
    confirmAlert({
      title: "Confirm",
      message: "Are u sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            setOfferStatus(
              data.User.id,
              data.id,
              CONSTANTS.OFFER_COMMAND_RESOLVE
            ),
        },
        {
          label: "No",
        },
      ],
    })
  }

  const rejectOffer = () => {
    confirmAlert({
      title: "confirm",
      message: "Are u sure?",
      buttons: [
        {
          label: "Yes",
          onClick: () =>
            setOfferStatus(
              data.User.id,
              data.id,
              CONSTANTS.OFFER_COMMAND_REJECT
            ),
        },
        {
          label: "No",
        },
      ],
    })
  }

  const changeMarkOnClick = (value) => {
    clearError()
    changeMark({
      mark: value,
      offerId: data.id,
      isFirst: !data.mark,
      creatorId: data.User.id,
    })
  }

  const offerStatus = () => {
    const { status } = data
    if (status === CONSTANTS.OFFER_STATUS_REJECTED) {
      return (
        <i
          className={classNames("fas fa-times-circle reject", styles.reject)}
        />
      )
    }
    if (status === CONSTANTS.OFFER_STATUS_WON) {
      return (
        <i
          className={classNames("fas fa-check-circle resolve", styles.resolve)}
        />
      )
    }
    return null
  }

  return (
    <div className={styles.offerContainer}>
      {offerStatus()}
      <div className={styles.mainInfoContainer}>
        <div className={styles.userInfo}>
          <div className={styles.creativeInfoContainer}>
            <img
              src={
                avatar
                  ? `${CONSTANTS.publicURL}${avatar}`
                  : CONSTANTS.ANONYM_IMAGE_PATH
              }
              alt="user"
            />
            <div className={styles.nameAndEmail}>
              <span>{`${firstName} ${lastName}`}</span>
              <span>{email}</span>
            </div>
          </div>
          <div className={styles.creativeRating}>
            <span className={styles.userScoreLabel}>Creative Rating </span>
            <Rating
              initialRating={rating}
              fractions={2}
              fullSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              placeholderSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              emptySymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt="star-outline"
                />
              }
              readonly
            />
          </div>
        </div>
        <div className={styles.responseConainer}>
          {contestType === CONSTANTS.LOGO_CONTEST ? (
            <img
              onClick={() =>
                changeShowImage({
                  imagePath: data.fileName,
                  isShowOnFull: true,
                })
              }
              className={styles.responseLogo}
              src={`${CONSTANTS.publicURL}${data.fileName}`}
              alt="logo"
            />
          ) : (
            <span className={styles.response}>{data.text}</span>
          )}
          {role !== CONSTANTS.CUSTOMER && (
            <div className={styles.offerStatus}>
              Offer Status: {data.status}
            </div>
          )}
          {data.User.id !== id && (
            <Rating
              fractions={2}
              fullSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              placeholderSymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star.png`}
                  alt="star"
                />
              }
              emptySymbol={
                <img
                  src={`${CONSTANTS.STATIC_IMAGES_PATH}star-outline.png`}
                  alt="star"
                />
              }
              onClick={changeMarkOnClick}
              placeholderRating={data.mark}
            />
          )}
        </div>
        {role !== CONSTANTS.CREATOR && (
          <OpenDialogButton
            interlocutor={data.User}
            dialogsPreview={dialogsPreview}
          />
        )}
      </div>
      {needButtons(data.status) && (
        <div className={styles.btnsContainer}>
          <div onClick={resolveOffer} className={styles.resolveBtn}>
            Resolve
          </div>
          <div onClick={rejectOffer} className={styles.rejectBtn}>
            Reject
          </div>
        </div>
      )}
    </div>
  )
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeMark: (data) => dispatch(changeMark(data)),
    clearError: () => dispatch(clearChangeMarkError()),
    changeShowImage: (data) => dispatch(changeShowImage(data)),
  }
}

const mapStateToProps = (state) => {
  const { changeMarkError, isShowModal } = state.contestByIdStore
  const { id, role } = state.userStore.data
  const { dialogsPreview } = state.chatStore
  return { changeMarkError, id, role, dialogsPreview, isShowModal }
}

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(OfferBox)
)
