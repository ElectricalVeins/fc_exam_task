import CONSTANTS from '../../../constants';
import socketIoClient from 'socket.io-client';


class WebSocket {
    constructor(dispatch, getState, room) {
        this.dispatch = dispatch;
        this.getState = getState;
        this.socket = socketIoClient(`${CONSTANTS.BASE_URL}${room}`, {origins: "localhost:*"});

    }
}


export default WebSocket;