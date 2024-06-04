import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './firebaseConfig';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore(app);

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(getAuth(), email, password);
      const user = userCredential.user;

      // Primero intenta obtener datos de admincentro
      const adminRef = doc(db, 'admincentro', user.uid);
      const adminSnap = await getDoc(adminRef);

      if (adminSnap.exists()) {
        const adminData = adminSnap.data();
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('centroId', adminData.centro_id);
        navigate('/admin-panel');
        return;
      }

      // Luego intenta obtener datos de docentes
      const docenteRef = doc(db, 'docentes', user.uid);
      const docenteSnap = await getDoc(docenteRef);

      if (docenteSnap.exists()) {
        const docenteData = docenteSnap.data();
        localStorage.setItem('userRole', 'docente');
        localStorage.setItem('centroId', docenteData.centro_id);
        navigate('/Paginaprincipal');
        return;
      }

      // Verificar si el usuario es un administrador
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        if (userData.role === 'admin') {
          localStorage.setItem('userRole', 'admin');
          navigate('/admin-panel');
          return;
        }
      }

      // Si no se encuentra en ninguna colección, lanza error
      throw new Error('User data not found. Please contact the administrator.');
    } catch (error) {
      setError(error.message);
      console.error("Error de autenticación:", error);
    }
  };

  return (
    <div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button onClick={signIn}>Sign In</button>
      {error && <p>Error: {error}</p>}
    </div>
  );
}

export default Auth;
