import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc, getDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Asumiendo que tienes un contexto de autenticación configurado
import styles from '../assets/css/AdminDocentes.module.css';

const AdminDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const [limiteDocentes, setLimiteDocentes] = useState(0);
  const db = getFirestore();
  const { user } = useAuth();

  useEffect(() => {
    const fetchAdminCentro = async () => {
      if (!user) {
        console.log('User is not authenticated.');
        return;
      }

      try {
        console.log(`Fetching admin centro for user: ${user.uid}`);
        const adminCentroRef = doc(db, 'admincentro', user.uid);
        const adminCentroSnap = await getDoc(adminCentroRef);

        if (!adminCentroSnap.exists()) {
          console.log('No admincentro data found for user:', user.uid);
          return;
        }

        const adminCentroData = adminCentroSnap.data();
        console.log('adminCentroData:', adminCentroData);
        if (!adminCentroData.centro_id || adminCentroData.centro_id.length === 0) {
          console.log('No centro_id found in admincentro data.');
          return;
        }

        const centroId = adminCentroData.centro_id[0];
        console.log(`Fetching centro_educativo for centroId: ${centroId}`);
        // Obtener el plan de suscripción del centro educativo
        const centroRef = doc(db, 'centros_educativos', centroId);
        const centroSnap = await getDoc(centroRef);

        if (!centroSnap.exists()) {
          console.log('No centro_educativo data found for centroId:', centroId);
          return;
        }

        const centroData = centroSnap.data();
        console.log('centroData:', centroData);
        if (!centroData.suscripcion_id || centroData.suscripcion_id.length === 0) {
          console.log('No suscripcion_id found in centro_educativo data.');
          return;
        }

        const suscripcionId = centroData.suscripcion_id[0];
        console.log(`Fetching suscripcion for suscripcionId: ${suscripcionId}`);
        const suscripcionRef = doc(db, 'suscripciones', suscripcionId);
        const suscripcionSnap = await getDoc(suscripcionRef);

        if (!suscripcionSnap.exists()) {
          console.log('No suscripcion data found for suscripcion:', suscripcionId);
          return;
        }

        const suscripcionData = suscripcionSnap.data();
        console.log('suscripcionData:', suscripcionData);
        setLimiteDocentes(suscripcionData.num_docentes);

        // Obtener los docentes asociados a este centro_id
        console.log(`Fetching docentes for centroId: ${centroId}`);
        const q = query(collection(db, 'docentes'), where('centro_id', 'array-contains', centroId));
        const querySnapshot = await getDocs(q);
        const docentesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log('docentesList:', docentesList);
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
      <h1>Gestión de Docentes</h1>
      <Link to="/crear-docente" className={styles.button}>Crear Nuevo Docente</Link>
      <div className={styles.docentesList}>
        {docentes.map(docente => (
          <div key={docente.id} className={styles.docenteItem}>
            <div className={styles.docenteInfo}>
              <p><strong>Nombre:</strong> {docente.nombre}</p>
              <p><strong>Email:</strong> {docente.email}</p>
              <p><strong>Nivel:</strong> {docente.nivel}</p>
              <p><strong>Activo:</strong> {docente.activo ? 'Sí' : 'No'}</p>
            </div>
            <div className={styles.docenteActions}>
              <button
                onClick={() => handleActivateDocente(docente.id, !docente.activo)}
                className={`${styles.button} ${docente.activo ? styles.deactivate : styles.activate}`}
              >
                {docente.activo ? 'Desactivar' : 'Activar'}
              </button>
              <Link to={`/editar-docente/${docente.id}`} className={styles.button}>Editar</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDocentes;
