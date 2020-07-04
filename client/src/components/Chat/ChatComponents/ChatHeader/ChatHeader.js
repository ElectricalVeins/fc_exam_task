import React from 'react';
import {connect} from 'react-redux';
import {backToDialogList, changeChatFavorite, changeChatBlock} from "../../../../actions/actionCreator";
import styles from './ChatHeader.module.sass';
import CONSTANTS from '../../../../constants';
import classNames from 'classnames';

const ChatHeader = (props) => {
    const {backToDialogList, dialogsPreview, chatId, interlocutor: {avatar, firstName, id}, switchChatBlock, switchChatFavorite} = props;
    const chatIndex = dialogsPreview.findIndex(item => item.id === chatId);
    const isFavorite = dialogsPreview[chatIndex].favoriteList;
    const isBlocked = dialogsPreview[chatIndex].blackList;

    const changeBlockStatus = event => {
        switchChatBlock({
            interlocutorId: id,
            isCreate: !isBlocked,
        });
        event.stopPropagation();
    };

    const changeFavoriteStatus = event => {
        switchChatFavorite({
            interlocutorId: id,
            isCreate: !isFavorite,
        });
        event.stopPropagation();
    };

    return (
        <div className={styles.chatHeader}>
            <div className={styles.buttonContainer}
                 onClick={() => backToDialogList()}>
                <img src={`${CONSTANTS.STATIC_IMAGES_PATH}arrow-left-thick.png`} alt='back'/>
            </div>
            <div className={styles.infoContainer}>
                <div>
                    <img src={avatar ? `${CONSTANTS.publicURL}${avatar}` : CONSTANTS.ANONYM_IMAGE_PATH}
                         alt='user'/>
                    <span>{firstName}</span>
                </div>
                {chatId &&
                <div>
                    <i onClick={changeFavoriteStatus}
                       className={classNames({
                          ['far fa-heart']: !isFavorite,
                          ['fas fa-heart']: isFavorite
                       })}/>
                    <i onClick={changeBlockStatus}
                       className={classNames({
                           ['fas fa-user-lock']: !isBlocked,
                           ['fas fa-unlock']: isBlocked
                       })}/>
                </div>
                }
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const {interlocutor, chatId, dialogsPreview} = state.chatStore;
    return {interlocutor, chatId, dialogsPreview};
};

const mapDispatchToProps = (dispatch) => {
    return {
        backToDialogList: () => dispatch(backToDialogList()),
        switchChatFavorite: (data) => dispatch(changeChatFavorite(data)),
        switchChatBlock: (data) => dispatch(changeChatBlock(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ChatHeader);
