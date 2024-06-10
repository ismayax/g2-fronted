import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../assets/css/AdminPanel.module.css'; // Asegúrate de que la importación sea correcta

const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <h1>Configuración Centro Educativo</h1>
      <div className={styles.panelContainer}>
        <div className={styles.panelCard}>
          <Link to="/admin-docentes" className={styles.link}>
            <div className={styles.panelContent}>
              <h2>Ver Información Centro</h2>
            </div>
          </Link>
        </div>
        <div className={styles.panelCard}>
          <Link to="/ampliar-plan" className={styles.link}>
            <div className={styles.panelContent}>
              <h2>Ampliar Plan</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
