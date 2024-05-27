import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { app, auth } from './firebaseConfig';  // Importar correctamente

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const signIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtén el token del usuario para verificar los Custom Claims
      const idTokenResult = await user.getIdTokenResult();
      const role = idTokenResult.claims.role;

      console.log('Logged in!');
      
      // Redirige según el rol del usuario
      if (role === 'superuser') {
        navigate('/superuser-dashboard');
      } else if (role === 'user') {
        navigate('/user-dashboard');
      } else {
        navigate('/unknown-role'); // Opcional: para manejar roles desconocidos
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
