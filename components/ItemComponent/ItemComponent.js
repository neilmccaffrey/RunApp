import React, {memo, useEffect, useMemo, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import ShowMore from '../ShowMore/ShowMore';
import Toast from 'react-native-toast-message';
import {
  deletePostFromFirestore,
  fetchDisplayName,
  updateAttendanceInFirestore,
} from '../../api/firestore';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEllipsis,
  faPenToSquare,
  faTrashCan,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {useAuth} from '../../contexts/AuthProvider';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../../navigation/Routes';
import dateFormat from 'dateformat';
import {faComment, faThumbsUp} from '@fortawesome/free-regular-svg-icons';
import {faThumbsUp as faThumbsUpSolid} from '@fortawesome/free-solid-svg-icons';
import Comments from '../Comments/Comments';
import FastImage from 'react-native-fast-image';

const ItemComponent = memo(
  ({item, itemIndex, handleScroll, renderPagination, onDelete}) => {
    const {user} = useAuth();
    const navigation = useNavigation();
    const [goingModal, setGoingModal] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [usersPost, setUsersPost] = useState(false);
    const [attendanceButton, setAttendanceButton] = useState(false);

    // open/close comment modal logic
    const [commentModal, setCommentModal] = useState(false);
    const openCommentModal = () => setCommentModal(true);
    const closeCommentModal = () => setCommentModal(false);

    useEffect(() => {
      //reset state after delete
      const resetState = () => {
        setUsersPost(false);
      };

      const getProfileData = async () => {
        try {
          const name = await fetchDisplayName(item.userId);
          setDisplayName(name);
          //check if logged in users UID matches the userId that created the post (to implement edit/delete post)
          if (user && user.uid === item.userId) {
            setUsersPost(true);
          }
        } catch (error) {
          Toast.show({
            type: 'error',
            text1: error.message,
          });
        }
      };

      // Check if the user is already attending to set attendance state
      const checkUserAttendance = () => {
        if (user) {
          const isAttending = item.isGoing.some(
            attendee => attendee.uid === user.uid,
          );
          setAttendanceButton(isAttending);
        }
      };

      resetState();
      getProfileData();
      checkUserAttendance();
    }, [item.userId, item.isGoing, user]);

    const images = useMemo(() => {
      const imageArray = [];
      if (item.photo1) {
        imageArray.push({uri: item.photo1.url});
      }
      if (item.photo2) {
        imageArray.push({uri: item.photo2.url});
      }
      if (item.photo3) {
        imageArray.push({uri: item.photo3.url});
      }
      return imageArray;
    }, [item.photo1, item.photo2, item.photo3]);

    const handleDelete = async () => {
      try {
        await deletePostFromFirestore(item.id);
        onDelete(item.id); // Notify parent component to update the list
        setModalVisible(false);
        Toast.show({
          type: 'success',
          text1: 'Event deleted successfully',
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    };

    const handleEdit = item => {
      setModalVisible(false);
      const {id, title, location, details, eventTime, photo1, photo2, photo3} =
        item;

      navigation.navigate(Routes.UpdatePost, {
        id,
        title,
        location,
        details,
        eventTime: eventTime.toISOString(), // Convert Date to string
        photo1,
        photo2,
        photo3,
      });
    };

    const handleIsGoing = async () => {
      if (!user) {
        Toast.show({
          type: 'error',
          text1: 'You need to be logged in to attend',
        });
        return;
      }
      try {
        // Determine the new state based on the current state
        const newAttendanceButtonState = !attendanceButton;

        // Call the API function to update Firestore ** This will also sign the user up to receive a notification **
        await updateAttendanceInFirestore(
          item.id,
          user,
          newAttendanceButtonState,
          item.location,
          item.eventTime,
        );

        // Update the attendance button state after Firestore update
        setAttendanceButton(newAttendanceButtonState);
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: error.message,
        });
      }
    };

    return (
      <View style={styles.itemsContainer}>
        <View style={styles.photoTextContainer}>
          <View style={styles.photoTextView}>
            <FastImage
              style={styles.photo}
              source={{
                uri: item.profilePhoto, // Use profile photo from the post document
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              placeholder={<ActivityIndicator size="large" color="#B57EDC" />}
            />

            <Text style={styles.displayNameText}>{displayName}</Text>
          </View>
          {usersPost && (
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <FontAwesomeIcon
                icon={faEllipsis}
                size={25}
                style={styles.ellipsis}
              />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeLocationText}>
              {dateFormat(item.eventTime, 'ddd mmmm dS, yyyy')}
            </Text>
            <Text style={[styles.dateTimeSpacer, styles.dateTimeLocationText]}>
              @{dateFormat(item.eventTime, 'h:MM TT')}
            </Text>
          </View>
          <Text style={styles.dateTimeLocationText}>
            Location: {item.location}
          </Text>
        </View>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={event => handleScroll(event, itemIndex, images.length)}
          scrollEventThrottle={16}>
          {images.map((image, index) => (
            <FastImage
              key={index}
              style={styles.pictures}
              source={{
                uri: image.uri,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.cover}
              placeholder={<ActivityIndicator size="large" color="#0000ff" />}
            />
          ))}
        </ScrollView>
        {renderPagination(images.length, itemIndex)}
        <ShowMore text={item.details} />

        <View style={styles.postFooterContainer}>
          <TouchableOpacity style={styles.touchableRow} onPress={handleIsGoing}>
            <View style={styles.iconTextContainer}>
              <FontAwesomeIcon
                icon={attendanceButton ? faThumbsUpSolid : faThumbsUp}
                color={attendanceButton ? '#B57EDC' : '#36454F'}
                size={attendanceButton ? 25 : 20}
              />
              <Text
                style={
                  attendanceButton ? styles.footerTextActive : styles.footerText
                }>
                I'll be there!
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setGoingModal(true);
            }}>
            <Text style={styles.footerGoingText}>
              {item.isGoing.length} Going
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openCommentModal}>
            <View style={styles.iconTextContainerComment}>
              <FontAwesomeIcon
                icon={faComment}
                transform={{flipX: true}}
                color={'#36454F'}
                size={14}
              />
              <Text style={styles.commentText}>
                Comments {item.comments && item.comments.length}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Comments
          isOpen={commentModal}
          onClose={closeCommentModal}
          postItem={item}
        />

        {/* Edit/delete modal */}
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
                  onPress={() => handleEdit(item)}>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    size={30}
                    color={'#B57EDC'}
                  />
                  <Text style={styles.modalOptionsText}>Edit event</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.modalOptions}
                  onPress={handleDelete}>
                  <FontAwesomeIcon icon={faTrashCan} size={30} color={'red'} />
                  <Text style={styles.modalOptionsText}>Delete event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Going modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={goingModal}
          onRequestClose={() => {
            setGoingModal(false);
          }}>
          <TouchableWithoutFeedback onPress={() => setGoingModal(false)}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <TouchableOpacity
              onPress={() => setGoingModal(false)}
              style={styles.xButtonContainer}>
              <FontAwesomeIcon
                icon={faXmark}
                size={30}
                style={styles.xButton}
              />
            </TouchableOpacity>
            <View style={styles.flatListContainer}>
              <FlatList
                showsVerticalScrollIndicator={true}
                data={item.isGoing}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => {
                  return (
                    <View style={styles.goingItems}>
                      <Text style={styles.goingText}>{item.displayName}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  },
);

export default ItemComponent;
