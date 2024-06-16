export const getErrorMessage = error => {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'Email address is already in use.';
    case 'auth/invalid-email':
      return 'Email address is not valid.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'The password is too weak.';
    case 'auth/user-disabled':
      return 'The user account has been disabled.';
    case 'auth/user-not-found':
      return 'There is no user record with this email.';
    case 'auth/wrong-password':
      return 'The password is invalid.';
    case 'auth/invalid-credential':
      return 'Email and/or password is incorrect.';
    default:
      return 'An unknown error occurred. Please try again.';
  }
};
