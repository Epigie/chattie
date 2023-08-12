import React, { useEffect, useState } from 'react'
import { ListItem, Avatar } from '@rneui/themed'

import { TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { updateKnownUser, deleteKnownUser, getLastMessage } from '../utils/handleChats'
import { auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import { Ionicons } from '@expo/vector-icons'
import { AntDesign } from '@expo/vector-icons'
const CustomListItem = ({ client, status, setSearchResults }) => {
  const [lastMessage, setLastMessage] = useState('')
  if (!client) return <ActivityIndicator color='#0d48b1' />
  const currentUser = auth.currentUser
  const chatId = [client.uid, currentUser.uid].sort().join('')

  useEffect(() => {
    getLastMessage(chatId).then((res) => {
      setLastMessage(res)
    })
  }, [])

  const navigation = useNavigation()
  return (
    <ListItem
      containerStyle={{
        margin: 5,
        borderRadius: 10,
        overflow: 'hidden',
        paddingVertical: 6,
        paddingVertical: 10,
        backgroundColor: status !== 'aproved' ? '#e0e0e0' : 'white'
      }}
    >
      <Avatar
        rounded
        size='medium'
        source={{ uri: client.photoURL }}
      />
      <ListItem.Content>
        <ListItem.Title className='font-[700] text-md'>{client.displayName}</ListItem.Title>

        <ListItem.Subtitle
          numberOfLines={2}
          ellipsizeMode='tail'
          className=''
        >
          {status === 'add' ? 'Would you like to extend an invitation to connect with this user?' : status === 'pending' ? 'This user sent you an invitation. Would you be interested in accepting' : lastMessage ? lastMessage : 'No messages yet'}
        </ListItem.Subtitle>
        {(status === 'add' || status === 'pending') && (
          <View className='flex-row m-1'>
            <TouchableOpacity
              onPress={() => {
                if (status === 'add') {
                  updateKnownUser(currentUser.uid, client.uid, status), setSearchResults('')
                }
                if (status === 'pending') {
                  deleteKnownUser(currentUser.uid, client.uid, status)
                  updateKnownUser(currentUser.uid, client.uid, status)
                  setSearchResults(undefined)
                }
              }}
              className='mr-2'
            >
              <AntDesign
                name='checkcircleo'
                size={24}
                color='#454545'
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (status === 'pending') deleteKnownUser(currentUser.uid, client.uid, status)
              }}
            >
              <AntDesign
                name='closecircleo'
                size={24}
                color='#454545'
              />
            </TouchableOpacity>
          </View>
        )}
      </ListItem.Content>

      {status === 'aproved' && (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChatContent', { client, chatId })
          }}
        >
          <Ionicons
            name='arrow-forward-circle-outline'
            size={30}
            color='#1a6553'
          />
        </TouchableOpacity>
      )}
    </ListItem>
  )
}

export default CustomListItem
