import { doc, updateDoc, arrayUnion, arrayRemove, collection, getDoc, getDocs, query, where, documentId, serverTimestamp, setDoc, addDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'

export const updateKnownUser = async (userUid, addUserUid, status) => {
  const validStatuses = ['add', 'pending', 'approved']
  // status validation
  if (!validStatuses.includes(status)) {
    console.error('Invalid status provided:', status)
    return
  }

  let newStatus = null
  if (status === 'add') newStatus = 'pending'
  if (status === 'pending') newStatus = 'aproved'
  if (!newStatus) return

  try {
    const userRef = doc(db, 'users', userUid)
    await updateDoc(userRef, {
      knownUsers: arrayUnion({ uid: addUserUid, status: newStatus })
    })
    const clientRef = doc(db, 'users', addUserUid)
    await updateDoc(clientRef, {
      knownUsers: arrayUnion({ uid: userUid, status: newStatus })
    })
  } catch (error) {
    console.log(error)
  }
}

export const deleteKnownUser = async (userUid, addUserUid, status) => {
  console.log('updateFriend')
  const userRef = doc(db, 'users', userUid)
  const clientRef = doc(db, 'users', addUserUid)
  try {
    await updateDoc(userRef, {
      knownUsers: arrayRemove({ uid: addUserUid, status: status })
    })

    await updateDoc(clientRef, {
      knownUsers: arrayRemove({ uid: userUid, status: status })
    })
  } catch (error) {
    console.log(error)
  }
}

export const getKnowUsers = async (userUid) => {
  const docRef = doc(db, 'users', userUid)
  const docSnap = await getDoc(docRef)

  if (docSnap.exists()) {
    const friends = docSnap.data().knownUsers
    console.log('Document data:', friends)
    return friends
  } else {
    // docSnap.data() will be undefined in this case
    console.log('No such document!')
  }
}

export const getUsersData = async (userIds) => {
  try {
    const q = query(collection(db, 'users'), where(documentId(), 'in', userIds))
    const userssDocsSnap = await getDocs(q)
    const arr = userssDocsSnap.docs.map((element) => element.data())
    console.log(arr)
    return arr
  } catch (error) {
    console.log(error)
  }
}

export const uploadImage = async (userUid, newFileUrii) => {
  const response = await fetch(newFileUrii)
  const blob = await response.blob()
  const fileName = `${userUid}_${Date.now()}`
  try {
    // Get a reference to the Firebase Cloud Storage bucket
    const storageRef = ref(storage, `${userUid}/${fileName}`)

    // Upload the Blob
    const uploadTask = uploadBytesResumable(storageRef, blob)

    // Wait for the upload to complete
    await uploadTask

    // Handle successful upload
    console.log('Blob uploaded successfully!')
    // Get the public URL of the uploaded file
    const downloadUrl = await getDownloadURL(storageRef)

    return downloadUrl
  } catch (error) {
    console.error('Error uploading file to Firestore:', error)
    throw error
  }
}

export const uploadMessage = async (chatId, message) => {
  try {
    const messagesRef = collection(db, 'userChats', chatId, 'messages')
    const lastMessageRef = doc(db, 'userChats', chatId)
    await addDoc(messagesRef, { ...message, timestamp: serverTimestamp() })
    await setDoc(lastMessageRef, { lastMessage: message.content })
  } catch (error) {
    console.error('Error uploading message to Firestore:', error)
  }
}

export const getLastMessage = async (chatId) => {
  try {
    const lastMessageRef = doc(db, 'userChats', chatId)
    const docSnap = await getDoc(lastMessageRef)

    return docSnap.data().lastMessage
  } catch (error) {
    console.log('getLastMessage', error)
  }
}
