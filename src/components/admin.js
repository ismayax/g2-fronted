import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAuth } from './contexts/AuthContext'; // Importa tu contexto de autenticación

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth(); // Importa la función de inicio de sesión desde el contexto de autenticación

  const handleSignIn = async () => {
    try {
      // Realiza la autenticación con Firebase Authentication
      await login(email, password);
      
      // Redirige al usuario según su rol después de iniciar sesión
      navigate('/dashboard');
    } catch (error) {
      console.error('Error de autenticación:', error);
      setError(error.message);
    }
  };

  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleSignIn}>
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p>Error: {error}</p>}
    </div>
  );
};

export default Auth;
