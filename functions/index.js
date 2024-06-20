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

    console.log(`Found ${snapshot.size} documents to process`);

    const dateFormat = (await import('dateformat')).default;

    const promises = [];
    snapshot.forEach(doc => {
      const signup = doc.data();
      console.log('Processing document:', doc.id, signup);

      // Ensure eventTime is a valid Firestore Timestamp
      const eventTime = signup.eventTime.toDate();
      if (isNaN(eventTime)) {
        console.error('Invalid eventTime:', signup.eventTime);
        return;
      }

      const notificationMessage = `Tomorrow ${
        signup.eventLocation
      } @ ${dateFormat(eventTime, 'h:MM TT')}!`;
      console.log('Notification message:', notificationMessage);

      const promise = sendNotification(signup.userId, notificationMessage)
        .then(() => {
          console.log('Notification sent, updating document:', doc.id);
          return doc.ref.update({notified: true});
        }) // Mark as notified
        .catch(error => console.error('Error sending notification:', error));

      promises.push(promise);
    });

    await Promise.all(promises);
    console.log('All notifications processed');
    return null;
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
