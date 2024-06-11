import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asumiendo que tienes un contexto de autenticación configurado
import styles from '../assets/css/AdminDocentes.module.css';

const AdminDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [limiteDocentes, setLimiteDocentes] = useState(0);
  const db = getFirestore();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminCentro = async () => {
      if (!user) {
        console.log('User is not authenticated.');
        return;
      }

      try {
        const adminCentroRef = doc(db, 'admincentro', user.uid);
        const adminCentroSnap = await getDoc(adminCentroRef);

        if (!adminCentroSnap.exists()) {
          console.log('No admincentro data found for user:', user.uid);
          return;
        }

        const adminCentroData = adminCentroSnap.data();
        const centroId = adminCentroData.centro_id[0];

        const centroRef = doc(db, 'centros_educativos', centroId);
        const centroSnap = await getDoc(centroRef);

        if (!centroSnap.exists()) {
          console.log('No centro_educativo data found for centroId:', centroId);
          return;
        }

        const centroData = centroSnap.data();
        const suscripcionId = centroData.suscripcion_id;

        const suscripcionRef = doc(db, 'suscripciones', suscripcionId);
        const suscripcionSnap = await getDoc(suscripcionRef);

        if (!suscripcionSnap.exists()) {
          console.log('No suscripcion data found for suscripcion:', suscripcionId);
          return;
        }

        const suscripcionData = suscripcionSnap.data();
        setLimiteDocentes(suscripcionData.num_docentes);

        const docentesList = [];
        for (const docenteId of centroData.docente_id) {
          const docenteRef = doc(db, 'docentes', docenteId);
          const docenteSnap = await getDoc(docenteRef);
          if (docenteSnap.exists()) {
            docentesList.push({ id: docenteSnap.id, ...docenteSnap.data() });
          }
        }
        setDocentes(docentesList);
      } catch (error) {
        console.error('Error fetching admin centro:', error);
      }
    };

    fetchAdminCentro();
  }, [db, user]);

  const handleActivateDocente = async (docenteId, isActive) => {
    if (isActive) {
      const activeDocentes = docentes.filter(docente => docente.activo).length;
      if (activeDocentes >= limiteDocentes) {
        alert(`No puedes activar más docentes. Límite de ${limiteDocentes} alcanzado según el plan de suscripción.`);
        return;
      }
    }

    try {
      const docenteRef = doc(db, 'docentes', docenteId);
      await updateDoc(docenteRef, { activo: isActive });
      setDocentes(docentes.map(doc => (doc.id === docenteId ? { ...doc, activo: isActive } : doc)));
    } catch (error) {
      console.error('Error updating docente:', error);
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>&larr;</button>
        <h1>Información Centro</h1>
      </div>
      <div className={styles.content}>
        <h2>Usuarios Docentes</h2>
        <hr className={styles.separator} />
        <div className={styles.docentesList}>
          {docentes.map(docente => (
            <div key={docente.id} className={styles.docenteItem}>
              <div className={styles.docenteInfo}>
                <p><strong>{docente.nombre}</strong></p>
                <p>{docente.email}</p>
                <p>{docente.nivel}</p>
              </div>
              <div className={styles.docenteActions}>
                <label className={styles.switch}>
                  <input
                    type="checkbox"
                    checked={docente.activo}
                    onChange={() => handleActivateDocente(docente.id, !docente.activo)}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>
            </div>
          ))}
        </div>
        <p className={styles.limite}>Límite según plan: <span className={styles.limiteNumero}>{docentes.filter(doc => doc.activo).length}/{limiteDocentes}</span></p>
        <Link to="/crear-docente" className={styles.crearButton}>Crear nuevo Usuario</Link>
      </div>
    </div>
  );
};

export default AdminDocentes;