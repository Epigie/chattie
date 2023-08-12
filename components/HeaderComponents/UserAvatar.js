import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Avatar } from '@rneui/base'
import { auth } from '../../firebase'

const UserAvatar = ({ photoURL }) => {
  const [menuactive, setMenuActive] = useState(false)

  const userName = auth.currentUser.displayName

  return (
    <View className='flex-row items-center'>
      <Avatar
        rounded
        size='medium'
        source={photoURL ? { uri: photoURL } : require('../../assets/userProfile.png')}
        avatarStyle={{ marginBottom: 4 }}
      />
      {<Text className='text-white ml-2 text-sm items-baseline'>{userName ? userName : 'Anonymous'}</Text>}
    </View>
  )
}

export default UserAvatar
