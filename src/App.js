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
import AdminPanel from './components/AdminPanel'; 
import PrivateRoute from './PrivateRoute'; 
import { AuthProvider, useAuth } from './contexts/AuthContext';
import CentroDashboard from './components/CentroDashboard';
import CrearDocente from './components/Creardocente';

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

  const userRole = localStorage.getItem('userRole');
  const centroId = localStorage.getItem('centroId');

  return (
    <AuthProvider value={{ user, setUser }}>
      <Routes>
        <Route path="/" element={!hasInteracted ? <Navigate to="/login" /> : (user ? <Navigate to={userRole === 'admin' ? `/centro-dashboard?centroId=${centroId}` : (userRole === 'docente' ? '/docente-dashboard' : '/home')} /> : <Login setHasInteracted={setHasInteracted} />)} />
        <Route path="/Paginaprincipal" element={<Paginaprincipal userId={user ? user.uid : null} />} />
        <Route path="/login" element={<Login setHasInteracted={setHasInteracted} />} />
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
        <Route path="/centro-dashboard" element={<CentroDashboard />} />
        <Route path="/crear-docente" element={<CrearDocente />} />
        <Route path="/Politica" element={<Politica />} />
        <Route path="/Terminos" element={<Terminos />} />
        <Route path="/Contactenos" element={<Contactenos />} />
        <Route path="/superuser-dashboard" element={
          <PrivateRoute role="admin">
            <SuperuserDashboard />
          </PrivateRoute>
        } />
        <Route path="/user-dashboard" element={
          <PrivateRoute role="user">
            <UserDashboard />
          </PrivateRoute>
        } />
        <Route path="/admin-panel" element={
          <PrivateRoute role="admin">
            <AdminPanel />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  );
}

export default App;
