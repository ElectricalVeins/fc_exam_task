import React from 'react';
import PropTypes from 'prop-types';
import CONSTANTS from "../../constants";
import styles from './UserProfile.module.sass';
import UserInfoBlock from "../UserInfoBlock/UserInfoBlock";

const UserProfile = props => {

  const {avatar, firstName, lastName, displayName, email, role, balance}=props

  return (
    <div className={styles.infoContainer}>
      <img src={avatar ? `${CONSTANTS.publicURL}${avatar}`: CONSTANTS.ANONYM_IMAGE_PATH} className={styles.avatar} alt='user'/>
      <div className={styles.infoContainer}>
        <UserInfoBlock description={ 'first name' }
                       property={ firstName }
                       styles={ { ...styles } }/>
        <UserInfoBlock description={ 'Last Name' }
                       property={ lastName }
                       styles={ { ...styles } }/>
        <UserInfoBlock description={ 'Display Name' }
                       property={ displayName }
                       styles={ { ...styles } }/>
        <UserInfoBlock description={ 'email' }
                       property={ email }
                       styles={ { ...styles } }/>
        <UserInfoBlock description={ 'role' }
                       property={ role }
                       styles={ { ...styles } }/>
        {
          role === CONSTANTS.CREATOR &&
          <UserInfoBlock description={'Balance'}
                         property={`${ balance }$`}
                         styles={ { ...styles }}/>
        }
      </div>
    </div>
  );
};

UserProfile.defaultProps = {
  avatar: null
};

UserProfile.propTypes = {
  avatar: PropTypes.string,
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  role: PropTypes.string.isRequired,
  balance: PropTypes.string.isRequired,
};

export default UserProfile;