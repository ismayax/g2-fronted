import React, { useState, useEffect } from 'react';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import styles from '../assets/css/AdminDocentes.module.css';

const AdminDocentes = () => {
  const [docentes, setDocentes] = useState([]);
  const db = getFirestore();

  useEffect(() => {
    const fetchDocentes = async () => {
      const q = query(collection(db, 'docentes'), where('centro_id', '==', 'idDelCentroActual')); // Ajusta el centro_id según sea necesario
      const querySnapshot = await getDocs(q);
      const docentesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocentes(docentesList);
    };
    fetchDocentes();
  }, [db]);

  const handleActivateDocente = async (docenteId, isActive) => {
    if (isActive) {
      const activeDocentes = docentes.filter(docente => docente.activo).length;
      const maxActiveDocentes = 3; // Reemplaza esto con el valor correcto desde la base de datos
      if (activeDocentes >= maxActiveDocentes) {
        alert('No puedes activar más docentes. Límite alcanzado según el plan de suscripción.');
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
