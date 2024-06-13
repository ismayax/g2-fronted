import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import styles from '../assets/css/Crearsupdo.module.css';
import GreenBackgroundLayout from './greenBackground';
import { useAuth } from '../screens/AuthContext'; // Importa el contexto de autenticación

const Crearsupdo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nivel, setNivel] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();
  const { user } = useAuth(); // Obtén el usuario autenticado desde el contexto

  const handleCreateDocente = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      console.log("Creando usuario...");
      // Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;

      console.log("Usuario creado:", newUser.uid);

      // Obtener el centro_id del administrador logueado
      const adminCentroRef = doc(db, 'admincentro', user.uid);
      const adminCentroSnap = await getDoc(adminCentroRef);

      if (!adminCentroSnap.exists()) {
        throw new Error("No se encontró el centro educativo asociado al administrador.");
      }

      const adminCentroData = adminCentroSnap.data();
      const centroId = adminCentroData.centro_id[0];

      console.log("Centro ID:", centroId);

      // Guardar los datos del nuevo docente
      const nuevoDocenteRef = doc(db, 'docentes', newUser.uid);
      await setDoc(nuevoDocenteRef, {
        nombre: username,
        email,
        nivel,
        activo: false,
        centro_id: [centroId]
      });

      console.log("Docente guardado en Firestore");

      // Actualizar la colección de 'centros_educativos' con el nuevo docente ID
      const centroEducativoRef = doc(db, 'centros_educativos', centroId);
      await updateDoc(centroEducativoRef, {
        docente_id: arrayUnion(newUser.uid)
      });

      console.log("Centro educativo actualizado con nuevo docente ID");

      navigate('/admin-docentes');
    } catch (error) {
      console.error("Error creando docente:", error);
      setError(error.message);
    }
  };

  return (
    <GreenBackgroundLayout>
      <button className={styles.backButton} onClick={() => navigate(-1)}>
        ← Atrás
      </button>
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
            <label htmlFor="nivel">Nivel</label>
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
    </GreenBackgroundLayout>
  );
};

export default Crearsupdo;
