import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Listaexperimentos from './components/Listaexperimentos';
import Login from './components/Login';
import Paginaprincipal from './components/Paginaprincipal';
import Secundaria from './components/Secundaria';
import Registro from './components/Registrarse';
import Contrasena from './components/OlvidoContra';
import DetalleExperimento from './components/DetalleExperimento';
import PlanesSuscripcion from './components/PlanesSuscripcion';
import Pago from './components/pago';
import Infantil from './components/infantil';
import Primaria from './components/Primaria';
import Experimento from './components/Experimentos';
import Politica from './components/politicas';
import Terminos from './components/terminos';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log('User logged in:', user);
      } else {
        console.log('No user logged in');
      }
      setUser(user);
      setLoading(false); // Cambia el estado de carga una vez se determina el estado de autenticación
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un indicador de carga
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/Paginaprincipal" /> : <Login />} />
      <Route path="/Paginaprincipal" element={<Paginaprincipal userId={user ? user.uid : null} />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Primaria" element={<Primaria />} />
      <Route path="/Listaexperimentos/infantil/:grupo" element={<Listaexperimentos />} />
      <Route path="/Listaexperimentos/primaria/:grupo" element={<Listaexperimentos />} />
      <Route path="/Listaexperimentos/secundaria/:grupo" element={<Listaexperimentos />} />
      <Route path="/experimento/:id" element={<Experimento />} />
      <Route path="/Infantil" element={<Infantil />} />
      <Route path="/secundaria" element={<Secundaria />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/contrasena" element={<Contrasena />} />
      <Route path="/actividades/:id" element={<DetalleExperimento />} />
      <Route path="/suscripcion" element={<PlanesSuscripcion />} />
      <Route path="/pago" element={<Pago />} />
      <Route path="/Politica" element={<Politica />} />
      <Route path="/Terminos" element={<Terminos />} />
    </Routes>
  );
}

export default App;
