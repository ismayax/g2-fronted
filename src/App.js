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
import Contactenos from './components/Contactenos';
import SuperuserDashboard from './components/SuperuserDashboard';
import UserDashboard from './components/UserDashboard';
import PrivateRoute from './PrivateRoute'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false); // Nuevo estado

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={!hasInteracted ? <Navigate to="/login" /> : (user ? <Navigate to="/Paginaprincipal" /> : <Login setHasInteracted={setHasInteracted} />)} />
        <Route path="/login" element={<Login setHasInteracted={setHasInteracted} />} />
        <Route element={<PrivateRoute allowedRoles={['admin', 'docente', 'usuario']} />}>
          <Route path="/Paginaprincipal" element={<Paginaprincipal userId={user ? user.uid : null} />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['admin', 'docente']} />}>
          <Route path="/Primaria" element={<Primaria />} />
          <Route path="/Infantil" element={<Infantil />} />
          <Route path="/secundaria" element={<Secundaria />} />
        </Route>
        <Route path="/Listaexperimentos/infantil/:grupo" element={<Listaexperimentos />} />
        <Route path="/Listaexperimentos/primaria/:grupo" element={<Listaexperimentos />} />
        <Route path="/Listaexperimentos/secundaria/:grupo" element={<Listaexperimentos />} />
        <Route path="/experimento/:id" element={<Experimento />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/contrasena" element={<Contrasena />} />
        <Route path="/actividades/:id" element={<DetalleExperimento />} />
        <Route path="/suscripcion" element={<PlanesSuscripcion />} />
        <Route path="/pago" element={<Pago />} />
        <Route path="/Politica" element={<Politica />} />
        <Route path="/Terminos" element={<Terminos />} />
        <Route path="/Contactenos" element={<Contactenos />} />
        <Route element={<PrivateRoute allowedRoles={['admin']} />}>
          <Route path="/superuser-dashboard" element={<SuperuserDashboard />} />
        </Route>
        <Route element={<PrivateRoute allowedRoles={['usuario']} />}>
          <Route path="/user-dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
