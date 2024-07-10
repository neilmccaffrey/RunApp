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
  signUpTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  signUpText: {
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
  loginButton: {
    marginTop: verticalScale(30),
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: scaleFontSize(14),
    color: 'blue',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  scrollViewContainer: {
    flex: 1,
    width: '100%',
    marginBottom: 10,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingVertical: 10,
  },
  modalText: {
    fontSize: scaleFontSize(14),
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    backgroundColor: '#B57EDC',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  cancelButton: {
    backgroundColor: 'gray',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default styles;
