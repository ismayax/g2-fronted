const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.setUserPermissions = functions.https.onCall(async (data, context) => {
  const { uid, role, expirationDate } = data;

  // Check that the user is authenticated and is an admin
  if (!context.auth) {
    throw new functions.https.HttpsError('failed-precondition', 'The function must be called while authenticated.');
  }

  const callerUser = await admin.auth().getUser(context.auth.uid);
  if (callerUser.customClaims && callerUser.customClaims.role !== 'admin') {
    throw new functions.https.HttpsError('permission-denied', 'The caller does not have permission to set custom claims.');
  }

  // Update the user's custom claims
  await admin.auth().setCustomUserClaims(uid, { role });

  // Store the expiration date in Firestore
  const userRef = admin.firestore().collection('users').doc(uid);
  await userRef.set({ role, expirationDate, accessDenied: false }, { merge: true });

  return { message: `Successfully set ${role} role and expiration date to user ${uid}` };
});
