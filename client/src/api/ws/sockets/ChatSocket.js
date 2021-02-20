import _ from 'lodash'
import WebSocket from "./WebSocket"
import CONTANTS from "../../../constants"
import {
  addMessage,
  changeBlockStatusInStore,
} from "../../../actions/actionCreator"

class ChatSocket extends WebSocket {
  constructor(dispatch, getState, room) {
    super(dispatch, getState, room)
    this.listen()
  }

  listen = () => {
    this.socket.on("connect", () => {
      this.anotherSubscribes()
    })
  }

  anotherSubscribes = () => {
    this.onNewMessage()
    this.onChangeBlockStatus()
  }

  onChangeBlockStatus = () => {
    this.socket.on(CONTANTS.CHANGE_BLOCK_STATUS, (data) => {
      const { message } = data
      const { dialogsPreview } = this.getState().chatStore
      dialogsPreview.forEach((preview) => {
        if (preview.id === data.id) {
          preview.favoriteList = message.isCreate
        }
      })

      this.dispatch(changeBlockStatusInStore({ dialogsPreview }))
    })
  }

  onNewMessage = () => {
    this.socket.on("newMessage", ({ message }) => {
      const { message: newMsg, preview } = message
      const { dialogsPreview } = this.getState().chatStore
      const newPreviews = _.clone(dialogsPreview);
      const foundDialog = newPreviews.find((elem) => elem.id === newMsg.ConversationId)

      if (foundDialog) {
        foundDialog.Messages[CONTANTS.FIRST_ITEM] = newMsg
      } else {
        newPreviews.push(preview);
      }

      this.dispatch(addMessage({ message: newMsg, dialogsPreview: newPreviews }))
    })
  }

  subscribeChat = (id) => {
    this.socket.emit("subscribeChat", id)
  }

  unsubscribeChat = (id) => {
    this.socket.emit("unsubscribeChat", id)
  }
}

export default ChatSocket
