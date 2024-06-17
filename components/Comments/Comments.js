import React, {useEffect, useState} from 'react';
import {
  faCircleArrowUp,
  faTrashCan,
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
  Image,
} from 'react-native';
import styles from './styles';
import {SwipeListView} from 'react-native-swipe-list-view';
import {scaleFontSize} from '../../Styles/scaling';
import Toast from 'react-native-toast-message';
import {firestore} from '../../firebaseConfig';
import {
  addCommentToPost,
  deleteComment,
  fetchComments,
} from '../../api/firestore';
import {useAuth} from '../../contexts/AuthProvider';
import uuid from 'react-native-uuid';

const Comments = ({isOpen, onClose, postItem}) => {
  const {user, displayName, photoURL} = useAuth();
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(postItem.comments);

  // Fetch comments initially and whenever the postItem changes
  useEffect(() => {
    const loadComments = async () => {
      if (postItem.id) {
        const fetchedComments = await fetchComments(postItem.id);
        setComments(fetchedComments);
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

    const comment = {
      userId: user.uid,
      displayName: displayName || 'Anonymous',
      photoURL: photoURL || '',
      text: newComment,
      createdAt: firestore.Timestamp.now(), // Create the timestamp explicitly
      commentId: uuid.v4(),
    };

    try {
      await addCommentToPost(postItem.id, comment);
      setNewComment('');
      const updatedComments = await fetchComments(postItem.id); // Refresh comments after adding a new comment
      setComments(updatedComments);
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

  const renderHiddenItem = renData => (
    <View style={styles.hidden}>
      <TouchableOpacity
        style={styles.backRightButton}
        onPress={async () => {
          try {
            await deleteComment(postItem.id, renData.item.commentId);
            const updatedComments = await fetchComments(postItem.id); // Refresh comments after adding a new comment
            setComments(updatedComments);
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
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalView}>
        <TouchableOpacity onPress={onClose}>
          <FontAwesomeIcon icon={faXmark} size={30} style={styles.xButton} />
        </TouchableOpacity>
        <View style={styles.flatListContainer}>
          <SwipeListView
            showsVerticalScrollIndicator={true}
            ListEmptyComponent={
              <View style={styles.emptyList}>
                <Text style={styles.emptyListText}>No comments yet</Text>
              </View>
            }
            data={comments}
            keyExtractor={item => item.commentId.toString()}
            renderHiddenItem={renderHiddenItem}
            rightOpenValue={-75}
            renderItem={({item}) => {
              return (
                <View style={styles.commentContainer}>
                  <Image
                    source={{uri: item.photoURL}}
                    style={styles.commentImage}
                  />
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
          <TouchableOpacity style={styles.arrow} onPress={handleAddComment}>
            <FontAwesomeIcon
              icon={faCircleArrowUp}
              size={scaleFontSize(35)}
              color={'#B57EDC'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Comments;
