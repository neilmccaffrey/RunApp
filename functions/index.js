const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendScheduledNotifications = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async context => {
    const now = new Date();
    const notificationsRef = admin.firestore().collection('event_signups');
    const snapshot = await notificationsRef
      .where('notificationTime', '<=', now)
      .where('notified', '==', false)
      .get();

    snapshot.forEach(async doc => {
      const signup = doc.data();
      await sendNotification(
        signup.displayName,
        `Your event ${signup.eventLocation} starts in 24 hours!`,
      );
      await doc.ref.update({notified: true}); // Mark as notified
    });
  });

async function sendNotification(userId, message) {
  const userDoc = await admin.firestore().collection('users').doc(userId).get();
  const user = userDoc.data();
  const payload = {
    notification: {
      title: 'Event Reminder',
      body: message,
    },
  };

  if (user.deviceToken) {
    const message = {
      token: user.deviceToken,
      notification: {
        title: 'Event Reminder',
        body: message,
      },
    };
    await admin.messaging().send(message);
  }
}
