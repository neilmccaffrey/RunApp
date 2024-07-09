import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  Text,
  View,
} from 'react-native';
import Header from '../../components/Header/Header';
import globalStyle from '../../Styles/globalStyle';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';
import {horizontalScale} from '../../Styles/scaling';
import ItemComponent from '../../components/ItemComponent/ItemComponent';
import {
  fetchBlockedUsers,
  fetchDisplayNamesForAttendees,
} from '../../api/firestore';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';
import {useAuth} from '../../contexts/AuthProvider';

const {width} = Dimensions.get('window');

const filterPosts = (posts, blockedUsers) => {
  return posts.filter(post => !blockedUsers.includes(post.userId));
};

const Home = ({navigation, route}) => {
  const PAGE_SIZE = 5;
  const flatListRef = useRef(null);
  const {user, authenticating} = useAuth();
  const postsSetRef = useRef(new Set()); //used to ensure no duplicates

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [activeIndexes, setActiveIndexes] = useState({});

  //convert firebase seconds and nanoseconds to JS milliseconds timestamp
  const convertTimestampToDate = timestamp => {
    if (
      timestamp &&
      timestamp.seconds !== undefined &&
      timestamp.nanoseconds !== undefined
    ) {
      return new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
      );
    }
    return null;
  };

  const preloadImages = async documents => {
    const imageUris = documents.flatMap(doc => {
      const images = [];
      if (doc.profilePhoto) {
        images.push({uri: doc.profilePhoto});
      }
      if (doc.photo1) {
        images.push({uri: doc.photo1.url});
      }
      if (doc.photo2) {
        images.push({uri: doc.photo2.url});
      }
      if (doc.photo3) {
        images.push({uri: doc.photo3.url});
      }
      return images;
    });
    FastImage.preload(imageUris);
  };

  const fetchData = async (lastDoc = null, reset = false) => {
    try {
      const blockedUsers = await fetchBlockedUsers(user.uid);
      const query = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(PAGE_SIZE);
      const snapshot = lastDoc
        ? await query.startAfter(lastDoc).get()
        : await query.get();
      const documents = await Promise.all(
        snapshot.docs.map(async doc => {
          const postData = doc.data();
          const attendeesWithDisplayNames = await fetchDisplayNamesForAttendees(
            postData.isGoing || [],
          );
          return {
            id: doc.id,
            ...postData,
            eventTime: convertTimestampToDate(postData.eventTime),
            isGoing: attendeesWithDisplayNames,
          };
        }),
      );

      // Filter out posts from blocked users
      const filteredDocuments = filterPosts(documents, blockedUsers);

      if (filteredDocuments.length < PAGE_SIZE) {
        setHasMore(false);
      }

      await preloadImages(filteredDocuments);

      //used Set to avoid very few cases where a duplicate post is added with real-time updates
      if (reset) {
        postsSetRef.current = new Set(filteredDocuments);
      } else {
        filteredDocuments.forEach(doc => postsSetRef.current.add(doc));
      }

      setData(Array.from(postsSetRef.current));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

      // Scroll to top if reset
      if (reset && flatListRef.current) {
        flatListRef.current.scrollToOffset({animated: false, offset: 0});
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!authenticating) {
      fetchData();
    }
  }, [authenticating]);

  // Real-time listener to update posts for everyone. (avoids deleted posts being interacted with)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('posts')
      .orderBy('createdAt', 'desc')
      .onSnapshot(
        async snapshot => {
          if (!loading && !snapshot.empty) {
            const blockedUsers = await fetchBlockedUsers(user.uid);
            const documents = await Promise.all(
              snapshot.docs.map(async doc => {
                const postData = doc.data();
                const attendeesWithDisplayNames =
                  await fetchDisplayNamesForAttendees(postData.isGoing || []);
                return {
                  id: doc.id,
                  ...postData,
                  eventTime: convertTimestampToDate(postData.eventTime),
                  isGoing: attendeesWithDisplayNames,
                };
              }),
            );
            // Filter out posts from blocked users
            const filteredDocuments = filterPosts(documents, blockedUsers);
            setData(filteredDocuments);
          } else if (!loading) {
            setData([]);
          }
        },
        error => {
          console.error('Error fetching real-time updates: ', error);
        },
      );

    return () => unsubscribe();
  }, [loading]);

  // Update data on return to Home screen. Ensures all post/profile updates are accurate
  useFocusEffect(
    React.useCallback(() => {
      const {refreshNeeded} = route.params || {};
      if (refreshNeeded) {
        setHasMore(true); //reset infinite scroll
        fetchData(null, true);
        navigation.setParams({refreshNeeded: false}); // Reset the parameter
      }
    }, [route.params]),
  );

  const fetchMore = async () => {
    if (loadingMore || !hasMore) {
      return;
    }
    setLoadingMore(true);
    await fetchData(lastDoc);
  };

  const renderFooter = () => {
    if (!loadingMore) {
      return null;
    }
    return (
      <View>
        <ActivityIndicator size="large" color="#B57EDC" />
      </View>
    );
  };

  useEffect(() => {
    const initialIndexes = {};
    data.forEach((_, index) => {
      initialIndexes[index] = 0;
    });
    setActiveIndexes(initialIndexes);
  }, [data]);

  const handleScroll = useCallback((event, itemIndex, imageCount) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const indexScroll = Math.round(
      scrollPosition / (width - horizontalScale(80)),
    );
    setActiveIndexes(prevState => ({
      ...prevState,
      [itemIndex]: indexScroll < imageCount ? indexScroll : imageCount - 1,
    }));
  }, []);

  const renderPagination = useCallback(
    (imageCount, itemIndex) => (
      <View style={styles.paginationContainer}>
        {Array.from({length: imageCount}).map((_, i) => (
          <View
            key={i}
            style={[
              styles.paginationDot,
              i === activeIndexes[itemIndex] && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    ),
    [activeIndexes],
  );

  const renderItem = useCallback(
    ({item, index}) => {
      return (
        <ItemComponent
          item={item}
          itemIndex={index}
          handleScroll={handleScroll}
          renderPagination={renderPagination}
          onDelete={handleDelete}
          onCommentAdded={handleRefresh}
          onAttendanceUpdated={handleAttendanceRefresh}
        />
      );
    },
    [handleScroll, renderPagination],
  );

  const handleDelete = itemId => {
    setData(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  //handle refresh to update comments count for only the specific post
  const handleRefresh = async postId => {
    try {
      const updatedPostDoc = await firestore()
        .collection('posts')
        .doc(postId)
        .get();
      const updatedPostData = updatedPostDoc.data();

      // Ensure eventTime is converted to a JavaScript Date object
      if (updatedPostData.eventTime) {
        updatedPostData.eventTime = new Date(
          updatedPostData.eventTime.seconds * 1000 +
            updatedPostData.eventTime.nanoseconds / 1000000,
        );
      }

      const updatedPost = {
        id: updatedPostDoc.id,
        ...updatedPostData,
      };

      setData(prevData =>
        prevData.map(post => (post.id === postId ? updatedPost : post)),
      );
    } catch (error) {
      console.error('Error refreshing post data: ', error);
    }
  };

  //update the Going count and isGoing list for only the specific post
  const handleAttendanceRefresh = async postId => {
    try {
      const updatedPostDoc = await firestore()
        .collection('posts')
        .doc(postId)
        .get();
      const updatedPostData = updatedPostDoc.data();

      // Ensure eventTime is converted to a JavaScript Date object
      if (updatedPostData.eventTime) {
        updatedPostData.eventTime = new Date(
          updatedPostData.eventTime.seconds * 1000 +
            updatedPostData.eventTime.nanoseconds / 1000000,
        );
      }

      const updatedPost = {
        id: updatedPostDoc.id,
        ...updatedPostData,
      };

      setData(prevData =>
        prevData.map(post => (post.id === postId ? updatedPost : post)),
      );
    } catch (error) {
      console.error('Error refreshing post data: ', error);
    }
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Header navigation={navigation} />
      {loading && data.length === 0 && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B57EDC" />
        </View>
      )}
      <FlatList
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={'handled'}
        ref={flatListRef}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id} // Ensure a unique key
        onEndReached={fetchMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        windowSize={2}
        removeClippedSubviews={true} //only load what is in visible area of scrollview for performance
        ListEmptyComponent={
          !loading && ( //set !loading to not interfere with loading state and cause additional renders
            <View style={styles.emptyList}>
              <Text style={styles.emptyListText}>
                No new events are currently scheduled.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Home;
