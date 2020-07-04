import React,{useEffect} from 'react';
import {connect} from 'react-redux';
import {getDialogMessages, clearMessageList} from "../../../../actions/actionCreator";
import ChatHeader from '../../ChatComponents/ChatHeader/ChatHeader';
import moment from 'moment';
import className from 'classnames';
import styles from './Dialog.module.sass';
import ChatInput from '../../ChatComponents/ChatInut/ChatInput';


const Dialog = props => {
    const {userId, messages, chatId} = props;
    const messagesEnd = React.useRef(null);

    useEffect(() => {
        getDialog();
        return () => {
            props.clearMessageList();
        };
    }, []);

    useEffect(()=>{
        if (messagesEnd.current)
            scrollToBottom();
    })

    useEffect(() => {
        getDialog();
    }, [chatId]);

    const getDialog = () => {
        props.getDialog(chatId); // <----- conversationID
        scrollToBottom();
    };

    const scrollToBottom = () => {
       messagesEnd.current && messagesEnd.current.scrollIntoView({behavior: 'smooth'});
    };

    const renderMainDialog = () => {
        const messagesArray = [];
        let currentTime = moment();
        messages.forEach((message, i) => {
            if (!currentTime.isSame(message.createdAt, 'date')) {
                messagesArray.push(
                  <div key={message.createdAt} className={styles.date}>
                      {moment(message.createdAt).format('MMMM DD, YYYY')}
                  </div>,
                );
                currentTime = moment(message.createdAt);
            }
            messagesArray.push(
              <div key={i}
                   className={className(userId === message.UserId ? styles.ownMessage : styles.message)}>
                  <span>{message.body}</span>
                  <span className={styles.messageTime}>{moment(message.createdAt).format('HH:mm')}</span>
                  <div ref={messagesEnd}/>
              </div>,
            );
        });
        return (
          <div className={styles.messageList}>{messagesArray}</div>
        );
    };

    const blockMessage = () => {
        return (
          <span className={styles.messageBlock}>{'Blocked dialog'}</span>
        );
    };

    const isBlocked = () => {
        const {chatId, dialogsPreview} = props;
        const index = dialogsPreview.findIndex(dialog => dialog.id === chatId);
        return dialogsPreview ? dialogsPreview[index].blackList : false;
    };

    return (
      <>
          <ChatHeader userId={userId}/>
          {renderMainDialog()}
          <div ref={messagesEnd}/>
          {isBlocked() ? blockMessage() : <ChatInput/>}
      </>
    );

}

const mapStateToProps = (state) => {
    return state.chatStore;
};

const mapDispatchToProps = (dispatch) => {
    return {
        getDialog: (id) => dispatch(getDialogMessages(id)),
        clearMessageList: () => dispatch(clearMessageList())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Dialog);
