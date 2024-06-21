import {useNavigation, useRoute} from '@react-navigation/native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';
import {deletePhoto, uploadPhoto} from '../../api/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import {useAuth} from '../../contexts/AuthProvider';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCamera,
  faChevronLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import Button from '../../components/Button/Button';
import styles from './styles';
import globalStyle from '../../Styles/globalStyle';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  updateNotificationTimes,
  updatePostInFirestore,
} from '../../api/firestore';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

const UpdatePost = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    id,
    title: initialTitle,
    location: initialLocation,
    details: initialDetails,
    eventTime: initialEventTime,
    photo1: initialPhoto1,
    photo2: initialPhoto2,
    photo3: initialPhoto3,
  } = route.params;

  const initialDate = new Date(initialEventTime);
  const initialTime = new Date(initialEventTime);

  const [title, setTitle] = useState(initialTitle || '');
  const [location, setLocation] = useState(initialLocation || '');
  const [details, setDetails] = useState(initialDetails || '');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [photo1, setPhoto1] = useState(initialPhoto1 || null);
  const [photo2, setPhoto2] = useState(initialPhoto2 || null);
  const [photo3, setPhoto3] = useState(initialPhoto3 || null);
  const [isUploading, setIsUploading] = useState(false);
  const [noLocation, setNoLocation] = useState(false);

  const {user} = useAuth();

  //change date and time handlers
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
  };
  const onChangeTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
  };

  //select photo from library
  const selectPhoto = photoNum => {
    launchImageLibrary({}, async response => {
      if (response.error) {
        Toast.show({
          type: 'error',
          text1: response.error,
        });
      } else if (response.assets && response.assets.length > 0) {
        const selectedPhoto = response.assets[0];
        setIsUploading(true); // Set uploading state to true
        try {
          const uploadedPhoto = await uploadPhoto(
            selectedPhoto.uri,
            selectedPhoto.fileName,
          );
          if (photoNum === '1') {
            setPhoto1(uploadedPhoto);
          } else if (photoNum === '2') {
            setPhoto2(uploadedPhoto);
          } else if (photoNum === '3') {
            setPhoto3(uploadedPhoto);
          }
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

  const combineDateAndTime = (date, time) => {
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours());
    combinedDate.setMinutes(time.getMinutes());
    combinedDate.setSeconds(time.getSeconds());
    combinedDate.setMilliseconds(time.getMilliseconds());
    return combinedDate;
  };

  // Delete photo
  const handleDeletePhoto = async (photoNum, eventTime) => {
    try {
      let updatedPhotos = {};

      if (photoNum === '1' && photo1) {
        await deletePhoto(photo1.path);
        setPhoto1(null);
        updatedPhotos.photo1 = null;
      } else if (photoNum === '2' && photo2) {
        await deletePhoto(photo2.path);
        setPhoto2(null);
        updatedPhotos.photo2 = null;
      } else if (photoNum === '3' && photo3) {
        await deletePhoto(photo3.path);
        setPhoto3(null);
        updatedPhotos.photo3 = null;
      }
      //updates photo in firestore immediately so deletion reflects and no photo image shows. New photos will only be uploaded on Update press
      await updatePostInFirestore({
        id,
        user,
        title,
        location,
        details,
        eventTime,
        ...updatedPhotos,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  const handleUpdate = async eventTime => {
    try {
      await updatePostInFirestore({
        id,
        title,
        location,
        details,
        eventTime,
        photo1: photo1,
        photo2: photo2,
        photo3: photo3,
        user,
      });

      // Update notification times for all users signed up for this event
      await updateNotificationTimes(eventTime, id);

      Toast.show({
        type: 'success',
        text1: 'Event updated successfully',
      });
      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  const handleCancel = () => {
    setPhoto1(initialPhoto1);
    setPhoto2(initialPhoto2);
    setPhoto3(initialPhoto3);
    navigation.goBack();
  };

  const onSwipeGesture = ({nativeEvent}) => {
    if (nativeEvent.translationY > 20) {
      Keyboard.dismiss();
    }
  };

  return (
    <GestureHandlerRootView style={globalStyle.flex}>
      <PanGestureHandler onGestureEvent={onSwipeGesture}>
        <KeyboardAvoidingView behavior={'padding'} style={globalStyle.flex}>
          <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <SafeAreaView
              style={[globalStyle.backgroundWhite, globalStyle.flex]}>
              <Pressable style={styles.backButton} onPress={handleCancel}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size={20}
                  color={'#B57EDC'}
                />
              </Pressable>
              <View style={styles.createPostTextView}>
                <Text style={styles.createPostText}>Update Event</Text>
              </View>
              <View style={styles.container}>
                {/* Container for inputs and post button */}
                <View style={styles.boxContainer}>
                  {/* Picker for date */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Date:</Text>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={date}
                      mode="date"
                      display="default"
                      accentColor="#B57EDC"
                      textColor="#B57EDC"
                      onChange={onChangeDate}
                    />
                  </View>
                  {/* Picker for time  */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Time:</Text>
                    <DateTimePicker
                      testID="dateTimePicker"
                      value={time}
                      mode="time"
                      display="default"
                      accentColor="#B57EDC"
                      textColor="#B57EDC"
                      onChange={onChangeTime}
                    />
                  </View>
                  {/* Title input */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.label}>Title:</Text>
                    <TextInput
                      placeholder="Type of event/group name"
                      value={title}
                      onChangeText={setTitle}
                      style={styles.input}
                    />
                  </View>
                  {/* location input */}
                  <View style={styles.inputContainer}>
                    <View style={styles.label}>
                      <Text style={styles.locationText}>Location:</Text>
                      {noLocation && (
                        <Text style={styles.requiredText}>Required*</Text>
                      )}
                    </View>
                    <TextInput
                      placeholder="Where to meet"
                      value={location}
                      onChangeText={text => {
                        setLocation(text);
                        if (text.trim() !== '') {
                          setNoLocation(false);
                        }
                      }}
                      style={styles.input}
                    />
                  </View>
                  {/* Multiline input for details */}
                  <View style={styles.detailsInputContainer}>
                    <Text style={styles.detailsLabel}>Details:</Text>
                    <TextInput
                      multiline
                      placeholder="Enter any additional details"
                      value={details}
                      onChangeText={setDetails}
                      style={styles.detailsInput}
                    />
                  </View>
                  {/* Photos. If no photo show template, if photo is uploaded show preview */}
                  <View style={styles.photoRow}>
                    {!photo1 && (
                      <TouchableOpacity
                        style={styles.addPhoto}
                        onPress={() => selectPhoto('1')}>
                        <Text style={styles.plus}>+</Text>
                        <FontAwesomeIcon
                          icon={faCamera}
                          size={30}
                          color={'#B57EDC'}
                        />
                      </TouchableOpacity>
                    )}
                    {photo1 && (
                      <View>
                        <Image
                          source={{uri: photo1.url}}
                          style={styles.photo}
                        />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            const combinedEventTime = combineDateAndTime(
                              date,
                              time,
                            );
                            handleDeletePhoto('1', combinedEventTime);
                          }}>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            color={'white'}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {!photo2 && (
                      <TouchableOpacity
                        style={styles.addPhoto}
                        onPress={() => selectPhoto('2')}>
                        <Text style={styles.plus}>+</Text>
                        <FontAwesomeIcon
                          icon={faCamera}
                          size={30}
                          color={'#B57EDC'}
                        />
                      </TouchableOpacity>
                    )}
                    {photo2 && (
                      <View>
                        <Image
                          source={{uri: photo2.url}}
                          style={styles.photo}
                        />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            const combinedEventTime = combineDateAndTime(
                              date,
                              time,
                            );
                            handleDeletePhoto('2', combinedEventTime);
                          }}>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            color={'white'}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                    {!photo3 && (
                      <TouchableOpacity
                        style={styles.addPhoto}
                        onPress={() => selectPhoto('3')}>
                        <Text style={styles.plus}>+</Text>
                        <FontAwesomeIcon
                          icon={faCamera}
                          size={30}
                          color={'#B57EDC'}
                        />
                      </TouchableOpacity>
                    )}
                    {photo3 && (
                      <View>
                        <Image
                          source={{uri: photo3.url}}
                          style={styles.photo}
                        />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            const combinedEventTime = combineDateAndTime(
                              date,
                              time,
                            );
                            handleDeletePhoto('3', combinedEventTime);
                          }}>
                          <FontAwesomeIcon
                            icon={faTrashCan}
                            color={'white'}
                            size={20}
                          />
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>

                  <Button
                    title={'Update'}
                    onPress={() => {
                      const combinedEventTime = combineDateAndTime(date, time);
                      handleUpdate(combinedEventTime);
                    }}
                    isDisabled={isUploading}
                  />
                </View>
              </View>
            </SafeAreaView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </PanGestureHandler>
    </GestureHandlerRootView>
  );
};

export default UpdatePost;
