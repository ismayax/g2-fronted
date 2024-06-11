import React, { useState } from "react";
import "../assets/css/Registro.css";
import { useNavigate } from "react-router-dom";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmacion, setConfirmacion] = useState("");
  const navigate = useNavigate(); // Instancia de useNavigate

  const handleRegistro = async (event) => {
    event.preventDefault();

    if (contrasena !== confirmacion) {
      alert("Las contraseñas no coinciden");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, correo, contrasena);
      const userId = userCredential.user.uid;

      const db = getFirestore();
      await setDoc(doc(db, "usuarios", userId), {
        nombre: nombre,
        correo: correo,
      });

      setNombre("");
      setCorreo("");
      setContrasena("");
      setConfirmacion("");

      alert("Registro exitoso. Ahora puedes iniciar sesión con tu correo electrónico y contraseña.");
      navigate("/suscripcion");
    } catch (error) {
      console.error("Error al crear usuario:", error.message);
      alert("Error al crear usuario. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="container">
      <section className="form-register">
        <h1>Crear Nuevo Docente</h1>
        <form onSubmit={handleRegistro}>
          <label htmlFor="nombre">Nombre usuario</label>
          <input
            className="controls"
            type="text"
            name="nombres"
            id="nombres"
            placeholder="Ingrese su Nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
          <label htmlFor="correo">Correo electrónico</label>
          <input
            className="controls"
            type="email"
            name="correos"
            id="correo"
            placeholder="Ingrese su Correo"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <label htmlFor="pais">Pais</label>
          <select className="controls">
            <option value="es">España</option>
          </select>
          <label htmlFor="ciudad">Ciudad</label>
          <select className="controls">
            <option value="sv">Sevilla</option>
          </select>
          <label htmlFor="contraseña">Contraseña</label>
          <input
            className="controls"
            type="password"
            name="contrasena"
            id="contrasena"
            placeholder="Ingrese su Contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <label htmlFor="repetir">Confirme contraseña</label>
          <input
            className="controls"
            type="password"
            name="confirmacion"
            id="confirmacion"
            placeholder="Confirme la contraseña"
            value={confirmacion}
            onChange={(e) => setConfirmacion(e.target.value)}
            required
          />
          <p>
            Estoy de acuerdo con <a href="#">términos y condiciones</a>
          </p>
          <button type="submit" className="boton">Registrar</button>
        </form>
        <p className="login-link">
          <a href="/login">¿Ya tienes cuenta?</a>
        </p>
      </section>
    </div>
  );
};

export default Registro;
