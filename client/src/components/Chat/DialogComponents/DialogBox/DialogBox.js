import React from 'react';
import styles from "./DialogBox.module.sass";
import CONSTANTS from "../../../../constants";
import classNames from 'classnames';


const DialogBox = (props) => {
    console.log('DIALOG BOX ->',props)
    const {chatPreview, UserId:userId, getTimeStr, changeFavorite, changeBlackList, catalogOperation, goToExpandedDialog, chatMode, collocutors} = props;
    const {favoriteList, participants, blackList, id, Messages:messages} = chatPreview;
    const interlocutor = collocutors.find(interlocutor => interlocutor.id !== userId);
    //const isFavorite = favoriteList[participants.indexOf(userId)];
    const isFavorite = false;
    //const isBlocked = blackList[participants.indexOf(userId)];
    const isBlocked = false;
    return (
        <div className={styles.previewChatBox} onClick={() => goToExpandedDialog({
            interlocutor,id
        })}>
            <img src={interlocutor.avatar ? `${CONSTANTS.publicURL}${interlocutor.avatar}` : CONSTANTS.ANONYM_IMAGE_PATH} alt='user'/>
            <div className={styles.infoContainer}>
                <div className={styles.interlocutorInfo}>
                    <span className={styles.interlocutorName}>{interlocutor.firstName}</span>
                    <span className={styles.interlocutorMessage}>{messages[CONSTANTS.FIRST_ITEM].body}</span>
                </div>
                <div className={styles.buttonsContainer}>
                    <span className={styles.time}>{getTimeStr(messages[CONSTANTS.FIRST_ITEM].createdAt)}</span>
                    <i onClick={(event) => changeFavorite({
                        participants, //id <- chat id
                        favoriteFlag: !isFavorite
                    }, event)} className={classNames({['far fa-heart']: !isFavorite, ['fas fa-heart']: isFavorite})}/>
                    <i onClick={(event) => changeBlackList({
                        participants, //id <- chat id
                        blackListFlag: !isBlocked
                    }, event)}
                       className={classNames({['fas fa-user-lock']: !isBlocked, ['fas fa-unlock']: isBlocked})}/>
                    <i onClick={(event) => catalogOperation(event, id)} className={classNames({
                        ['far fa-plus-square']: chatMode !== CONSTANTS.CATALOG_PREVIEW_CHAT_MODE,
                        ['fas fa-minus-circle']: chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE
                    })}/>
                </div>
            </div>
        </div>
    )
};

export default DialogBox;
