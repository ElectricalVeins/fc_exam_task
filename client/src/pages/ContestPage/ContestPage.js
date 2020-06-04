import React,{useEffect} from 'react';
import {
    getContestById,
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


const ContestPage = props => {
    const {data:{role}} = props.userStore;
    const {contestByIdStore, changeShowImage, changeContestViewMode, getData, clearSetOfferStatusError} = props;
    const {isShowOnFull, imagePath, error, isFetching, isBrief, contestData, offers, setOfferStatusError} = contestByIdStore;

    useEffect(()=>{
        fetchData()
        return ()=> props.changeEditContest(false);
    },[])

    const fetchData = () => {
        const {params} = props.match;
        props.getData({contestId: params.id});
    };

    const findConversationInfo = (interlocutorId) => {
        const {messagesPreview} = props.chatStore;
        const {id} = props.userStore.data;
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

    const goChat = () => {
        const {User} = props.contestByIdStore.contestData;
        props.goToExpandedDialog({
            interlocutor: User,
            conversationData: findConversationInfo(User.id)
        });
    };

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
                                            <Brief contestData={contestData} role={role} goChat={goChat}/>
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
};

const mapStateToProps = (state) => {
    const {contestByIdStore, userStore, chatStore} = state;
    return {contestByIdStore, userStore, chatStore};
};

const mapDispatchToProps = (dispatch) => {
    return {
        getData: (data) => dispatch(getContestById(data)),
        goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
        changeEditContest: (data) => dispatch(changeEditContest(data)),
        changeContestViewMode: (data) => dispatch(changeContestViewMode(data)),
        changeShowImage: data => dispatch(changeShowImage(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ContestPage);