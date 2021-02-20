import React from "react"
import { connect } from "react-redux"
import Chat from "../Chat/Chat"

const ChatContainer = (props) => {
  const { data, controllers } = props
  return <>
    {
      data ? <Chat controllers={controllers} /> : null
    }
  </>
}

const mapStateToProps = (state) => {
  const { data } = state.userStore
  return { data }
}

export default connect(mapStateToProps, null)(ChatContainer)
