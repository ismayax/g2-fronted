import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import styles from '../assets/css/CrearDocente.module.css';

const CrearDocente = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nivel, setNivel] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const centroId = "3adfUcs5KnxpgMK29TU9"; // Ajusta esto según sea necesario

  const handleCreateDocente = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar datos adicionales del usuario en Firestore
      const nuevoDocenteRef = doc(db, 'docentes', user.uid);
      await setDoc(nuevoDocenteRef, {
        username,
        email,
        nivel,
        activo: false, // Por defecto, el docente no está activo
        centro_id: centroId // Ajusta esto según sea necesario
      });

      // Actualizar la colección de 'centros_educativos' con el nuevo docente ID
      const centroEducativoRef = doc(db, 'centros_educativos', centroId);
      await updateDoc(centroEducativoRef, {
        docente_id: arrayUnion(user.uid)
      });

      // Redirigir a la página de lista de docentes o dashboard
      navigate('/admin-docentes');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Crear Nuevo Docente</h2>
      <form onSubmit={handleCreateDocente} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="username">Nombre de usuario</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email">Correo electrónico</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="nivel">Etapa y Ciclo Adjunto</label>
          <select
            id="nivel"
            value={nivel}
            onChange={(e) => setNivel(e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            <option value="infantil">Infantil</option>
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password">Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="repeatPassword">Repita la contraseña</label>
          <input
            type="password"
            id="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btnCreate}>Crear Docente</button>
      </form>
    </div>
  );
};

export default CrearDocente;
