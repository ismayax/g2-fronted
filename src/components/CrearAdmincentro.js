import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, updateDoc, arrayUnion } from 'firebase/firestore';
import styles from '../assets/css/CrearAdmincentro.module.css'; // Asegúrate de que la importación sea correcta

const CrearAdmincentro = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [tipoSuscripcion, setTipoSuscripcion] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleCreateAdmincentro = async (event) => {
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
      const nuevoAdminRef = doc(db, 'admincentro', user.uid);
      await setDoc(nuevoAdminRef, {
        email,
        ciudad,
        rol: 'admin'
      });
      console.log("Admincentro data saved to Firestore");

      // Crear documento en 'centros_educativos'
      const nuevoCentroRef = doc(collection(db, 'centros_educativos'));
      await setDoc(nuevoCentroRef, {
        acepta_condiciones: true,
        centro_activo: true,
        ciudad,
        docente_id: [],
        mensajes_entrada: [],
        mensajes_enviados: [],
        suscripcion_id: tipoSuscripcion
      });
      console.log("Centro educativo data saved to Firestore");

      // Actualizar la colección de 'admincentro' con el nuevo centro ID
      await updateDoc(nuevoAdminRef, {
        centro_id: arrayUnion(nuevoCentroRef.id)
      });
      console.log("Admincentro updated with new centro ID");

      // Redirigir a la página de lista de admincentros o dashboard
      navigate('/superuser-dashboard');
    } catch (error) {
      console.error("Error creating admincentro:", error);
      setError(error.message);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Crear Nuevo Admincentro</h2>
      <form onSubmit={handleCreateAdmincentro} className={styles.form}>
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
        <div className={styles.formGroup}>
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            required
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="tipoSuscripcion">Tipo de Suscripción</label>
          <select
            id="tipoSuscripcion"
            value={tipoSuscripcion}
            onChange={(e) => setTipoSuscripcion(e.target.value)}
            required
          >
            <option value="">Seleccionar</option>
            <option value="normal">Normal</option>
            <option value="premium">Premium</option>
            <option value="suscripcionesbasica">Básica</option>
          </select>
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" className={styles.btnCreate}>Crear Admincentro</button>
      </form>
    </div>
  );
};

export default CrearAdmincentro;
