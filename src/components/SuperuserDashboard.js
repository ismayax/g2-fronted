import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFirestore, collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import styles from "../assets/css/SuperuserDashboard.module.css"; 

const db = getFirestore();

const SuperuserDashboard = () => {
  const [docentes, setDocentes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [niveles, setNiveles] = useState([]);
  const [selectedNiveles, setSelectedNiveles] = useState([]);
  const [subscription, setSubscription] = useState('');
  const [showDetails, setShowDetails] = useState({});
  const [showAdminDetails, setShowAdminDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      const docentesSnapshot = await getDocs(collection(db, 'docentes'));
      const docentesList = docentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocentes(docentesList);

      const adminsSnapshot = await getDocs(collection(db, 'admincentro'));
      const adminsList = adminsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setAdmins(adminsList);
    };
    fetchUsers();
    
    const fetchNiveles = async () => {
      const nivelesSnapshot = await getDocs(collection(db, 'actividades'));
      const nivelesList = nivelesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNiveles(nivelesList);
    };
    fetchNiveles();
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const userRef = doc(db, 'docentes', selectedUser.id);
        await updateDoc(userRef, { niveles: selectedNiveles });
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
        const adminRef = doc(db, 'admincentro', selectedAdmin.id);
        const centroRef = doc(db, 'centros_educativos', selectedAdmin.id);
        await updateDoc(centroRef, { suscripcion_id: subscription });
        setAdmins(admins.map(admin => (admin.id === selectedAdmin.id ? { ...admin, suscripcion_id: subscription } : admin)));
        setSelectedAdmin(null);
        setSubscription('');
        setShowAdminDetails({ ...showAdminDetails, [selectedAdmin.id]: false });
      } catch (error) {
        console.error('Error updating admin:', error);
      }
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'docentes', userId));
      setDocentes(docentes.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await deleteDoc(doc(db, 'admincentro', adminId));
      await deleteDoc(doc(db, 'centros_educativos', adminId));
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error('Error deleting admin:', error);
    }
  };

  const toggleDetails = (userId) => {
    const user = docentes.find(user => user.id === userId);
    setShowDetails(prevState => ({ ...prevState, [userId]: !prevState[userId] }));
    setSelectedUser(user);
    setSelectedNiveles(user ? user.niveles : []);
  };

  const toggleAdminDetails = (adminId) => {
    const admin = admins.find(admin => admin.id === adminId);
    setShowAdminDetails(prevState => ({ ...prevState, [adminId]: !prevState[adminId] }));
    setSelectedAdmin(admin);
    setSubscription(admin ? admin.suscripcion_id : '');
  };

  const handleNivelChange = (nivelId) => {
    if (selectedNiveles.includes(nivelId)) {
      setSelectedNiveles(selectedNiveles.filter(id => id !== nivelId));
    } else {
      setSelectedNiveles([...selectedNiveles, nivelId]);
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Centro Control</h1>

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
                      {niveles.map(nivel => (
                        <li key={nivel.id}>
                          <label>
                            <input
                              type="checkbox"
                              value={nivel.id}
                              checked={selectedNiveles.includes(nivel.id)}
                              onChange={() => handleNivelChange(nivel.id)}
                            />
                            {nivel.nombre}
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
                  <button onClick={() => toggleAdminDetails(admin.id)} className={styles.button}>Editar</button>
                </div>
                {showAdminDetails[admin.id] && (
                  <div className={styles.userDetails}>
                    <p>Centro: {admin.centro_id}</p>
                    <form onSubmit={handleUpdateAdmin} className={styles.form}>
                      <select value={subscription} onChange={(e) => setSubscription(e.target.value)} required className={styles.select}>
                        <option value="" disabled>Seleccione un plan</option>
                        <option value="suscripciones/normal">Normal</option>
                        <option value="suscripciones/premium">Premium</option>
                        <option value="suscripciones/suscripcionesbasica">Básica</option>
                      </select>
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
