import React, {memo, useEffect, useRef, useState} from 'react';
import {
  faCircleArrowUp,
  faTrashCan,
  faTriangleExclamation,
  faUserSlash,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  Modal,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Keyboard,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import styles from './styles';
import {SwipeListView} from 'react-native-swipe-list-view';
import {scaleFontSize} from '../../Styles/scaling';
import Toast from 'react-native-toast-message';
import {firestore} from '../../firebaseConfig';
import {
  addCommentToPost,
  blockUser,
  deleteComment,
  fetchBlockedUsers,
  fetchComments,
  reportComment,
} from '../../api/firestore';
import {useAuth} from '../../contexts/AuthProvider';
import uuid from 'react-native-uuid';
import globalStyle from '../../Styles/globalStyle';
import FastImage from 'react-native-fast-image';
import {moderateText} from '../../api/moderateText';

// Fetch blocked users and filter comments
const loadAndFilterComments = async (postId, userId) => {
  const blockedUsers = await fetchBlockedUsers(userId);
  const comments = await fetchComments(postId);
  return filterComments(comments, blockedUsers);
};

// Filter comments based on blocked users
const filterComments = (comments, blockedUsers) => {
  return comments.filter(comment => !blockedUsers.includes(comment.userId));
};

const Comments = ({isOpen, onClose, postItem, onCommentAdded}) => {
  const {user, displayName, photoURL} = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(postItem.comments);
  const [prevScrollPos, setPrevScrollPos] = useState(0);

  const scrollRef = useRef(null);

  // Fetch comments initially and whenever the postItem changes
  useEffect(() => {
    const loadComments = async () => {
      if (postItem.id) {
        //fetch filtered comments
        const fetchedComments = await loadAndFilterComments(
          postItem.id,
          user.uid,
        );
        setComments(fetchedComments);
        // Preload comment images if fetched comments exists and is greater than 0
        if (fetchComments && fetchedComments?.length > 0) {
          const uris = fetchedComments.map(comment => ({
            uri: comment.photoURL,
          }));
          FastImage.preload(uris);
        }
      }
    };

    loadComments();
  }, [postItem.id]);

  const handleAddComment = async () => {
    if (!newComment.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Comment cannot be empty',
      });
      return;
    }

    // Moderate the comment
    const analysis = await moderateText(newComment);

    // Check for offensive content
    const attributesToCheck = {
      TOXICITY: 0.8,
      SEVERE_TOXICITY: 0.8,
      IDENTITY_ATTACK: 0.6,
      INSULT: 0.6,
      PROFANITY: 1.0,
      THREAT: 0.8,
    };

    const isOffensive = Object.keys(attributesToCheck).some(attribute => {
      return (
        analysis.attributeScores[attribute]?.summaryScore.value >=
        attributesToCheck[attribute]
      );
    });

    if (isOffensive) {
      Toast.show({
        type: 'error',
        text1: 'Your comment contains offensive content.',
        text2: 'Please modify it and try again',
      });
      return;
    }

    const comment = {
      userId: user.uid,
      displayName: displayName || 'Anonymous',
      photoURL: photoURL || '',
      text: newComment.trim(),
      createdAt: firestore.Timestamp.now(), // Create the timestamp explicitly
      commentId: uuid.v4(),
    };

    try {
      await addCommentToPost(postItem.id, comment);
      setNewComment('');
      const updatedComments = await loadAndFilterComments(
        postItem.id,
        user.uid,
      ); // Refresh comments after adding a new comment
      setComments(updatedComments);
      // Preload the new comment image
      if (comment.photoURL) {
        FastImage.preload([{uri: comment.photoURL}]);
      }
      onCommentAdded(postItem.id);
      Toast.show({
        type: 'success',
        text1: 'Comment added successfully',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error.message,
      });
    }
  };

  const renderHiddenItem = renData => {
    const isCommentOwner = renData.item.userId === user.uid;
    return (
      <View style={styles.hidden}>
        {/* delete button */}
        <TouchableOpacity
          style={[
            styles.backRightButton,
            !isCommentOwner && styles.notCommentOwner,
          ]}
          onPress={async () => {
            if (!isCommentOwner) {
              return;
            }
            try {
              await deleteComment(postItem.id, renData.item.commentId);
              const updatedComments = await loadAndFilterComments(
                postItem.id,
                user.uid,
              ); // Refresh comments after deleting comment
              setComments(updatedComments);

              // Preload updated comment images
              const uris = updatedComments.map(comment => ({
                uri: comment.photoURL,
              }));
              FastImage.preload(uris);

              Toast.show({
                type: 'success',
                text1: 'Comment deleted',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: error.message,
              });
            }
          }}>
          <FontAwesomeIcon icon={faTrashCan} color={'white'} size={20} />
          <Text style={styles.textColor}>Delete</Text>
        </TouchableOpacity>
        {/* report button */}
        <TouchableOpacity
          style={styles.backCenterButton}
          onPress={async () => {
            try {
              await reportComment(
                postItem.id,
                renData.item.commentId,
                renData.item.userId,
                user.uid,
              );
              const updatedComments = await fetchComments(postItem.id); // Refresh comments after reporting comment
              setComments(updatedComments);

              // Preload updated comment images
              const uris = updatedComments.map(comment => ({
                uri: comment.photoURL,
              }));
              FastImage.preload(uris);

              Toast.show({
                type: 'success',
                text1: 'Comment reported',
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: error.message,
              });
            }
          }}>
          <FontAwesomeIcon icon={faTriangleExclamation} size={20} />
          <Text style={styles.textColor}>Report</Text>
        </TouchableOpacity>
        {/* block user */}
        <TouchableOpacity
          style={styles.backLeftButton}
          onPress={() => {
            Alert.alert('Block User?', 'This action cannot be undone', [
              {
                text: 'OK',
                onPress: async () => {
                  await blockUser(renData.item.userId, user.uid);
                  const updatedComments = await loadAndFilterComments(
                    postItem.id,
                    user.uid,
                  ); //refresh comments after blocking a user
                  setComments(updatedComments);
                  Toast.show({
                    type: 'success',
                    text1: 'User Blocked',
                  });
                },
              },
              {
                text: 'Cancel',
                style: 'cancel',
              },
            ]);
          }}>
          <FontAwesomeIcon icon={faUserSlash} size={20} />
          <Text style={styles.textColor}>Block</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onScroll = event => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    if (currentOffset < prevScrollPos) {
      Keyboard.dismiss();
    }
    setPrevScrollPos(currentOffset);
  };

  return (
    <View style={globalStyle.flex}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isOpen}
        onRequestClose={onClose}>
        <KeyboardAvoidingView behavior={'padding'} style={globalStyle.flex}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={onClose} style={styles.xButtonContainer}>
              <FontAwesomeIcon
                icon={faXmark}
                size={30}
                style={styles.xButton}
              />
            </TouchableOpacity>
            <View style={styles.flatListContainer}>
              <SwipeListView
                ref={scrollRef}
                onScroll={onScroll}
                scrollEventThrottle={16}
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyListText}>No comments yet</Text>
                  </View>
                }
                data={comments}
                keyExtractor={item => item.commentId.toString()}
                renderHiddenItem={renderHiddenItem}
                rightOpenValue={-160}
                renderItem={({item}) => {
                  return (
                    <View style={[styles.commentContainer, styles.border]}>
                      {item.photoURL ? (
                        <FastImage
                          style={styles.commentImage}
                          source={{
                            uri: item.photoURL,
                            priority: FastImage.priority.high,
                          }}
                          resizeMode={FastImage.resizeMode.cover}
                          placeholder={
                            <ActivityIndicator size="large" color="#0000ff" />
                          }
                        />
                      ) : (
                        <Image
                          style={styles.commentImage}
                          source={require('../../assets/images/default-profile-pic.jpg')}
                        />
                      )}
                      <View>
                        <Text style={styles.displayNameText}>
                          {item.displayName}
                        </Text>
                        <Text style={styles.commentText}>{item.text}</Text>
                      </View>
                    </View>
                  );
                }}
              />
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
                textAlignVertical="top"
                style={styles.input}
              />
              <TouchableOpacity
                style={styles.arrow}
                onPress={() => {
                  handleAddComment();
                  Keyboard.dismiss();
                }}>
                <FontAwesomeIcon
                  icon={faCircleArrowUp}
                  size={scaleFontSize(35)}
                  color={'#B57EDC'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default memo(Comments);
