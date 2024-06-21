import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  headerContainer: {
    marginTop: verticalScale(8),
    marginHorizontal: horizontalScale(16),
    backgroundColor: '#fff', // Ensure the background is set
    zIndex: 1, // Ensure the header is above the shadow
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  profile: {
    alignItems: 'center',
  },
  showdowContainer: {
    height: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    marginTop: -3, // Slightly overlap the shadow to make it more subtle
    zIndex: 0, // Ensure the shadow is below the header
  },
  photo: {
    borderWidth: horizontalScale(2),
    borderColor: '#B57EDC',
    borderRadius: 40,
    height: horizontalScale(50),
    width: horizontalScale(50),
  },
  text: {
    fontSize: scaleFontSize(16),
    fontWeight: '500',
    color: '#36454F',
    marginTop: verticalScale(5),
    textAlign: 'center',
  },
});

export default styles;
