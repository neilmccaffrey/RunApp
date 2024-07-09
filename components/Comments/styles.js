import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', // Align modal to the bottom
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    position: 'relative',
    width: '100%', // Full width of the screen
    backgroundColor: 'white',
    padding: horizontalScale(18),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    height: '75%',
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
  flatListContainer: {
    flex: 1,
    marginTop: verticalScale(30),
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#B57EDC',
    borderRadius: 20,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  input: {
    flex: 1, // Make sure input takes up remaining space
    paddingVertical: verticalScale(10),
    paddingLeft: horizontalScale(8),
    maxHeight: verticalScale(80),
  },
  arrow: {
    marginLeft: horizontalScale(8),
    marginRight: horizontalScale(3),
  },
  emptyList: {
    alignItems: 'center',
  },
  emptyListText: {
    color: '#36454F',
    fontSize: scaleFontSize(20),
  },
  commentContainer: {
    flexDirection: 'row',
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
    marginBottom: verticalScale(8),
    paddingVertical: verticalScale(5),
    paddingHorizontal: horizontalScale(8),
  },
  commentImage: {
    borderWidth: horizontalScale(2),
    borderColor: '#B57EDC',
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: 25,
    marginRight: horizontalScale(10),
  },
  border: {
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F6',
  },
  displayNameText: {
    color: '#36454F',
    fontWeight: 'bold',
    fontSize: scaleFontSize(12),
    marginBottom: verticalScale(5),
  },
  commentText: {
    color: '#36454F',
    fontSize: scaleFontSize(18),
  },
  hidden: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: horizontalScale(15),
  },
  backRightButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 50,
    backgroundColor: '#FF0000',
    right: 0,
    marginBottom: verticalScale(16),
  },
  notCommentOwner: {
    opacity: 0.5,
  },
  textColor: {
    color: 'white',
  },
  backCenterButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 50,
    backgroundColor: 'gray',
    right: 52,
    marginBottom: verticalScale(16),
  },
  backLeftButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 50,
    backgroundColor: 'gray',
    right: 104,
    marginBottom: verticalScale(16),
  },
});

export default styles;
