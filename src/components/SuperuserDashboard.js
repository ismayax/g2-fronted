import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteUser, signOut } from 'firebase/auth';
import { getFirestore, collection, getDocs, doc, updateDoc, getDoc, deleteDoc, setDoc } from 'firebase/firestore';
import styles from "../assets/css/SuperuserDashboard.module.css";

const db = getFirestore();
const auth = getAuth();

const SuperuserDashboard = () => {
  const [docentes, setDocentes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [centros, setCentros] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [niveles, setNiveles] = useState([]);
  const [selectedNiveles, setSelectedNiveles] = useState([]);
  const [suscripcion, setSuscripcion] = useState('');
  const [showDetails, setShowDetails] = useState({});
  const [showAdminDetails, setShowAdminDetails] = useState({});
  const navigate = useNavigate();

  const nivelesCursos = [
    'infantil',
    'primaria',
    'secundaria',
  ];

  const rutasSuscripciones = [
    'normal',
    'premium',
    'suscripcionesbasica',
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const docentesSnapshot = await getDocs(collection(db, 'docentes'));
      const docentesList = docentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocentes(docentesList);

      const adminsSnapshot = await getDocs(collection(db, 'admincentro'));
      const adminsList = adminsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsList);

      const nivelesSnapshot = await getDocs(collection(db, 'actividades'));
      const nivelesList = nivelesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNiveles(nivelesList);

      const centrosData = {};
      for (const admin of adminsList) {
        if (admin.centro_id && admin.centro_id.length > 0) {
          const centroId = admin.centro_id[0];
          const centroDoc = await getDoc(doc(db, 'centros_educativos', centroId));
          if (centroDoc.exists()) {
            centrosData[centroId] = { id: centroId, ...centroDoc.data() };
          }
        }
      }
      setCentros(centrosData);
    };
    fetchUsers();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const userRef = doc(db, 'docentes', selectedUser.id);
        await updateDoc(userRef, { niveles: selectedNiveles.map(nivel => `actividades/${nivel}`) });
        setDocentes(docentes.map(user => (user.id === selectedUser.id ? { ...user, niveles: selectedNiveles } : user)));
        setSelectedUser(null);
        setSelectedNiveles([]);
        setShowDetails({ ...showDetails, [selectedUser.id]: false });
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleUpdateAdmin = async (e) => {
    e.preventDefault();
    if (selectedAdmin) {
      try {
        const centroId = selectedAdmin.centro_id[0];
        const centroRef = doc(db, 'centros_educativos', centroId);

        const docSnapshot = await getDoc(centroRef);
        if (docSnapshot.exists()) {
          await updateDoc(centroRef, { suscripcion_id: [suscripcion.replace('suscripciones/', '')] });
        } else {
          await setDoc(centroRef, { suscripcion_id: [suscripcion.replace('suscripciones/', '')] });
        }

        setCentros({
          ...centros,
          [centroId]: {
            ...centros[centroId],
            suscripcion_id: [suscripcion.replace('suscripciones/', '')]
          }
        });

        setSelectedAdmin(null);
        setSuscripcion('');
        setShowAdminDetails({ ...showAdminDetails, [selectedAdmin.id]: false });
      } catch (error) {
        console.error('Error updating admin:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const userDoc = doc(db, 'docentes', userId);
      await deleteDoc(userDoc);

      const user = await auth.getUser(userId);
      await deleteUser(user);

      setDocentes(docentes.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      const admin = admins.find(admin => admin.id === adminId);
      const centroId = admin && admin.centro_id && admin.centro_id[0];
      if (centroId) {
        await deleteDoc(doc(db, 'admincentro', adminId));
        await deleteDoc(doc(db, 'centros_educativos', centroId));

        // Obtener el usuario administrador para eliminarlo de Firebase Authentication
        const userToDelete = await auth.getUser(adminId);
        if (userToDelete && userToDelete.uid !== auth.currentUser.uid) {
          await deleteUser(userToDelete);
        }

        setAdmins(admins.filter(admin => admin.id !== adminId));
        const updatedCentros = { ...centros };
        delete updatedCentros[centroId];
        setCentros(updatedCentros);
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const toggleDetails = (userId) => {
    const user = docentes.find(user => user.id === userId);
    setShowDetails(prevState => ({ ...prevState, [userId]: !prevState[userId] }));
    setSelectedUser(user);
    setSelectedNiveles(user && user.niveles ? user.niveles.map(nivel => nivel.replace('actividades/', '')) : []);
  };

  const toggleAdminDetails = (adminId) => {
    const admin = admins.find(admin => admin.id === adminId);
    const centroId = admin && admin.centro_id && admin.centro_id[0];
    const centro = centros[centroId];
    setShowAdminDetails(prevState => ({ ...prevState, [adminId]: !prevState[adminId] }));
    setSelectedAdmin(admin);
    setSuscripcion(centro && centro.suscripcion_id ? centro.suscripcion_id[0] : '');
  };

  const handleNivelChange = (nivelId) => {
    if (selectedNiveles.includes(nivelId)) {
      setSelectedNiveles(selectedNiveles.filter(id => id !== nivelId));
    } else {
      setSelectedNiveles([...selectedNiveles, nivelId]);
    }
  };

  const formatSuscripcionName = (suscripcion) => {
    return suscripcion ? suscripcion.replace('suscripciones/', '') : '';
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Centro Control</h1>
      <button className={styles.logoutButton} onClick={handleLogout}>Cerrar Sesión</button>

      <div className={styles.columns}>
        <div className={styles.column}>
          <h2>Lista de Docentes</h2>
          <ul className={styles.userList}>
            {docentes.map(user => (
              <li key={user.id} className={styles.userItem}>
                <div className={styles.userHeader}>
                  <p>Email: {user.email}</p>
                  <button onClick={() => toggleDetails(user.id)} className={styles.button}>Editar</button>
                </div>
                {showDetails[user.id] && (
                  <div className={styles.userDetails}>
                    <p>Nombre: {user.nombre}</p>
                    <p>Niveles:</p>
                    <ul>
                      {nivelesCursos.map(nivel => (
                        <li key={nivel}>
                          <label>
                            <input
                              type="checkbox"
                              value={nivel}
                              checked={selectedNiveles.includes(nivel)}
                              onChange={() => handleNivelChange(nivel)}
                            />
                            {nivel}
                          </label>
                        </li>
                      ))}
                    </ul>
                    <form onSubmit={handleUpdateUser} className={styles.form}>
                      <button type="submit" className={styles.button}>Confirmar Cambio</button>
                    </form>
                    <button onClick={() => handleDeleteUser(user.id)} className={styles.deleteButton}>Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button className={`${styles.button} ${styles.bottomButton}`} onClick={() => navigate('/crearsupdo')}>Crear Docente</button>
        </div>

        <div className={styles.column}>
          <h2>Lista de Administradores de Centros</h2>
          <ul className={styles.userList}>
            {admins.map(admin => (
              <li key={admin.id} className={styles.userItem}>
                <div className={styles.userHeader}>
                  <p>Email: {admin.email}</p>
                  <p>Centro ID: {admin.centro_id ? admin.centro_id[0] : 'N/A'}</p>
                  <p>Suscripción: {formatSuscripcionName(centros[admin.centro_id?.[0]]?.suscripcion_id?.[0])}</p>
                  <button onClick={() => toggleAdminDetails(admin.id)} className={styles.button}>Editar</button>
                </div>
                {showAdminDetails[admin.id] && (
                  <div className={styles.userDetails}>
                    <p>Centro: {admin.centro_id ? admin.centro_id[0] : 'N/A'}</p>
                    <form onSubmit={handleUpdateAdmin} className={styles.form}>
                      <ul>
                        {rutasSuscripciones.map(ruta => (
                          <li key={ruta}>
                            <label>
                              <input
                                type="radio"
                                name="suscripcion"
                                value={ruta}
                                checked={suscripcion === ruta}
                                onChange={(e) => setSuscripcion(e.target.value)}
                              />
                              {formatSuscripcionName(ruta)}
                            </label>
                          </li>
                        ))}
                      </ul>
                      <button type="submit" className={styles.button}>Confirmar Cambio</button>
                    </form>
                    <button onClick={() => handleDeleteAdmin(admin.id)} className={styles.deleteButton}>Eliminar</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
          <button className={`${styles.button} ${styles.bottomButton}`} onClick={() => navigate('/crear-admincentro')}>Crear Admincentro</button>
        </div>
      </div>
    </div>
  );
};

export default SuperuserDashboard;
