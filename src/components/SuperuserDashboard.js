import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import styles from "../assets/css/SuperuserDashboard.module.css"; 

const auth = getAuth();
const db = getFirestore();

const SuperuserDashboard = () => {
  const [docentes, setDocentes] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [nivel, setNivel] = useState('');
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
  }, []);

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const userRef = doc(db, 'docentes', selectedUser.id);
        await updateDoc(userRef, { nivel });
        setDocentes(docentes.map(user => (user.id === selectedUser.id ? { ...user, nivel } : user)));
        setSelectedUser(null);
        setNivel('');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Superuser Dashboard</h1>

      <div className={styles.section}>
        <h2>Lista de Docentes</h2>
        <ul className={styles.userList}>
          {docentes.map(user => (
            <li key={user.id} className={styles.userItem}>
              <p>Email: {user.email}</p>
              <p>Nivel: {user.nivel}</p>
              <button onClick={() => setSelectedUser(user)} className={styles.button}>Editar</button>
            </li>
          ))}
        </ul>
        {selectedUser && (
          <form onSubmit={handleUpdateUser} className={styles.form}>
            <h3>Editar Docente: {selectedUser.email}</h3>
            <select value={nivel} onChange={(e) => setNivel(e.target.value)} required className={styles.select}>
              <option value="" disabled>Seleccione un nivel</option>
              <option value="infantil">Infantil</option>
              <option value="primaria">Primaria</option>
              <option value="secundaria">Secundaria</option>
            </select>
            <button type="submit" className={styles.button}>Actualizar Nivel</button>
          </form>
        )}
        <button className={styles.button} onClick={() => navigate('/crearsupdo')}>Crear Docente</button>
      </div>

      <div className={styles.section}>
        <h2>Lista de Administradores de Centros</h2>
        <ul className={styles.userList}>
          {admins.map(user => (
            <li key={user.id} className={styles.userItem}>
              <p>Email: {user.email}</p>
              <p>Centro: {user.centro_id}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SuperuserDashboard;
