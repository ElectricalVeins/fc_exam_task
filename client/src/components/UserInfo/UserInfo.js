import React from "react"
import { connect } from "react-redux"
import UpdateUserInfoForm from "../UpdateUserInfoForm/UpdateUserInfoForm"
import {
  updateUserData,
  changeEditModeOnUserProfile,
} from "../../actions/actionCreator"
import styles from "./UserInfo.module.sass"
import UserProfile from "../UserProfile/UserProfile"

const UserInfo = (props) => {
  const { isEdit, changeEditMode, data, updateUser } = props

  const updateUserData = ({ file, firstName, lastName, displayName }) => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("firstName", firstName)
    formData.append("lastName", lastName)
    formData.append("displayName", displayName)
    updateUser(formData)
  }

  return (
    <div className={styles.mainContainer}>
      {isEdit ? (
        <UpdateUserInfoForm onSubmit={updateUserData} />
      ) : (
        <UserProfile {...data} />
      )}
      <div
        onClick={() => changeEditMode(!isEdit)}
        className={styles.buttonEdit}
      >
        {isEdit ? "Cancel" : "Edit"}
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  const { 
    userStore: { data },
    userProfile: { isEdit } 
  } = state
  return { data, isEdit }
}

const mapDispatchToProps = (dispatch) => ({
  updateUser: (data) => dispatch(updateUserData(data)),
  changeEditMode: (data) => dispatch(changeEditModeOnUserProfile(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(UserInfo)
