import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  commentContainer: {
    marginTop: verticalScale(20),
    marginHorizontal: horizontalScale(15),
  },
  comment: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    paddingVertical: verticalScale(10),
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default styles;
