import storage from '@react-native-firebase/storage';

export const uploadPhoto = async (uri, filename) => {
  const uploadUri = uri.replace('file://', '');
  const reference = storage().ref(filename);
  await reference.putFile(uploadUri);
  const url = await reference.getDownloadURL();
  return {url, path: reference.fullPath};
};

// Delete photo function
export const deletePhoto = async path => {
  try {
    const reference = storage().ref(path);
    await reference.delete();
  } catch (error) {
    throw error;
  }
};

/**
 * Extracts and decodes the file path from a Firebase Storage URL.
 * @param {string} url - The Firebase Storage URL.
 * @returns {string} - The extracted and decoded file path.
 */
const extractFilePathFromUrl = url => {
  const startIndex = url.indexOf('/o/') + 3; // Adjusting the starting index to the '/o/' part
  const endIndex = url.indexOf('?alt=media');
  const filePath = url.substring(startIndex, endIndex);
  return decodeURIComponent(filePath);
};

/**
 * Deletes a file from Firebase Storage using its URL.
 * @param {string} photoURL - The URL of the photo to delete.
 */
export const deleteProfilePhotoFromStorage = async photoURL => {
  try {
    const filePath = extractFilePathFromUrl(photoURL);
    await storage().ref(filePath).delete();
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};
