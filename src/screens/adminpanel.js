import React, { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'; // Importar correctamente

function AdminPanel() {
  const [uid, setUid] = useState('');
  const [role, setRole] = useState('usuario');
  const [expirationDate, setExpirationDate] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const db = getFirestore(app);
  const functions = getFunctions(app);

  const setUserPermissions = httpsCallable(functions, 'setUserPermissions');

  const updatePermissions = async () => {
    try {
      await setUserPermissions({ uid, role, expirationDate });

      setMessage(`Successfully updated permissions for user ${uid}`);
    } catch (error) {
      console.error('Error updating permissions:', error);
      setError(error.message);
    }
  };

  const toggleAccess = async (uid, accessDenied) => {
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, { accessDenied });

      setMessage(`Successfully ${accessDenied ? 'denied' : 'restored'} access for user ${uid}`);
    } catch (error) {
      console.error('Error toggling access:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      <input
        type="text"
        value={uid}
        onChange={(e) => setUid(e.target.value)}
        placeholder="User ID"
      />
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="admin">Admin</option>
        <option value="docente">Docente</option>
        <option value="usuario">Usuario</option>
      </select>
      <input
        type="date"
        value={expirationDate}
        onChange={(e) => setExpirationDate(e.target.value)}
        placeholder="Expiration Date"
      />
      <button onClick={updatePermissions}>Update Permissions</button>
      <button onClick={() => toggleAccess(uid, true)}>Deny Access</button>
      <button onClick={() => toggleAccess(uid, false)}>Restore Access</button>
      {message && <p>{message}</p>}
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default AdminPanel;
