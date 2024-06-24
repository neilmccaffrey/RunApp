import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  View,
} from 'react-native';
import Header from '../../components/Header/Header';
import globalStyle from '../../Styles/globalStyle';
import firestore from '@react-native-firebase/firestore';
import styles from './styles';
import {horizontalScale} from '../../Styles/scaling';
import ItemComponent from '../../components/ItemComponent/ItemComponent';
import {fetchDisplayNamesForAttendees} from '../../api/firestore';
import FastImage from 'react-native-fast-image';
import {useFocusEffect} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const Home = ({navigation}) => {
  const PAGE_SIZE = 10;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [activeIndexes, setActiveIndexes] = useState({});

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

  const fetchData = async (lastDoc = null) => {
    setLoading(true);
    try {
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

      if (documents.length < PAGE_SIZE) {
        setHasMore(false);
      }

      await preloadImages(documents);

      setData(prevData => (lastDoc ? [...prevData, ...documents] : documents));
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //update data on return to homescreen. ensures all post/profile updates are accurate
  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, []),
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
    return <ActivityIndicator size="large" color="#36454F" />;
  };

  useEffect(() => {
    const initialIndexes = {};
    data.forEach((_, index) => {
      initialIndexes[index] = 0;
    });
    setActiveIndexes(initialIndexes);
  }, [data]);

  const renderItem = useCallback(
    ({item, index}) => {
      const handleScroll = (event, itemIndex, imageCount) => {
        const scrollPosition = event.nativeEvent.contentOffset.x;
        const indexScroll = Math.round(
          scrollPosition / (width - horizontalScale(80)),
        );
        setActiveIndexes(prevState => ({
          ...prevState,
          [itemIndex]: indexScroll < imageCount ? indexScroll : imageCount - 1,
        }));
      };

      const renderPagination = (imageCount, itemIndex) => (
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
      );

      return (
        <ItemComponent
          item={item}
          itemIndex={index}
          handleScroll={handleScroll}
          renderPagination={renderPagination}
          onDelete={handleDelete}
        />
      );
    },
    [activeIndexes],
  );

  const handleDelete = itemId => {
    setData(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  return (
    <SafeAreaView style={[globalStyle.backgroundWhite, globalStyle.flex]}>
      <Header navigation={navigation} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#B57EDC" />
        </View>
      ) : (
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={item => item.id} // Ensure a unique key
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;

// const PAGE_SIZE = 10;

// // state for pagination of flatlist
// const [data, setData] = useState([]);
// const [loading, setLoading] = useState(false);
// const [lastDoc, setLastDoc] = useState(null);
// const [loadingMore, setLoadingMore] = useState(false);
// const [hasMore, setHasMore] = useState(true);

// //state for active index for image dot
// const [activeIndexes, setActiveIndexes] = useState({});

// // Utility function to convert Firestore timestamp to JavaScript Date object
// const convertTimestampToDate = timestamp => {
//   if (
//     timestamp &&
//     timestamp.seconds !== undefined &&
//     timestamp.nanoseconds !== undefined
//   ) {
//     return new Date(
//       timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000,
//     );
//   }
//   return null;
// };

// //useEffect to update home screen when a post is added
// useEffect(() => {
//   const unsubscribe = firestore()
//     .collection('posts')
//     .orderBy('createdAt', 'desc')
//     .onSnapshot(async snapshot => {
//       //Promise to ensure all displayName data is fetched before setData
//       const newData = await Promise.all(
//         snapshot.docs.map(async doc => {
//           const postData = doc.data();
//           const attendeesWithDisplayNames =
//             await fetchDisplayNamesForAttendees(postData.isGoing || []);
//           return {
//             id: doc.id,
//             ...postData,
//             eventTime: convertTimestampToDate(postData.eventTime),
//             isGoing: attendeesWithDisplayNames,
//           };
//         }),
//       );
//       setData(newData);
//     });

//   // Clean up the subscription on unmount
//   return () => unsubscribe();
// }, []);

// //pagination for flatlist
// useEffect(() => {
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const query = firestore()
//         .collection('posts')
//         .orderBy('createdAt', 'desc') // Sort by timestamp in descending order
//         .limit(PAGE_SIZE);

//       const snapshot = await query.get(); //get DocumentSnapshots from firestore
//       //Promise to ensure all displayName data is fetched before setData
//       const documents = await Promise.all(
//         snapshot.docs.map(async doc => {
//           const postData = doc.data();
//           const attendeesWithDisplayNames =
//             await fetchDisplayNamesForAttendees(postData.isGoing || []);
//           return {
//             id: doc.id,
//             ...postData,
//             eventTime: convertTimestampToDate(postData.eventTime),
//             isGoing: attendeesWithDisplayNames,
//           };
//         }),
//       ); // Map into an array of objects with data and the id from Firestore

//       if (documents.length < PAGE_SIZE) {
//         setHasMore(false);
//       }

//       setData(documents);
//       setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
//     } catch (error) {
//       console.error(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
//   fetchData();
// }, []);

// const fetchMore = async () => {
//   if (!hasMore) {
//     return;
//   }
//   setLoadingMore(true);
//   try {
//     const query = firestore()
//       .collection('posts')
//       .orderBy('createdAt', 'desc') // Sort by timestamp in descending order
//       .startAfter(lastDoc)
//       .limit(PAGE_SIZE);

//     const snapshot = await query.get(); //get DocumentSnapshots from firestore
//     //Promise to ensure all displayName data is fetched before setData
//     const documents = await Promise.all(
//       snapshot.docs.map(async doc => {
//         const postData = doc.data();
//         const attendeesWithDisplayNames = await fetchDisplayNamesForAttendees(
//           postData.isGoing || [],
//         );
//         return {
//           id: doc.id,
//           ...postData,
//           eventTime: convertTimestampToDate(postData.eventTime),
//           isGoing: attendeesWithDisplayNames,
//         };
//       }),
//     ); // Map into an array of objects with data and the id from Firestore

//     if (documents.length < PAGE_SIZE) {
//       setHasMore(false);
//     }

//     setData(prevData => [...prevData, ...documents]);
//     setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
//   } catch (error) {
//     console.error(error.message);
//   } finally {
//     setLoadingMore(false);
//   }
// };

// const renderFooter = () => {
//   if (!loadingMore) {
//     return null;
//   }
//   return <ActivityIndicator size="large" color="#36454F" />;
// };

// useEffect(() => {
//   // Initialize activeIndexes for each item with index 0 (to make current image dot active on load)
//   const initialIndexes = {};
//   data.forEach((_, index) => {
//     initialIndexes[index] = 0;
//   });
//   setActiveIndexes(initialIndexes);
// }, [data]);

// //usecallback to prevent unnecessary rerenders. Use memo in ItemComponent also
// const renderItem = useCallback(
//   ({item, index}) => {
//     //set active index based on scroll
//     const handleScroll = (event, itemIndex, imageCount) => {
//       const scrollPosition = event.nativeEvent.contentOffset.x;
//       const indexScroll = Math.round(
//         scrollPosition / (width - horizontalScale(80)),
//       );
//       setActiveIndexes(prevState => ({
//         ...prevState,
//         [itemIndex]: indexScroll < imageCount ? indexScroll : imageCount - 1,
//       }));
//     };

//     //pagination for image dots
//     const renderPagination = (imageCount, itemIndex) => (
//       <View style={styles.paginationContainer}>
//         {Array.from({length: imageCount}).map((_, i) => (
//           <View
//             key={i}
//             style={[
//               styles.paginationDot,
//               i === activeIndexes[itemIndex] && styles.paginationDotActive,
//             ]}
//           />
//         ))}
//       </View>
//     );

//     //render items with ItemComponent
//     return (
//       <ItemComponent
//         item={item}
//         itemIndex={index}
//         handleScroll={handleScroll}
//         renderPagination={renderPagination}
//         onDelete={handleDelete}
//       />
//     );
//   },
//   [activeIndexes],
// );

// const handleDelete = itemId => {
//   setData(prevItems => prevItems.filter(item => item.id !== itemId));
// };
