import React, {useEffect, useState} from 'react';
import {
  FlatList,
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
import {banUser, deleteReportedComment} from '../../api/firestore';

const Admin = () => {
  const [reportedComments, setReportedComments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [userToBan, setUserToBan] = useState(null);
  const [docId, setDocId] = useState(null);

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

    fetchReportedComments();
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

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <View style={styles.commentContainer}>
        <Text>Reported Comments:</Text>
        <FlatList
          data={reportedComments}
          renderItem={({item}) => (
            <View style={styles.comment}>
              <Text>{item.comment.text}</Text>
              <TouchableOpacity
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
      </View>

      {/* Ban user modal */}
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
    </SafeAreaView>
  );
};

export default Admin;
