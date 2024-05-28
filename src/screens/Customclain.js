const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setCustomClaims = functions.https.onCall(async (data, context) => {
  const { uid, role } = data;
  
  // Check that the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  // Check that the user is an admin
  const callerUser = await admin.auth().getUser(context.auth.uid);
  if (callerUser.customClaims && callerUser.customClaims.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'The caller does not have permission to set custom claims.');
  }

  return admin.auth().setCustomUserClaims(uid, { role }).then(() => {
    return { message: `Successfully set ${role} role to user ${uid}` };
  }).catch((error) => {
    throw new functions.https.HttpsError('unknown', error.message, error);
  });
});
