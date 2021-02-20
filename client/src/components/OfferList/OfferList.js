import React from "react"
import { connect } from "react-redux"
import OfferBox from "../OfferBox/OfferBox"
import CONSTANTS from "../../constants"
import styles from "./OfferList.module.sass"
import {
  clearSetOfferStatusError,
  setOfferStatus,
} from "../../actions/actionCreator"

const OfferList = (props) => {
  const {
    contestByIdStore: { offers, contestData },
    userStore,
    clearSetOfferStatusError,
    setOfferStatusAction,
  } = props

  const setOfferStatus = (creatorId, offerId, command) => {
    clearSetOfferStatusError()
    const { id, orderId, priority } = contestData
    setOfferStatusAction({
      command,
      offerId,
      creatorId,
      orderId,
      priority,
      contestId: id,
    })
  }

  const needButtons = (offerStatus) => {
    const contestCreatorId = contestData.User.id
    const userId = userStore.data.id
    const contestStatus = contestData.status
    return (
      contestCreatorId === userId &&
      contestStatus === CONSTANTS.CONTEST_STATUS_ACTIVE &&
      offerStatus === CONSTANTS.OFFER_STATUS_PENDING
    )
  }

  return (
    <>
      {offers.length !== 0 ? (
        offers.map((offer) => (
          <OfferBox
            data={offer}
            key={offer.id}
            needButtons={needButtons}
            setOfferStatus={setOfferStatus}
            contestType={contestData.contestType}
            date={new Date()}
          />
        ))
      ) : (
        <div className={styles.notFound}>
          There is no suggestion at this moment
        </div>
      )}
    </>
  )
}

const mapStateToProps = ({ contestByIdStore, userStore }) => ({ contestByIdStore, userStore })

const mapDispatchToProps = (dispatch) => ({
  setOfferStatusAction: (data) => dispatch(setOfferStatus(data)),
  clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
})

export default connect(mapStateToProps, mapDispatchToProps)(OfferList)
