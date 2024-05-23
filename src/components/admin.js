// C:\Users\usuario\Desktop\g2-fronted\src\components\admin.js
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json'); // Asegúrate de que la ruta al archivo de credenciales sea correcta

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://your-database-name.firebaseio.com'
});

const auth = admin.auth();
module.exports = { auth };

const { auth } = require('./admin'); // Importa la configuración de Firebase Admin SDK

async function setCustomUserClaims(uid, role) {
  try {
    // Asigna el rol al usuario
    await auth.setCustomUserClaims(uid, { role });
    console.log(`Role ${role} assigned to user ${uid}`);
  } catch (error) {
    console.error('Error assigning role:', error);
  }
}

// Ejemplo de uso
const uid = 'user-uid'; // UID del usuario al que deseas asignar un rol
const role = 'superuser'; // El rol que deseas asignar, puede ser 'superuser' o 'user'

setCustomUserClaims(uid, role);
