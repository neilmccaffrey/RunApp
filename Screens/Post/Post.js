import React, {useState} from 'react';
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
import globalStyle from '../../Styles/globalStyle';
import {
  faCamera,
  faChevronLeft,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import styles from './styles';
import {createPost} from '../../api/firestore';
import {uploadPhoto, deletePhoto} from '../../api/storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Routes} from '../../navigation/Routes';
import {launchImageLibrary} from 'react-native-image-picker';
import Button from '../../components/Button/Button';
import Toast from 'react-native-toast-message';
import {useAuth} from '../../contexts/AuthProvider';
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from 'react-native-gesture-handler';

const Post = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [noLocation, setNoLocation] = useState(false);
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date(new Date().setHours(12, 0o0)));
  const [photo1, setPhoto1] = useState('');
  const [photo2, setPhoto2] = useState('');
  const [photo3, setPhoto3] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {user, photoURL} = useAuth();

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
  //delete photo
  const handleDeletePhoto = async photoNum => {
    if (photoNum === '1') {
      try {
        await deletePhoto(photo1.path);
        setPhoto1('');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    }
    if (photoNum === '2') {
      try {
        await deletePhoto(photo2.path);
        setPhoto2('');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    }
    if (photoNum === '3') {
      try {
        await deletePhoto(photo3.path);
        setPhoto3('');
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    }
  };

  const combineDateAndTime = (date, time) => {
    const combinedDate = new Date(date);
    combinedDate.setHours(time.getHours());
    combinedDate.setMinutes(time.getMinutes());
    combinedDate.setSeconds(time.getSeconds());
    combinedDate.setMilliseconds(time.getMilliseconds());
    return combinedDate;
  };

  const handlePress = eventTime => {
    if (!location) {
      setNoLocation(true);
    } else {
      createPost(
        user,
        title,
        location,
        details,
        eventTime,
        photo1,
        photo2,
        photo3,
        photoURL,
      );
      navigation.navigate(Routes.Home);
    }
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
              <Pressable
                style={styles.backButton}
                onPress={() => navigation.goBack()}>
                <FontAwesomeIcon
                  icon={faChevronLeft}
                  size={20}
                  color={'#B57EDC'}
                />
              </Pressable>
              <View style={styles.createPostTextView}>
                <Text style={styles.createPostText}>Create Event</Text>
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
                        onPress={() => {
                          Keyboard.dismiss();
                          selectPhoto('1');
                        }}>
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
                        <Image source={photo1} style={styles.photo} />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            Keyboard.dismiss();
                            handleDeletePhoto('1');
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
                        onPress={() => {
                          Keyboard.dismiss();
                          selectPhoto('2');
                        }}>
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
                        <Image source={photo2} style={styles.photo} />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            Keyboard.dismiss();
                            handleDeletePhoto('2');
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
                        onPress={() => {
                          Keyboard.dismiss();
                          selectPhoto('3');
                        }}>
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
                        <Image source={photo3} style={styles.photo} />
                        <TouchableOpacity
                          style={styles.trashCan}
                          onPress={() => {
                            Keyboard.dismiss();
                            handleDeletePhoto('3');
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

                  {/* Send post with date and time formatted */}
                  <Button
                    title={'Post'}
                    onPress={() => {
                      const combinedEventTime = combineDateAndTime(date, time);
                      handlePress(combinedEventTime);
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

export default Post;
