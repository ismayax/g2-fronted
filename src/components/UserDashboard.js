import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from "../assets/css/UserDashboard.module.css"; // Asegúrate de crear y configurar este archivo CSS
import galileoImage from '../assets/img/galileo3.png'; // Importa la imagen de fondo

const auth = getAuth();
const db = getFirestore();

const UserDashboard = () => {
  const [activities, setActivities] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchActivities = async () => {
      if (user) {
        const activitiesRef = collection(db, 'activities');
        const q = query(activitiesRef, where('assignedTo', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const activitiesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setActivities(activitiesList);
      }
    };

    fetchActivities();
  }, [user]);

  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.header}>
        <h1>Dashboard del Usuario</h1>
        <p>Bienvenido, {user?.email}!</p>
      </div>
      <div className={styles.activitiesContainer}>
        <h2>Actividades Asignadas</h2>
        {activities.length > 0 ? (
          <ul className={styles.activityList}>
            {activities.map(activity => (
              <li key={activity.id} className={styles.activityItem}>
                <h3>{activity.title}</h3>
                <p>{activity.description}</p>
                <Link to={`/activity/${activity.id}`} className={styles.button}>Ver Detalles</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tienes actividades asignadas.</p>
        )}
      </div>
      <img src={galileoImage} alt="Galileo" className={styles.galileoImage} />
    </div>
  );
};

export default UserDashboard;
