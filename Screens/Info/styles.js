import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  backButton: {
    marginTop: verticalScale(12),
    marginLeft: horizontalScale(12),
  },
  instagramButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: horizontalScale(40),
    height: horizontalScale(40),
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#EFF2F6',
    borderTopWidth: 1,
    borderTopColor: '#EFF2F6',
    padding: horizontalScale(10),
    justifyContent: 'space-between',
    marginTop: verticalScale(15),
  },
  buttonItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontSize: scaleFontSize(18),
    color: '#36454F',
    marginLeft: horizontalScale(15),
  },
  messageText: {
    fontSize: scaleFontSize(18),
    color: '#36454F',
    marginHorizontal: horizontalScale(15),
  },
  infoText: {
    fontSize: scaleFontSize(18),
    color: '#36454F',
  },
  infoContainer: {
    marginHorizontal: horizontalScale(15),
    marginVertical: verticalScale(25),
  },
});

export default styles;
