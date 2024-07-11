import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import globalStyle from '../../Styles/globalStyle';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faEllipsis,
  faTrashCan,
  faUserSlash,
} from '@fortawesome/free-solid-svg-icons';
import {
  banUser,
  deleteNotifications,
  deletePostFromFirestore,
  deleteReportedComment,
  deleteReportedPost,
} from '../../api/firestore';
import {deletePhoto} from '../../api/storage';

const Admin = () => {
  const [reportedComments, setReportedComments] = useState([]);
  const [reportedPosts, setReportedPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [postModal, setPostModal] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [docId, setDocId] = useState(null);
  const [postItem, setPostItem] = useState(null);

  useEffect(() => {
    const fetchReportedComments = async () => {
      try {
        const commentsSnapshot = await firestore()
          .collection('reportedComments')
          .get();
        const commentsList = commentsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReportedComments(commentsList);
      } catch (error) {
        console.error('Error fetching reported comments: ', error);
      }
    };

    const fetchReportedPosts = async () => {
      try {
        const postsSnapshot = await firestore()
          .collection('reportedPosts')
          .get();
        const postsList = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReportedPosts(postsList);
      } catch (error) {
        console.log('Error fetching posts', error);
      }
    };

    fetchReportedComments();
    fetchReportedPosts();
  }, []);

  const handleBanUser = async userId => {
    try {
      await banUser(userId);
    } catch (error) {
      console.error('Error banning user:', error);
    } finally {
      setUserToBan(null);
      setModalVisible(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteReportedComment(docId);
      setReportedComments(
        reportedComments.filter(comment => comment.id !== docId),
      );
    } catch (error) {
      console.error('Error deleting document:', error);
    } finally {
      setDocId(null);
      setModalVisible(false);
    }
  };

  const handleDeletePost = async item => {
    try {
      //delete photos from storage
      if (item.photo1) {
        deletePhoto(item.photo1.path);
      }
      if (item.photo2) {
        deletePhoto(item.photo2.path);
      }
      if (item.photo3) {
        deletePhoto(item.photo3.path);
      }
      await deleteNotifications(item.postId);
      await deletePostFromFirestore(item.postId);
      await deleteReportedPost(docId);
    } catch (error) {
      console.log(error.message);
    } finally {
      setDocId(null);
      setPostItem(null);
      setPostModal(false);
    }
  };

  const handleRemoveReport = async () => {
    try {
      await deleteReportedPost(docId);
    } catch (error) {
      console.log(error.message);
    } finally {
      setDocId(null);
      setPostItem(null);
      setPostModal(false);
    }
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.container}>
        <Text>Reported Comments:</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reportedComments}
          renderItem={({item}) => (
            <View style={styles.comment}>
              <View style={styles.textContainer}>
                <Text>{item.comment.text}</Text>
              </View>
              <TouchableOpacity
                style={styles.ellipsisContainer}
                onPress={() => {
                  setUserToBan(item.userId);
                  setDocId(item.id);
                  setModalVisible(true);
                }}>
                <FontAwesomeIcon icon={faEllipsis} size={20} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id} // Ensure a unique key
        />

        <Text>Reported Posts:</Text>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={reportedPosts}
          renderItem={({item}) => (
            <View style={styles.comment}>
              <View style={styles.textContainer}>
                <Text>Title: {item.title}</Text>
                <Text>Location: {item.location}</Text>
                <Text>Details: {item.details}</Text>
                {item.photo1 && (
                  <Image
                    source={{uri: item.photo1.url}}
                    style={styles.photos}
                  />
                )}
                {item.photo2 && (
                  <Image
                    source={{uri: item.photo2.url}}
                    style={styles.photos}
                  />
                )}
                {item.photo3 && (
                  <Image
                    source={{uri: item.photo3.url}}
                    style={styles.photos}
                  />
                )}
              </View>

              <TouchableOpacity
                style={styles.ellipsisContainer}
                onPress={() => {
                  setUserToBan(item.userId);
                  setPostItem(item);
                  setDocId(item.id);
                  setPostModal(true);
                }}>
                <FontAwesomeIcon icon={faEllipsis} size={20} />
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.id} // Ensure a unique key
        />
      </View>

      {/* comment modal */}
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
              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => handleBanUser(userToBan)}>
                <FontAwesomeIcon
                  icon={faUserSlash}
                  size={30}
                  color={'#B57EDC'}
                />
                <Text style={styles.modalOptionsText}>BAN USER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptions}
                onPress={handleDeleteComment}>
                <FontAwesomeIcon icon={faTrashCan} size={30} color={'red'} />
                <Text style={styles.modalOptionsText}>Delete comment</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* post modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={postModal}
        onRequestClose={() => {
          setPostModal(false);
        }}>
        <TouchableWithoutFeedback onPress={() => setPostModal(false)}>
          <View style={styles.overlay}>
            <View style={styles.modalView}>
              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => handleBanUser(userToBan)}>
                <FontAwesomeIcon
                  icon={faUserSlash}
                  size={30}
                  color={'#B57EDC'}
                />
                <Text style={styles.modalOptionsText}>BAN USER</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalOptions}
                onPress={() => handleDeletePost(postItem)}>
                <FontAwesomeIcon icon={faTrashCan} size={30} color={'red'} />
                <Text style={styles.modalOptionsText}>Delete Post</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOptions}
                onPress={handleRemoveReport}>
                <Text style={styles.modalOptionsText}>Remove Report</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

export default Admin;
