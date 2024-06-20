import {
  faCamera,
  faChevronLeft,
  faImage,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import React, {useState} from 'react';
import {
  Alert,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import styles from './styles';
import globalStyle from '../../Styles/globalStyle';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../contexts/AuthProvider';
import Button from '../../components/Button/Button';
import {Routes} from '../../navigation/Routes';

const Profile = ({navigation}) => {
  const {logout, updateUserProfile, displayName, photoURL, deletePhoto} =
    useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(displayName);
  const [isUploading, setIsUploading] = useState(false);

  //select photo from library
  const selectPhoto = () => {
    launchImageLibrary({}, async response => {
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: response.error,
        });
      } else if (response.assets && response.assets.length > 0) {
        setIsUploading(true); // Set uploading state to true
        const selectedPhoto = response.assets[0];
        //upload profile photo to storage
        try {
          //update photo using context
          await updateUserProfile(newDisplayName, selectedPhoto.uri);
          setModalVisible(false);
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: error,
          });
        } finally {
          setIsUploading(false); // Set uploading state to false after upload completes
        }
      }
    });
  };

  //take photo
  const takePhoto = () => {
    launchCamera(
      {
        mediaType: 'photo',
        saveToPhotos: true,
        includeBase64: false,
      },
      async response => {
        if (response.didCancel) {
          Toast.show({
            type: 'info',
            text1: 'User cancelled camera',
          });
        } else if (response.errorCode) {
          Toast.show({
            type: 'error',
            text1: `Camera error: ${response.errorCode}`,
          });
          Alert.alert('Error', `Camera error: ${response.errorCode}`);
        } else if (response.errorMessage) {
          Toast.show({
            type: 'error',
            text1: `Error message: ${response.errorMessage}`,
          });
          Alert.alert('Error', `Error message: ${response.errorMessage}`);
        } else if (response.assets && response.assets.length > 0) {
          const takenPhoto = response.assets[0];
          try {
            // Update photo using context
            await updateUserProfile(newDisplayName, takenPhoto.uri);
            setModalVisible(false); // Close the modal after successful operation
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: error.message,
            });
            Alert.alert('Error', error.message);
          }
        }
      },
    );
  };

  const handleUpdate = async () => {
    // Only update Firebase if displayName or photoURL is updated
    if (newDisplayName !== displayName || photoURL) {
      try {
        await updateUserProfile(newDisplayName, photoURL);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    }
    navigation.navigate(Routes.Home);
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.backButtonLogoutContainer}>
        <Pressable onPress={() => navigation.goBack()}>
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={'#B57EDC'} />
        </Pressable>
        <TouchableOpacity
          onPress={() => {
            logout();
            navigation.navigate(Routes.Login);
          }}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.profileTextView}>
        <Text style={styles.profileText}>Profile</Text>
      </View>
      <View style={styles.container}>
        {/* Container for inputs and update button */}
        <View style={styles.boxContainer}>
          {!photoURL && (
            <View style={styles.addPhotoView}>
              <TouchableOpacity
                style={styles.addPhoto}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.plus}>+</Text>
                <FontAwesomeIcon icon={faCamera} size={50} color={'#B57EDC'} />
              </TouchableOpacity>
            </View>
          )}
          {photoURL && (
            <View style={styles.alignPhotoEditTextCenter}>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Image source={{uri: photoURL}} style={styles.photo} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editPhotoMargin}
                onPress={() => setModalVisible(true)}>
                <Text style={styles.editPhotoText}>Edit/delete photo</Text>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Display name: </Text>
            <TextInput
              placeholder="Name everyone will see"
              value={newDisplayName}
              onChangeText={setNewDisplayName}
              style={styles.input}
            />
          </View>
          <Button
            title={'Update'}
            onPress={handleUpdate}
            isDisabled={isUploading}
          />
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <FontAwesomeIcon
                icon={faXmark}
                size={30}
                style={styles.xButton}
              />
              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => {
                  selectPhoto();
                }}>
                <FontAwesomeIcon icon={faImage} size={30} color={'#B57EDC'} />
                <Text style={styles.modalOptionsText}>Choose from library</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => {
                  takePhoto();
                }}>
                <FontAwesomeIcon icon={faCamera} size={30} color={'#B57EDC'} />
                <Text style={styles.modalOptionsText}>Take photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => {
                  deletePhoto();
                  setModalVisible(false);
                }}>
                <FontAwesomeIcon icon={faTrashCan} size={30} color={'red'} />
                <Text style={styles.modalOptionsText}>
                  Delete current photo
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;
