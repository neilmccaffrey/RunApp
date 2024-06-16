import {StyleSheet} from 'react-native';
import {
  horizontalScale,
  scaleFontSize,
  verticalScale,
} from '../../Styles/scaling';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: horizontalScale(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  forgotPasswordTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordText: {
    fontSize: scaleFontSize(25),
    fontWeight: 'bold',
    color: '#36454F',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B57EDC',
    borderRadius: 10,
    paddingVertical: verticalScale(10),
    paddingLeft: horizontalScale(8),
    marginVertical: verticalScale(8),
  },
  returnButton: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
  retunButtonText: {
    fontSize: scaleFontSize(14),
    color: 'blue',
  },
});

export default styles;
