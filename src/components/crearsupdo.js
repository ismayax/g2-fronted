import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, setDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import styles from '../assets/css/Crearsupdo.module.css'; // Asegúrate de que la importación sea correcta

const Crearsupdo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [username, setUsername] = useState("");
  const [nivel, setNivel] = useState("");
  const [centros, setCentros] = useState([]);
  const [selectedCentro, setSelectedCentro] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const fetchCentros = async () => {
      const centrosSnapshot = await getDocs(collection(db, 'centros_educativos'));
      const centrosList = centrosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCentros(centrosList);
    };
    fetchCentros();
  }, []);

  const handleCreateDocente = async (event) => {
    event.preventDefault();
    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      console.log("Creating user with email and password...");
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("User created:", user.uid);

      // Guardar datos adicionales del usuario en Firestore
      console.log("Saving user data to Firestore...");
      const nuevoDocenteRef = doc(db, 'docentes', user.uid);
      await setDoc(nuevoDocenteRef, {
        nombre: username,
        email,
        nivel,
        activo: false, // Por defecto, el docente no está activo
        centro_id: [selectedCentro] // Centro seleccionado
      });
      console.log("User data saved to Firestore");

      // Actualizar la colección de 'centros_educativos' con el nuevo docente ID
      console.log("Updating centro_educativo with new docente ID...");
      const centroEducativoRef = doc(db, 'centros_educativos', selectedCentro);
      await updateDoc(centroEducativoRef, {
        docente_id: arrayUnion(user.uid)
      });
      console.log("Centro_educativo updated");

      // Redirigir a la página de lista de docentes o dashboard
      navigate('/superuser-dashboard');
    } catch (error) {
      console.error("Error creating docente:", error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.dashboard}>
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
          <label htmlFor="centro">Centro Educativo</label>
          <select
            id="centro"
            value={selectedCentro}
            onChange={(e) => setSelectedCentro(e.target.value)}
            required
          >
            <option value="">Seleccionar Centro</option>
            {centros.map(centro => (
              <option key={centro.id} value={centro.id}>{centro.nombre}</option>
            ))}
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
    </div>
  );
};

export default Crearsupdo;
