/* import ChatSocket from 
import NotificationSocket from "./sockets/NotificationSocket"

export let controller
export let chatController

export const initSocket = (store) => {
  controller = new NotificationSocket(
    store.dispatch,
    store.getState,
    "notifications"
  )
  chatController = new ChatSocket(store.dispatch, store.getState, "chat")
  return store
} */
export { default as ChatSocket } from "./sockets/ChatSocket"
export { default as NotificationSocket } from "./sockets/NotificationSocket"