import firestore from '@react-native-firebase/firestore';
import Toast from 'react-native-toast-message';

export const createPost = async (
  user,
  title,
  location,
  details,
  date,
  time,
  photo1,
  photo2,
  photo3,
) => {
  if (!user) {
    throw new Error('User not authenticated');
  }

  try {
    await firestore()
      .collection('posts')
      .add({
        title,
        location,
        details,
        date,
        time,
        photo1: photo1 || null,
        photo2: photo2 || null,
        photo3: photo3 || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
      });
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
export const updatePostInFirestore = async ({
  id,
  user,
  title,
  location,
  details,
  date,
  time,
  photo1,
  photo2,
  photo3,
}) => {
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
        date,
        time,
        photo1: photo1 || null,
        photo2: photo2 || null,
        photo3: photo3 || null,
        createdAt: firestore.FieldValue.serverTimestamp(),
        userId: user.uid,
      });
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
    console.log('Comment object:', JSON.stringify(comment, null, 2));
    await firestore()
      .collection('posts')
      .doc(postId)
      .update({comments: firestore.FieldValue.arrayUnion(comment)});
    console.log('here');
  } catch (error) {
    throw error;
  }
};

//add profile photo url to users doc
export const addProfilePhotoUrlToUserDoc = async (profilePhoto, user) => {
  try {
    await firestore().collection('users').doc(user.uid).update({
      profilePhoto: profilePhoto.url,
    });
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

// fetch profile photo with userId
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
      return '';
    }
  } catch (error) {
    throw error;
  }
};

//add displayName to users doc
export const addDisplayNameToUserDoc = async (displayName, user) => {
  try {
    await firestore().collection('users').doc(user.uid).update({
      displayName: displayName,
    });
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

export const updateAttendanceInFirestore = async (
  postId,
  user,
  newAttendanceButtonState,
) => {
  try {
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
        }
      } else {
        // User is already attending, remove them
        isGoingList = isGoingList.filter(attendee => attendee.uid !== user.uid);
      }
      await postRef.update({isGoing: isGoingList});
    }
  } catch (error) {
    console.error('Error updating attendance in Firestore:', error);
    throw error;
  }
};

/**
 * Fetch display names for all users in the isGoing list.
 * @param {Array} isGoingList - The list of attendees with user UIDs.
 * @returns {Promise<Array>} - The list of attendees with display names.
 */
export const fetchDisplayNamesForAttendees = async isGoingList => {
  try {
    // if (!Array.isArray(isGoingList)) {
    //   throw new Error('isGoingList is not an array');
    // }

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
