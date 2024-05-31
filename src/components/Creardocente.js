import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import styles from '../assets/css/CrearDocente.module.css'; // Estilos CSS para el formulario

const CrearDocente = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nivel, setNivel] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newDocente = {
        email,
        nivel,
        activo: false,
        uid: userCredential.user.uid,
      };
      await addDoc(collection(db, 'docentes'), newDocente);
      navigate('/centro-dashboard');
    } catch (error) {
      console.error('Error creando docente:', error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2>Crear Nuevo Docente</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Confirmar Contraseña"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className={styles.input}
        />
        <select
          value={nivel}
          onChange={(e) => setNivel(e.target.value)}
          required
          className={styles.select}
        >
          <option value="" disabled>Seleccione un nivel</option>
          <option value="infantil">Infantil</option>
          <option value="primaria">Primaria</option>
          <option value="secundaria">Secundaria</option>
        </select>
        <button type="submit" className={styles.button}>Crear Docente</button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

export default CrearDocente;
