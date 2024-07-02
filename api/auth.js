import auth from '@react-native-firebase/auth';
import {firestore} from '../firebaseConfig';

// Sign Up Function
export const signUpWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    // Create a document using userUID to store email
    const user = userCredential.user;
    await firestore().collection('users').doc(user.uid).set({
      email: user.email,
      createdAt: firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    throw error;
  }
};

// Login function
export const signInWithEmailAndPassword = async (email, password) => {
  try {
    await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

// Logout function
export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    throw error;
  }
};

//password reset
export const passwordReset = async email => {
  try {
    // validate if email exists before sending password reset email
    const emailExists = await isEmailRegistered(email);
    if (!emailExists) {
      const error = new Error();
      error.code = 'auth/user-not-found';
      throw error;
    }
    await auth().sendPasswordResetEmail(email);
  } catch (error) {
    throw error;
  }
};

// Check if email is registered
export const isEmailRegistered = async email => {
  try {
    const userSnapshot = await firestore()
      .collection('users')
      .where('email', '==', email)
      .get();
    return !userSnapshot.empty;
  } catch (error) {
    return false;
  }
};
