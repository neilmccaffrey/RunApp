import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDUzpopF8JPkmL0qRPU1QHSQRq2PYOvZ0Q',
  authDomain: 'run401-fe9b3.firebaseapp.com',
  projectId: 'run401-fe9b3',
  storageBucket: 'run401-fe9b3.appspot.com',
  messagingSenderId: '932260951919',
  appId: '1:932260951919:web:344c2d517660e943ed9a9a',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export {firebase, firestore};
