import React from 'react';
import styles from "./DialogBox.module.sass";
import CONSTANTS from "../../../../constants";
import classNames from 'classnames';


const DialogBox = (props) => {
    console.log('DIALOG BOX ->',props)
    const {chatPreview, userId, getTimeStr, changeFavorite, changeBlackList, catalogOperation, goToExpandedDialog, chatMode, collocutors} = props;
    const {favoriteList, participants, blackList, id, Messages:messages, createAt} = chatPreview;
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
                    <span className={styles.interlocutorMessage}>{messages[0].body}</span>
                </div>
                <div className={styles.buttonsContainer}>
                    <span className={styles.time}>{getTimeStr(createAt)}</span>
                    <i onClick={(event) => changeFavorite({
                        participants,
                        favoriteFlag: !isFavorite
                    }, event)} className={classNames({['far fa-heart']: !isFavorite, ['fas fa-heart']: isFavorite})}/>
                    <i onClick={(event) => changeBlackList({
                        participants,
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
