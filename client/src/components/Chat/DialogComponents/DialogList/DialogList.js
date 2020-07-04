import React from 'react';
import {connect} from 'react-redux';
import CONSTANTS from '../../../../constants';
import {
    goToExpandedDialog,
    changeChatFavorite,
    changeChatBlock,
    changeShowAddChatToCatalogMenu
} from "../../../../actions/actionCreator";
import moment from 'moment';
import DialogBox from '../DialogBox/DialogBox';
import styles from './DialogList.module.sass';


const DialogList = (props) => {

    const changeFavorite = (data, event) => {
        props.changeChatFavorite(data);
        event.stopPropagation();
    };

    const changeBlackList = (data, event) => {
        props.changeChatBlock(data);
        event.stopPropagation();
    };

    const changeShowCatalogCreation = (event, chatId) => {
        props.changeShowAddChatToCatalogMenu(chatId);
        event.stopPropagation();
    };

    const onlyFavoriteDialogs = (chatPreview) => {
        return chatPreview.favoriteList;
    };

    const onlyBlockDialogs = (chatPreview) => {
        return chatPreview.blackList;
    };

    const getTimeStr = (time) => {
        const currentTime = moment();
        if (currentTime.isSame(time, 'day'))
            return moment(time).format('HH:mm');
        else if (currentTime.isSame(time, 'week'))
            return moment(time).format('dddd');
        else if (currentTime.isSame(time, 'year'))
            return moment(time).format('MM DD');
        else
            return moment(time).format('MMMM DD, YYYY');
    };

    const renderPreview = (filterFunc) => {
        const dialogs = [];
        const {userId, preview, goToExpandedDialog, chatMode, removeChat} = props;
        preview.forEach((chatPreview) => {
            const dialogNode = <DialogBox collocutors={chatPreview.Users}
                                          chatPreview={chatPreview}
                                          userId={userId}
                                          key={chatPreview.id}
                                          getTimeStr={getTimeStr}
                                          changeFavorite={changeFavorite}
                                          changeBlackList={changeBlackList}
                                          chatMode={chatMode}
                                          catalogOperation={chatMode === CONSTANTS.CATALOG_PREVIEW_CHAT_MODE ? removeChat : changeShowCatalogCreation}
                                          goToExpandedDialog={goToExpandedDialog}/>;
            if (filterFunc && filterFunc(chatPreview, userId)) {
                dialogs.push(dialogNode);
            } else if (!filterFunc) {
                dialogs.push(dialogNode);
            }
        });
        return dialogs.length > 0 ? dialogs : <span className={styles.notFound}>Not found</span>;
    };

    const renderChatPreview = () => {
        const {chatMode} = props;
        if (chatMode === CONSTANTS.FAVORITE_PREVIEW_CHAT_MODE)
            return renderPreview(onlyFavoriteDialogs);
        else if (chatMode === CONSTANTS.BLOCKED_PREVIEW_CHAT_MODE)
            return renderPreview(onlyBlockDialogs);
        else
            return renderPreview();
    };


    return (
        <div className={styles.previewContainer}>
            {renderChatPreview()}
        </div>
    )
};

const mapStateToProps = (state) => {
    return state.chatStore;
};

const mapDispatchToProps = (dispatch) => {
    return {
        goToExpandedDialog: (data) => dispatch(goToExpandedDialog(data)),
        changeChatFavorite: (data) => dispatch(changeChatFavorite(data)),
        changeChatBlock: (data) => dispatch(changeChatBlock(data)),
        changeShowAddChatToCatalogMenu: (data) => dispatch(changeShowAddChatToCatalogMenu(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogList);
