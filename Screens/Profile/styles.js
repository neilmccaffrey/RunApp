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
  backButtonLogoutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(12),
    marginHorizontal: horizontalScale(12),
  },
  logoutText: {
    fontSize: scaleFontSize(18),
    color: 'blue',
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
  profileTextView: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileText: {
    fontSize: scaleFontSize(25),
    fontWeight: 'bold',
    color: '#36454F',
  },
  addPhoto: {
    position: 'relative',
    borderWidth: 3,
    borderColor: '#36454F',
    borderRadius: 100,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    height: horizontalScale(140),
    width: horizontalScale(140),
  },
  plus: {
    position: 'absolute',
    top: verticalScale(10),
    right: horizontalScale(10),
    color: '#B57EDC',
    fontSize: scaleFontSize(50),
  },
  addPhotoView: {
    alignItems: 'center',
  },
  photo: {
    borderWidth: horizontalScale(4),
    borderColor: '#B57EDC',
    borderRadius: 100,
    height: horizontalScale(140),
    width: horizontalScale(140),
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  xButton: {
    position: 'absolute',
    top: verticalScale(8),
    right: horizontalScale(10),
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
  editPhotoMargin: {
    marginTop: verticalScale(10),
  },
  editPhotoText: {
    color: 'blue',
  },
  alignPhotoEditTextCenter: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#B57EDC',
    borderRadius: 10,
    paddingVertical: verticalScale(10),
    paddingLeft: horizontalScale(8),
    width: '70%',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: verticalScale(20),
  },
  label: {
    marginRight: horizontalScale(5),
    width: '30%',
    color: '#36454F',
  },
});

export default styles;
