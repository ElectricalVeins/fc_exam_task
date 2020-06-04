import React from 'react';
import {
    getContestById,
    setOfferStatus,
    clearSetOfferStatusError,
    goToExpandedDialog,
    changeEditContest,
    changeContestViewMode,
    changeShowImage
} from '../../actions/actionCreator';
import {connect} from 'react-redux';
import Header from "../../components/Header/Header";
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-image-lightbox';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-image-lightbox/style.css';
import Error from "../../components/Error/Error";
import OfferList from "../../components/OfferList/OfferList";


class ContestPage extends React.Component {

    componentWillUnmount() {
        this.props.changeEditContest(false);
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        const {params} = this.props.match;
        this.props.getData({contestId: params.id});
    };

    findConversationInfo = (interlocutorId) => {
        const {messagesPreview} = this.props.chatStore;
        const {id} = this.props.userStore.data;
        const participants = [id, interlocutorId];
        participants.sort((participant1, participant2) => participant1 - participant2);
        for (let i = 0; i < messagesPreview.length; i++) {
            if (isEqual(participants, messagesPreview[i].participants)) {
                return {
                    participants: messagesPreview[i].participants,
                    _id: messagesPreview[i]._id,
                    blackList: messagesPreview[i].blackList,
                    favoriteList: messagesPreview[i].favoriteList
                };
            }
        }
        return null;
    };

    goChat = () => {
        const {User} = this.props.contestByIdStore.contestData;
        this.props.goToExpandedDialog({
            interlocutor: User,
            conversationData: this.findConversationInfo(User.id)
        });
    };

    render() {
        const {role} = this.props.userStore.data;
        const {contestByIdStore, changeShowImage, changeContestViewMode, getData, clearSetOfferStatusError} = this.props;
        const {isShowOnFull, imagePath, error, isFetching, isBrief, contestData, offers, setOfferStatusError} = contestByIdStore;
        return (
            <div>
                {
                    isShowOnFull && <LightBox mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
                                              onCloseRequest={() => changeShowImage({
                                                  isShowOnFull: false,
                                                  imagePath: null
                                              })}/>
                }
                <Header/>
                {error ? <div className={styles.tryContainer}><TryAgain getData={getData}/></div> :
                    (
                        isFetching ?
                            <div className={styles.containerSpinner}>
                                <Spinner/>
                            </div>
                            :
                            (<div className={styles.mainInfoContainer}>
                                <div className={styles.infoContainer}>
                                    <div className={styles.buttonsContainer}>
                        <span onClick={() => changeContestViewMode(true)}
                              className={classNames(styles.btn, {[styles.activeBtn]: isBrief})}>Brief</span>
                                        <span onClick={() => changeContestViewMode(false)}
                                              className={classNames(styles.btn, {[styles.activeBtn]: !isBrief})}>Offer</span>
                                    </div>
                                    {
                                        isBrief ?
                                            <Brief contestData={contestData} role={role} goChat={this.goChat}/>
                                            :
                                            <div className={styles.offersContainer}>
                                                {(role === CONSTANTS.CREATOR && contestData.status === CONSTANTS.CONTEST_STATUS_ACTIVE) &&
                                                <OfferForm contestType={contestData.contestType}
                                                           contestId={contestData.id}
                                                           customerId={contestData.User.id}/>}
                                                {setOfferStatusError && <Error data={setOfferStatusError.data}
                                                                               status={setOfferStatusError.status}
                                                                               clearError={clearSetOfferStatusError}/>}
                                                <div className={styles.offers}>
                                                    <OfferList/>
                                                </div>
                                            </div>}
                                </div>
                                <ContestSideBar contestData={contestData}
                                                totalEntries={offers.length}/>
                            </div>)
                    )
                }
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    const {contestByIdStore, userStore, chatStore} = state;
    return {contestByIdStore, userStore, chatStore};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getData: (data) => dispatch(getContestById(data)),
        setOfferStatus: (data) => dispatch(setOfferStatus(data)),
        clearSetOfferStatusError: () => dispatch(clearSetOfferStatusError()),
        goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
        changeEditContest: (data) => dispatch(changeEditContest(data)),
        changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
        changeShowImage: data => dispatch(changeShowImage(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestPage);