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
      if (user) {
        const adminCentroRef = doc(db, 'admincentro', user.uid);
        const adminCentroSnap = await getDoc(adminCentroRef);

        if (adminCentroSnap.exists()) {
          const adminCentroData = adminCentroSnap.data();
          const centroId = adminCentroData.centro_id[0]; // Asumiendo que siempre hay al menos un centro_id

          // Obtener el plan de suscripción del centro educativo
          const centroRef = doc(db, 'centros_educativos', centroId);
          const centroSnap = await getDoc(centroRef);

          if (centroSnap.exists()) {
            const centroData = centroSnap.data();
            const suscripcionRef = doc(db, 'suscripciones', centroData.suscripcion);
            const suscripcionSnap = await getDoc(suscripcionRef);

            if (suscripcionSnap.exists()) {
              const suscripcionData = suscripcionSnap.data();
              setLimiteDocentes(suscripcionData.num_docentes);
            }
          }

          // Obtener los docentes asociados a este centro_id
          const q = query(collection(db, 'docentes'), where('centro_id', 'array-contains', centroId));
          const querySnapshot = await getDocs(q);
          const docentesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setDocentes(docentesList);
        }
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

    const docenteRef = doc(db, 'docentes', docenteId);
    await updateDoc(docenteRef, { activo: isActive });
    setDocentes(docentes.map(doc => (doc.id === docenteId ? { ...doc, activo: isActive } : doc)));
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
