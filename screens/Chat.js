import { SafeAreaView, TextInput, ScrollView } from 'react-native'
import React, { useLayoutEffect, useState, useEffect } from 'react'
import { collection, query, where, getDocs, onSnapshot, doc } from 'firebase/firestore'
import HeaderOption from '../components/HeaderComponents/HeaderOption'
import UserAvatar from '../components/HeaderComponents/UserAvatar'
import { auth, db } from '../firebase'
import CustomListItem from '../components/CustomListItem'
import { getUsersData } from '../utils/handleChats'

const Chat = ({ navigation }) => {
  const user = auth.currentUser
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [photoURL, setPhotURL] = useState(auth.currentUser.photoURL)
  const [knownFriends, setKnownFriend] = useState(null)
  const [userBase, setUserBase] = useState([])

  useEffect(() => {
    const userRef = doc(db, 'users', auth.currentUser.uid)

    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data()
        setKnownFriend(userData.knownUsers || [])
      }
    })

    return () => unsubscribe() // Unsubscribe when the component unmounts
  }, [])

  useEffect(() => {
    if (knownFriends && knownFriends.length !== 0) {
      getUsersData(knownFriends.map((user) => user.uid)).then((userBaseData) => {
        setUserBase(userBaseData) // Set the retrieved data to the state
      })
    }
  }, [knownFriends])

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderOption
          navigation={navigation}
          auth={auth}
          onPhotoChange={setPhotURL}
        />
      ),
      headerLeft: () => <UserAvatar photoURL={photoURL} />,
      headerBackVisible: false
    })
  }, [photoURL])

  // handle search query
  const handleSearch = async () => {
    try {
      const usersCollection = collection(db, 'users')
      const searchQueryRef = query(usersCollection, where('displayName', '==', searchQuery))

      const querySnapshot = await getDocs(searchQueryRef)
      console.log('querySnapshot', querySnapshot)
      const searchResultsArray = querySnapshot.docs.map((doc) => doc.data())

      setSearchResults(searchResultsArray)
      setSearchQuery('')
    } catch (error) {
      console.error('Error searching for users:', error)
      // You might display an error message to the user here.
    }
  }

  return (
    <SafeAreaView>
      <TextInput
        style={{ paddingHorizontal: 10, paddingVertical: 8, borderColor: '#ccc', borderWidth: 1 }}
        placeholder='Search for other users...'
        value={searchQuery}
        onChangeText={(text) => setSearchQuery(text.trim())}
        // Call the handleSearch function whenever the text changes
        onEndEditing={handleSearch}
      />
      {searchResults && (
        <ScrollView className='border-b-2 border-b-[#1a6553]'>
          {searchResults?.map((client) => (
            <CustomListItem
              key={client.uid} // Make sure to add a unique key prop when using map
              client={client}
              status='add'
              setSearchResults={setSearchResults}
            />
          ))}
        </ScrollView>
      )}
      {/* known users*/}

      <ScrollView>
        {userBase[0] &&
          knownFriends &&
          knownFriends?.map((client, index) => (
            <CustomListItem
              key={index} // Make sure to add a unique key prop when using map
              client={userBase?.find((user) => user.uid === client.uid)}
              status={client.status}
              setSearchResults={setSearchResults}
            />
          ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default Chat
