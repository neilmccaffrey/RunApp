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
