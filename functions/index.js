const functions = require('firebase-functions');
const admin = require('firebase-admin');
const moment = require('moment-timezone');

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
      // Ensure eventTime is a valid JavaScript Timestamp
      const eventTime = signup.eventTime.toDate();
      //convert to local time zone
      const localEventTime = moment(eventTime)
        .tz('America/New_York')
        .format('h:mm A');

      const notificationMessage = `Tomorrow ${signup.eventLocation} @${localEventTime}!`;
      await sendNotification(signup.deviceToken, notificationMessage);
      await doc.ref.update({notified: true}); // Mark as notified
    });

    return null;
  });

async function sendNotification(deviceToken, message) {
  const payload = {
    notification: {
      title: 'Event Reminder',
      body: message,
    },
    apns: {
      payload: {
        aps: {
          'content-available': 1,
        },
      },
    },
    token: deviceToken,
  };

  await admin
    .messaging()
    .send(payload)
    .catch(error => {
      console.log('Error sending message:', error);
    });
}
