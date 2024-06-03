import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from './firebaseConfig'; // Asegúrate de importar correctamente

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

      // Obtén los datos del usuario desde Firestore
      const userRef = doc(db, 'admincentro', user.uid); // Asegúrate de que el UID del usuario corresponda
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const { role, centro_id } = userData;

        // Guardar el usuario en el contexto global
        setUser(userCredential.user);

        // Guardar el rol del usuario en el almacenamiento local
        localStorage.setItem('userRole', role);
        localStorage.setItem('centroId', centro_id); // Asegúrate de que esto es un string

        // Redirigir al usuario según su rol
        if (role === 'admin') {
          navigate('/superuser-dashboard');
        } else if (role === 'docente') {
          navigate('/docente-dashboard');
        } else if (role === 'centro_educativo') {
          navigate(`/centro-dashboard?centroId=${centro_id}`);
        } else {
          navigate('/home');
        }
      } else {
        throw new Error('User data not found. Please contact the administrator.');
      }
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
