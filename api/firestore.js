import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import Toast from 'react-native-toast-message';
import {getDeviceToken} from './notifications';

export const createPost = async (
  user,
  title,
  location,
  details,
  eventTime,
  photo1,
  photo2,
  photo3,
  photoURL,
  onPostCreated, // Callback function to refresh posts
) => {
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    //create a docRef while adding post to store to get postId for attendance
    const docRef = await firestore()
      .collection('posts')
      .add({
        title,
        location,
        details,
        eventTime,
        photo1: photo1 || null,
        photo2: photo2 || null,
        photo3: photo3 || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        profilePhoto: photoURL,
        userId: user.uid,
      });

    // Fetch the document
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      const docData = docSnapshot.data();

      // Convert Firestore Timestamp to Date object
      const eventDateObject = docData.eventTime.toDate();

      // Update attendance so user who creates post is on Going list, notification will be sent, and I'll be there button is active
      await updateAttendanceInFirestore(
        docRef.id,
        user,
        true,
        docData.location,
        eventDateObject,
      );
    }

    // Call the callback function to refresh posts
    if (onPostCreated) {
      onPostCreated();
    }

    Toast.show({
      type: 'success',
      text1: 'Event Created',
      text2: 'Your event has been created successfully!',
    });
  } catch (error) {
    Toast.show({
      type: 'error',
      text1: 'Error',
      text2: 'There was an error creating your event.',
    });
  }
};

//update post
export const updatePostInFirestore = async (
  {
    id,
    user,
    title,
    location,
    details,
    eventTime,
    photo1,
    photo2,
    photo3,
    photoURL,
  },
  onPostUpdated,
) => {
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    await firestore()
      .collection('posts')
      .doc(id)
      .update({
        title,
        location,
        details,
        eventTime,
        photo1: photo1 || null,
        photo2: photo2 || null,
        photo3: photo3 || null,
        profilePhoto: photoURL,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
      });
    if (onPostUpdated) {
      onPostUpdated();
    }
  } catch (error) {
    throw error;
  }
};

//delete post
export const deletePostFromFirestore = async itemId => {
  try {
    await firestore().collection('posts').doc(itemId).delete();
  } catch (error) {
    throw error;
  }
};

//add comments to post doc
export const addCommentToPost = async (postId, comment) => {
  try {
    await firestore()
      .collection('posts')
      .doc(postId)
      .update({comments: firestore.FieldValue.arrayUnion(comment)});
  } catch (error) {
    throw error;
  }
};

