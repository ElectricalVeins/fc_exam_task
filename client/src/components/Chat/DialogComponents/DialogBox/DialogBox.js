import React from 'react';
import styles from "./DialogBox.module.sass";
import CONSTANTS from "../../../../constants";
import classNames from 'classnames';


const DialogBox = (props) => {
    const {chatPreview, UserId:userId, getTimeStr, changeFavorite, changeBlackList, catalogOperation, goToExpandedDialog, chatMode, collocutors} = props;
    const {favoriteList: isFavorite, blackList: isBlocked, Messages: messages, id} = chatPreview;
    const interlocutor = collocutors.find(interlocutor => interlocutor.id !== userId);

    const changeBlockStatus = event => {
        changeBlackList({
            interlocutorId: interlocutor.id,
            isCreate: !isBlocked,
        }, event);
    };

    const changeFavoriteStatus = event => {
        changeFavorite({
            interlocutorId: interlocutor.id,
            isCreate: !isFavorite,
        }, event);
    };

    return (
        <div className={styles.previewChatBox} onClick={() => goToExpandedDialog({
            interlocutor,
            chatId:id
        })}>
            <img src={interlocutor.avatar ? `${CONSTANTS.publicURL}${interlocutor.avatar}` : CONSTANTS.ANONYM_IMAGE_PATH} alt='user'/>
            <div className={styles.infoContainer}>
                <div className={styles.interlocutorInfo}>
                    <span className={styles.interlocutorName}>{interlocutor.firstName}</span>
                    <span className={styles.interlocutorMessage}>
                        {
                            messages && messages.length > 0
                              ? messages[CONSTANTS.FIRST_ITEM].body
                              : ''
                        }
                    </span>
                </div>
                <div className={styles.buttonsContainer}>
                    <span className={styles.time}>{messages.length > 0 && getTimeStr(messages[CONSTANTS.FIRST_ITEM].createdAt)}</span>
                    <i onClick={changeFavoriteStatus}
                       className={classNames({['far fa-heart']: !isFavorite, ['fas fa-heart']: isFavorite})}/>
                    <i onClick={changeBlockStatus}
                       className={classNames({['fas fa-user-lock']: !isBlocked, ['fas fa-unlock']: isBlocked})}/>
                    <i onClick={(event) => catalogOperation(event, id)}
                       className={classNames({
                           ['far fa-plus-square']: chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                           ['fas fa-minus-circle']: chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                       })}/>
                </div>
            </div>
        </div>
    )
};

export default DialogBox;
