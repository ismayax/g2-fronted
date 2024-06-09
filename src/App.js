import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { AuthProvider, useAuth } from './screens/AuthContext';  // Ajusta la ruta si es necesario
import Listaexperimentos from './components/Listaexperimentos';
import Login from './components/Login';
import Paginaprincipal from './components/Paginaprincipal';
import Secundaria from './components/Secundaria';
import Registro from './components/Registrarse';
import Contrasena from './components/OlvidoContra';
import DetalleExperimento from './components/DetalleExperimento';
import PlanesSuscripcion from './components/PlanesSuscripcion';
import Pago from './components/pago';
import AdminAmpliarPlan from './screens/AmpliarPlan';
import Infantil from './components/infantil';
import Primaria from './components/Primaria';
import Experimento from './components/Experimentos';
import Politica from './components/politicas';
import Terminos from './components/terminos';
import Contactenos from './components/Contactenos';
import SuperuserDashboard from './components/SuperuserDashboard';
import UserDashboard from './components/UserDashboard';
import AdminPanel from './screens/adminpanel';
import CentroDashboard from './components/Actudocentes';
import CrearDocente from './components/Creardocente';
import Crearsupdo from './components/crearsupdo'; // Añade esta línea
import AdminDocentes from './screens/AdminDocentes';
import PrivateRoute from './screens/Rutas'; // Ajustar la importación del componente PrivateRoute

function App() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        user.customClaims = idTokenResult.claims;
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, [setUser]);

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/Paginaprincipal" /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/Paginaprincipal" element={<Paginaprincipal userId={user?.uid} />} />
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
      <Route path="/crearsupdo" element={<Crearsupdo />} /> {/* Añade esta línea */}

      {/* Private Routes */}
      <Route element={<PrivateRoute role="super" />}>
        <Route path="/superuser-dashboard" element={<SuperuserDashboard />} />
        <Route path="/crearsupdo" element={<Crearsupdo />} /> {/* Añade esta línea */}
      </Route>

      <Route element={<PrivateRoute role="admin" />}>
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/admin-docentes" element={<AdminDocentes />} />
        <Route path="/ampliar-plan" element={<AdminAmpliarPlan />} />
      </Route>

      <Route element={<PrivateRoute role="user" />}>
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
