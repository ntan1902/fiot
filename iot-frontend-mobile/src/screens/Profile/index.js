import React from 'react'
import PropTypes from 'prop-types'
import contactData from './contact.json'
import {useSelector} from "react-redux";

import Profile from './Profile'

const ProfileScreen = () => {
  const {user: currentUser} = useSelector(state => state.auth);
  
  return <Profile {...contactData} />
}

ProfileScreen.navigationOptions = () => ({
  header: null,
})

ProfileScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
}

export default ProfileScreen