//fetch comments
export const fetchComments = async postItemId => {
  try {
    const postRef = firestore().collection('posts').doc(postItemId);
    const postDoc = await postRef.get();
    const postData = postDoc.data();
    return postData.comments;
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

//delete comment
export const deleteComment = async (postId, commentId) => {
  try {
    const postRef = firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();
    const postData = postDoc.data();

    const updatedComments = postData.comments.filter(
      comment => comment.commentId !== commentId,
    );

    await postRef.update({comments: updatedComments});
  } catch (error) {
    throw error;
  }
};

//upload profile photo and add profile photo url to users doc
export const addProfilePhotoUrlToUserDoc = async (photoUri, user) => {
  try {
    const uploadUri = photoUri.replace('file://', ''); // Ensure the file path is correctly formatted
    const photoRef = storage().ref(`/profile_photos/${user.uid}.jpg`);

    // Upload the new photo, which will overwrite the existing one
    await photoRef.putFile(uploadUri);
    const newPhotoUrl = await photoRef.getDownloadURL();

    // Update the profile photo URL in Firestore
    await firestore().collection('users').doc(user.uid).update({
      profilePhoto: newPhotoUrl,
    });

    return newPhotoUrl;
  } catch (error) {
    throw error;
  }
};

// fetch profile photo
export const fetchProfilePhoto = async user => {
  try {
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.profilePhoto;
    } else {
      //return null so default profilePhoto shows
      return null;
    }
  } catch (error) {
    throw error;
  }
};

// fetch profile photo with userId (for item component)
export const fetchProfilePhotoWithId = async userUid => {
  try {
    const userDoc = await firestore().collection('users').doc(userUid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.profilePhoto;
    } else {
      //return null so default profilePhoto shows
      return null;
    }
  } catch (error) {
    throw error;
  }
};

//remove profile photo url
export const removeProfilePhotoUrlFromUserDoc = async user => {
  try {
    await firestore().collection('users').doc(user.uid).update({
      profilePhoto: null,
    });
  } catch (error) {
    throw error;
  }
};

//fetch users initial display name
export const fetchInitialDisplayName = async user => {
  try {
    const userDoc = await firestore().collection('users').doc(user.uid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.displayName;
    } else {
      return 'Anonymous';
    }
  } catch (error) {
    throw error;
  }
};

//add displayName to users doc
export const addDisplayNameToUserDoc = async (displayName, user) => {
  try {
    if (!displayName || displayName.trim() === '') {
      await firestore().collection('users').doc(user.uid).update({
        displayName: 'Anonymous',
      });
    } else {
      await firestore().collection('users').doc(user.uid).update({
        displayName: displayName,
      });
    }
  } catch (error) {
    throw error;
  }
};

//fetch users display name with userUid
export const fetchDisplayName = async userUid => {
  try {
    const userDoc = await firestore().collection('users').doc(userUid).get();
    if (userDoc.exists) {
      const userData = userDoc.data();
      return userData.displayName;
    } else {
      return 'Anonymous';
    }
  } catch (error) {
    throw error;
  }
};

// update attendance and also event signup for notifications
export const updateAttendanceInFirestore = async (
  postId,
  user,
  newAttendanceButtonState,
  eventLocation,
  eventTime,
) => {
  try {
    const deviceToken = await getDeviceToken();
    const postRef = firestore().collection('posts').doc(postId);
    const postDoc = await postRef.get();

    if (postDoc.exists) {
      const postData = postDoc.data();
      let isGoingList = postData.isGoing || [];

      if (newAttendanceButtonState) {
        // User is not currently attending, add them if they are not already in the list
        if (!isGoingList.some(attendee => attendee.uid === user.uid)) {
          const displayName = await fetchDisplayName(user.uid);
          isGoingList.push({
            uid: user.uid,
            displayName: displayName || user.displayName,
          });
          //set up notification when user is attending
          const notificationTime = new Date(
            eventTime.getTime() - 24 * 60 * 60 * 1000,
          ); // 24 hours before event

          firestore().collection('event_signups').add({
            postId: postId,
            userId: user.uid,
            displayName: displayName,
            eventLocation: eventLocation,
            eventTime: eventTime,
            notificationTime: notificationTime,
            notified: false,
            deviceToken: deviceToken, // Store the device token
          });
        }
      } else {
        // User is already attending, remove them
        isGoingList = isGoingList.filter(attendee => attendee.uid !== user.uid);

        // Remove the user's notification signup
        const signupsRef = firestore().collection('event_signups');
        const signupSnapshot = await signupsRef
          .where('postId', '==', postId)
          .where('userId', '==', user.uid)
          .get();

        signupSnapshot.forEach(async doc => {
          await doc.ref.delete();
        });
      }
      await postRef.update({isGoing: isGoingList});
    }
  } catch (error) {
    console.error('Error updating attendance in Firestore:', error);
    throw error;
  }
};

export const updateNotificationTimes = async (eventTime, id) => {
  try {
    const eventSignupsRef = firestore().collection('event_signups');
    const snapshot = await eventSignupsRef.where('postId', '==', id).get();

    const batch = firestore().batch();
    const notificationTime = new Date(
      eventTime.getTime() - 24 * 60 * 60 * 1000,
    ); // 24 hours before event

    snapshot.forEach(doc => {
      batch.update(doc.ref, {notificationTime, eventTime});
    });

    await batch.commit();
  } catch (error) {
    throw error;
  }
};

export const deleteNotifications = async id => {
  try {
    const eventSignupsRef = firestore().collection('event_signups');
    const snapshot = await eventSignupsRef.where('postId', '==', id).get();

    const batch = firestore().batch();

    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error('Error deleting notifications:', error);
  }
};

/**
 * Fetch display names for all users in the isGoing list.
 * @param {Array} isGoingList - The list of attendees with user UIDs.
 * @returns {Promise<Array>} - The list of attendees with display names.
 */
export const fetchDisplayNamesForAttendees = async isGoingList => {
  try {
    const attendeesWithDisplayNames = await Promise.all(
      isGoingList.map(async attendee => {
        const displayName = await fetchDisplayName(attendee.uid);
        return {...attendee, displayName};
      }),
    );
    return attendeesWithDisplayNames;
  } catch (error) {
    console.error('Error in fetchDisplayNamesForAttendees:', error);
    throw error;
  }
};
