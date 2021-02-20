import React from "react"
import { Provider } from "react-redux"
import { ChatSocket, NotificationSocket } from "../api/ws/socketController"
import configureStore from "./configureStore"
import App from "../App"

class Setup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      store: this.startSocket(configureStore()),
    }
  }

  startSocket = (store) => {
    this.controller = new NotificationSocket(store.dispatch, store.getState, "notifications")
    this.chatController = new ChatSocket(store.dispatch, store.getState, "chat")
    return store;
  }

  render() {
    const { controller, chatController } = this;
    return (
      <Provider store={this.state.store}>
        <App controllers={{ controller, chatController }} />
      </Provider>
    )
  }
}

export default Setup
