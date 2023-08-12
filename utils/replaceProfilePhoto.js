import { storage } from '../firebase'
import { deleteObject, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import 'firebase/storage'
export const replaceProfilePhoto = async (auth, newFileUrii) => {
  const name = auth.currentUser.displayName
  const userUid = auth.currentUser.uid
  const userPhotoUrl = auth.currentUser.photoURL
  const fileRef = ref(storage, userPhotoUrl)
  deleteObject(fileRef)
  console.log(name, userUid, userPhotoUrl)
  try {
    // Create a Blob from the image data
    const response = await fetch(newFileUrii)
    const blob = await response.blob()
    const fileName = `${name}_${Date.now()}`

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
  }
}
