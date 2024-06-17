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
    height: '60%',
  },
  xButton: {
    position: 'absolute',
    top: verticalScale(8),
    right: horizontalScale(10),
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
    marginBottom: verticalScale(15),
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  commentImage: {
    borderWidth: horizontalScale(2),
    borderColor: '#B57EDC',
    width: horizontalScale(40),
    height: horizontalScale(40),
    borderRadius: 25,
    marginRight: 10,
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
    paddingLeft: 15,
  },
  backRightButton: {
    alignItems: 'center',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    width: 75,
    backgroundColor: '#FF0000',
    right: 0,
    marginBottom: verticalScale(16),
  },
  textColor: {
    color: 'white',
  },
});

export default styles;
