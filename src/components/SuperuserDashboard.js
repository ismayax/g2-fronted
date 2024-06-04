import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, doc, setDoc } from 'firebase/firestore';
import styles from "../assets/css/SuperuserDashboard.module.css"; 

const auth = getAuth();
const db = getFirestore();

const SuperuserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [cycle, setCycle] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const usersSnapshot = await getDocs(usersCollection);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid; // Generate UID

      const newUser = {
        email,
        role,
        cycle,
        uid: uid,
      };

      // Store the new admin information in Firestore
      const userDocRef = doc(db, 'users', uid);
      await setDoc(userDocRef, newUser);

      setUsers([...users, newUser]);
      setEmail('');
      setPassword('');
      setRole('');
      setCycle('');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (selectedUser) {
      try {
        const userRef = doc(db, 'users', selectedUser.id);
        await updateDoc(userRef, { role, cycle });
        setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, role, cycle } : user)));
        setSelectedUser(null);
        setRole('');
        setCycle('');
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Superuser Dashboard</h1>

      <div className={styles.section}>
        <h2>Crear nuevo usuario</h2>
        <form onSubmit={handleCreateUser} className={styles.form}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} required className={styles.select}>
            <option value="" disabled>Seleccione un rol</option>
            <option value="superuser">Superusuario</option>
            <option value="admin">Administrador</option> {/* Añadir rol de administrador */}
            <option value="user">Usuario</option>
          </select>
          <input
            type="text"
            placeholder="Ciclo"
            value={cycle}
            onChange={(e) => setCycle(e.target.value)}
            className={styles.input}
          />
          <button type="submit" className={styles.button}>Crear Usuario</button>
        </form>
      </div>

      <div className={styles.section}>
        <h2>Lista de usuarios</h2>
        <ul className={styles.userList}>
          {users.map(user => (
            <li key={user.id} className={styles.userItem}>
              <p>Email: {user.email}</p>
              <p>Rol: {user.role}</p>
              <p>Ciclo: {user.cycle}</p>
              <button onClick={() => setSelectedUser(user)} className={styles.button}>Editar</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedUser && (
        <div className={styles.section}>
          <h2>Actualizar usuario</h2>
          <form onSubmit={handleUpdateUser} className={styles.form}>
            <p>Editar usuario: {selectedUser.email}</p>
            <select value={role} onChange={(e) => setRole(e.target.value)} required className={styles.select}>
              <option value="" disabled>Seleccione un rol</option>
              <option value="superuser">Superusuario</option>
              <option value="admin">Administrador</option> {/* Añadir rol de administrador */}
              <option value="user">Usuario</option>
            </select>
            <input
              type="text"
              placeholder="Ciclo"
              value={cycle}
              onChange={(e) => setCycle(e.target.value)}
              className={styles.input}
            />
            <button type="submit" className={styles.button}>Actualizar Usuario</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SuperuserDashboard;
