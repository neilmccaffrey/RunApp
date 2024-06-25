import {Dimensions, StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  pictures: {
    height: verticalScale(240),
    width: width - horizontalScale(10),
    marginHorizontal: horizontalScale(5),
    borderRadius: 10,
    marginTop: verticalScale(10),
  },
  itemsContainer: {
    marginTop: verticalScale(10),
    borderBottomWidth: verticalScale(8),
    borderBottomColor: '#cccccc',
  },
  titleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: scaleFontSize(30),
    fontWeight: 'bold',
    color: '#36454F',
  },
  dateTimeContainer: {
    flexDirection: 'row',
  },
  dateTimeSpacer: {
    marginLeft: horizontalScale(5),
  },
  dateTimeLocationText: {
    fontSize: scaleFontSize(18),
    color: '#36454F',
  },
  photo: {
    borderWidth: horizontalScale(2),
    borderColor: '#B57EDC',
    borderRadius: 25,
    height: horizontalScale(30),
    width: horizontalScale(30),
    marginLeft: horizontalScale(10),
    marginRight: horizontalScale(5),
  },
  photoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoTextView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayNameText: {
    color: '#36454F',
    fontWeight: 'bold',
  },
  ellipsis: {
    marginRight: horizontalScale(10),
    color: '#36454F',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal to the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'relative',
    width: '100%', // Full width of the screen
    backgroundColor: 'white',
    padding: horizontalScale(20),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '40%',
  },
  xButtonContainer: {
    padding: 10,
    position: 'absolute',
    top: verticalScale(8),
    right: horizontalScale(10),
  },
  xButton: {
    color: '#36454F',
  },
  modalOptions: {
    marginTop: verticalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalOptionsText: {
    marginLeft: horizontalScale(10),
    fontSize: scaleFontSize(20),
    color: '#36454F',
  },
  postFooterContainer: {
    marginVertical: verticalScale(10),
    marginHorizontal: horizontalScale(20),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTextContainerComment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: verticalScale(5),
  },
  touchableRow: {
    flexDirection: 'row',
  },
  footerText: {
    marginLeft: horizontalScale(5),
    paddingTop: verticalScale(5),
    color: '#36454F',
  },
  footerTextActive: {
    marginLeft: horizontalScale(5),
    paddingTop: verticalScale(5),
    color: '#B57EDC',
  },
  footerGoingText: {
    paddingTop: verticalScale(5),
    color: '#36454F',
  },
  goingItems: {
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
  },
  goingText: {
    color: '#36454F',
    fontWeight: 'bold',
    paddingVertical: verticalScale(5),
  },
  flatListContainer: {
    flex: 1,
    marginTop: verticalScale(30),
  },
  commentText: {
    color: '#36454F',
    marginLeft: horizontalScale(3),
    paddingTop: verticalScale(2),
  },
});

export default styles;
