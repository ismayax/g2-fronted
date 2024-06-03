import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import styles from "../assets/css/Login.module.css";
import Logo from "../assets/img/Logo_educación.png";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('User signed in:', userCredential.user);
      
      const userId = userCredential.user.uid;

      // Obtener información adicional del usuario desde las colecciones en Firestore
      const adminCentroRef = doc(db, 'admincentro', userId);
      const adminCentroSnap = await getDoc(adminCentroRef);

      if (adminCentroSnap.exists()) {
        const adminCentroData = adminCentroSnap.data();
        console.log('AdminCentro data:', adminCentroData); // Agrega un log para depurar
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('centroId', adminCentroData.centro_id[0]);
        navigate('/admin-panel');
        return;
      }

      const docenteRef = doc(db, 'docentes', userId);
      const docenteSnap = await getDoc(docenteRef);

      if (docenteSnap.exists()) {
        const docenteData = docenteSnap.data();
        console.log('Docente data:', docenteData); // Agrega un log para depurar
        localStorage.setItem('userRole', 'docente');
        localStorage.setItem('centroId', docenteData.centro_id[0]);
        navigate('/Paginaprincipal');
        return;
      }

      throw new Error('User data not found. Please contact the administrator.');
    } catch (error) {
      setError(error.message);
      console.error("Error de autenticación:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles["logo-container"]}>
          <img src={Logo} alt="Logo" className={styles.logo} />
        </div>
        <form className={styles["login-form"]} onSubmit={handleLogin}>
          <div className={styles["form-group"]}>
            <label htmlFor="email" className={styles.label}>Correo electrónico:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Introduzca el correo electrónico"
              className={styles.input}
            />
          </div>
          <div className={styles["form-group"]}>
            <label htmlFor="password" className={styles.label}>Contraseña:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introduzca la contraseña"
              className={styles.input}
            />
          </div>
          <button type="submit" className={styles["btn-login"]}>Ingresar</button>
          {error && <div className={styles["error"]}>{error}</div>}
        </form>
        <div className={styles["register-link"]}>
          <p>¿No tienes cuenta?<Link to="/registro"> Regístrate aquí</Link></p>
          <p><Link to="/contrasena">Recuperar contraseña</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
