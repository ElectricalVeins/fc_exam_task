import React from 'react';
import {connect} from 'react-redux';
import UpdateUserInfoForm from '../../components/UpdateUserInfoForm/UpdateUserInfoForm';
import {updateUserData, changeEditModeOnUserProfile} from '../../actions/actionCreator';
import styles from './UserInfo.module.sass';
import UserProfile from "../UserProfile/UserProfile";

const UserInfo = (props) => {

    const updateUserData = (values) => {
        const formData = new FormData();
        formData.append('file', values.file);
        formData.append('firstName', values.firstName);
        formData.append('lastName', values.lastName);
        formData.append('displayName', values.displayName);
        props.updateUser(formData);
    };

    const {isEdit, changeEditMode, data} = props;
    return (
      <div className={ styles.mainContainer }>
          {
              isEdit ? <UpdateUserInfoForm onSubmit={ updateUserData }/>
                : <UserProfile { ...data }/>
          }
          <div onClick={ () => changeEditMode(!isEdit) }
               className={ styles.buttonEdit }>
              {
                  isEdit ? 'Cancel' : 'Edit'
              }
          </div>
      </div>
    )
};

const mapStateToProps = (state) => {
    const {data} = state.userStore;
    const {isEdit} = state.userProfile;
    return {data, isEdit};
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateUser: (data) => dispatch(updateUserData(data)),
        changeEditMode: (data) => dispatch(changeEditModeOnUserProfile(data))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(UserInfo);
