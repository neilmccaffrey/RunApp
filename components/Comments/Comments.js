import React, {useState} from 'react';
import {faCircleArrowUp, faXmark} from '@fortawesome/free-solid-svg-icons';
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
import {addCommentToPost} from '../../api/firestore';
import {useAuth} from '../../contexts/AuthProvider';
const Comments = ({isOpen, onClose, postItem}) => {
  const {user, displayName, photoURL} = useAuth();
  const [newComment, setNewComment] = useState('');

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
    };

    try {
      await addCommentToPost(postItem.id, comment);
      setNewComment('');
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

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
            <FontAwesomeIcon icon={faXmark} size={30} style={styles.xButton} />
            <View style={styles.flatListContainer}>
              <SwipeListView
                showsVerticalScrollIndicator={true}
                ListEmptyComponent={
                  <View style={styles.emptyList}>
                    <Text style={styles.emptyListText}>No comments yet</Text>
                  </View>
                }
                data={postItem.comments}
                keyExtractor={(item, index) => index.toString()}
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
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Comments;
