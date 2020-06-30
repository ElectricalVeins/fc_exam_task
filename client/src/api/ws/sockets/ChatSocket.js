import WebSocket from './WebSocket';
import CONTANTS from "../../../constants";
import {addMessage, changeBlockStatusInStore} from "../../../actions/actionCreator";
import isEqual from 'lodash/isEqual';

class ChatSocket extends WebSocket {
    constructor(dispatch, getState, room) {
        super(dispatch, getState, room);
        this.listen();
    }

    listen = () => {
        this.socket.on('connect', () => {
            this.anotherSubscribes();
        });
    };

    anotherSubscribes = () => {
        this.onNewMessage();
        this.onChangeBlockStatus();
    };

    onChangeBlockStatus = () => {
        this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, (data) => {
            const {message} = data;
            const {dialogsPreview} = this.getState().chatStore;
            //TODO: переделать логику под новую
           /* dialogsPreview.forEach(preview => {
                if (isEqual(preview.participants, message.participants))
                    preview.blackList = message.blackList
            });*/
            this.dispatch(changeBlockStatusInStore({chatData: message, dialogsPreview: dialogsPreview})); //<- chatData
        })
    };

    onNewMessage = () => {
        this.socket.on('newMessage', (data) => {
            const {message, preview} = data.message;
            const {dialogsPreview} = this.getState().chatStore;
            let isNew = true;
            dialogsPreview.forEach(preview => {
                if (preview.id === message.ConversationId) {
                    preview.Messages[0] = message;
                    isNew = false;
                }
            });
            if (isNew) {
                dialogsPreview.push(preview);
            }
            this.dispatch(addMessage({message, dialogsPreview: dialogsPreview}));
        })
    };

    subscribeChat = (id) => {
        this.socket.emit('subscribeChat', id);
    };

    unsubscribeChat = (id) => {
        this.socket.emit('unsubscribeChat', id);
    };
}

export default ChatSocket;
