import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app, auth } from './firebaseConfig'; // Importar correctamente
import { getFirestore, doc, getDoc } from 'firebase/firestore';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const db = getFirestore(app);

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtén los datos del usuario desde Firestore
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const { role, expirationDate, accessDenied } = userData;

        // Verificar si el acceso está denegado
        if (accessDenied) {
          throw new Error('Your access has been denied by the administrator.');
        }

        // Verificar la fecha de expiración
        const now = new Date();
        if (expirationDate && now > new Date(expirationDate)) {
          throw new Error('Your access has expired. Please contact the administrator.');
        }

        console.log('Logged in!');

        // Redirige según el rol del usuario
        if (role === 'admin') {
          navigate('/superuser-dashboard');
        } else if (role === 'docente') {
          navigate('/docente-dashboard');
        } else if (role === 'usuario') {
          navigate('/user-dashboard');
        } else {
          navigate('/unknown-role'); // Opcional: para manejar roles desconocidos
        }
      } else {
        throw new Error('User data not found. Please contact the administrator.');
      }
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.message);
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
