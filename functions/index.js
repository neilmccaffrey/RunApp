const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');
const moment = require('moment-timezone');

admin.initializeApp();

//event notifications
exports.sendScheduledNotifications = functions.pubsub
  .schedule('every 10 minutes')
  .onRun(async context => {
    const now = new Date();
    const notificationsRef = admin.firestore().collection('event_signups');
    const snapshot = await notificationsRef
      .where('notificationTime', '<=', now)
      .where('notified', '==', false)
      .get();

    const batch = admin.firestore().batch();

    const notificationsPromises = snapshot.docs.map(async doc => {
      const signup = doc.data();
      // Ensure eventTime is a valid JavaScript Timestamp
      const eventTime = signup.eventTime.toDate();
      // Convert to local time zone
      const localEventTime = moment(eventTime)
        .tz('America/New_York')
        .format('h:mm A');

      const notificationMessage = `Tomorrow ${signup.eventLocation} @${localEventTime}!`;
      await sendNotification(signup.deviceToken, notificationMessage);
      batch.delete(doc.ref); // Delete the document
    });

    await Promise.all(notificationsPromises);
    await batch.commit();

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

//moderate images
const client = new vision.ImageAnnotatorClient({
  keyFilename: 'run401-fe9b3-8568ec98fb57.json', //path to JSON file
});

exports.moderateImage = functions.storage.object().onFinalize(async object => {
  const filePath = object.name;
  const file = admin.storage().bucket().file(filePath);

  try {
    const [result] = await client.safeSearchDetection(
      `gs://${object.bucket}/${filePath}`,
    );
    const detections = result.safeSearchAnnotation;

    const {adult, violence, racy} = detections;

    if (
      adult === 'VERY_LIKELY' ||
      violence === 'VERY_LIKELY' ||
      racy === 'VERY_LIKELY'
    ) {
      await file.delete();

      // Extract the user ID from the file path
      const userId = filePath.split('/')[1].split('.')[0];

      if (userId) {
        // Update the user's Firestore document
        await admin.firestore().collection('users').doc(userId).update({
          profilePhoto: null,
        });
      }
    }
  } catch (error) {
    console.error('Error during SafeSearchDetection:', error);
  }
});

//send notifications to admins for comment and post reports
exports.notifyAdminsOnReport = functions.firestore
  .document('reportedPosts/{reportId}')
  .onCreate(async () => {
    await sendAdminNotification('post');
  });

exports.notifyAdminsOnCommentReport = functions.firestore
  .document('reportedComments/{reportId}')
  .onCreate(async () => {
    await sendAdminNotification('comment');
  });

async function sendAdminNotification(type) {
  // Fetch admin tokens
  const adminTokensSnapshot = await admin
    .firestore()
    .collection('adminTokens')
    .get();

  const tokens = [];
  adminTokensSnapshot.forEach(doc => {
    const tokenData = doc.data();
    if (tokenData.fcmToken) {
      tokens.push(tokenData.fcmToken);
    }
  });

  if (tokens.length > 0) {
    const payload = {
      notification: {
        title: 'New Report',
        body: `A new ${type} report has been submitted`,
      },
      apns: {
        payload: {
          aps: {
            'content-available': 1,
          },
        },
      },
    };
    const messages = tokens.map(token => ({
      ...payload,
      token,
    }));
    await admin.messaging().sendEach(messages);
  }
}
