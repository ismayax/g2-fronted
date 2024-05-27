import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { app as firebaseApp } from "../components/firebaseConfig";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

function Roles() {
  const [isRegistrando, setIsRegistrando] = useState(false);
  const [error, setError] = useState("");

  async function handleUserRegistration(auth, email, password, role, centerId) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Guardar la información adicional del usuario en Firestore
      await setDoc(doc(db, "users", user.uid), {
        email,
        role,
        centerId,
      });

      console.log("Usuario registrado:", email);
    } catch (error) {
      setError(error.message);
      console.error("Error en el registro:", error);
    }
  }

  async function handleUserLogin(auth, email, password) {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Usuario autenticado:", email);
    } catch (error) {
      setError(error.message);
      console.error("Error en la autenticación:", error);
    }
  }

  function submitHandler(e) {
    e.preventDefault();

    const email = e.target.elements.email.value;
    const password = e.target.elements.password.value;
    const role = e.target.elements.rol.value;
    const centerId = e.target.elements.centerId.value; // Nuevo campo para el ID del centro

    if (isRegistrando) {
      handleUserRegistration(auth, email, password, role, centerId);
    } else {
      handleUserLogin(auth, email, password);
    }

    console.log("Submit:", email, password, role, centerId);
  }

  return (
    <div>
      <h1>{isRegistrando ? "Regístrate" : "Inicia sesión"}</h1>
      <form onSubmit={submitHandler}>
        <label>
          Correo electrónico:
          <input type="email" id="email" required />
        </label>
        <label>
          Contraseña:
          <input type="password" id="password" required />
        </label>
        {isRegistrando && (
          <>
            <label>
              Rol:
              <select id="rol" required>
                <option value="admin">Administrador</option>
                <option value="docente">Docente</option>
                <option value="usuario">Usuario</option>
              </select>
            </label>
            <label>
              ID del centro:
              <input type="text" id="centerId" required />
            </label>
          </>
        )}
        <input type="submit" value={isRegistrando ? "Registrar" : "Iniciar sesión"} />
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={() => setIsRegistrando(!isRegistrando)}>
        {isRegistrando ? "Ya tengo cuenta" : "Quiero registrarme"}
      </button>
    </div>
  );
}

export default Roles;
