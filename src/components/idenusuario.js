import React, { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Auth from './Auth'; // Importa el componente Auth directamente

function IdenUsuario() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const { currentUser } = Auth(); 
  const firestore = getFirestore();

  useEffect(() => {
    const fetchUserName = async () => {
      if (currentUser) {
        try {
          const userDoc = doc(firestore, 'suscripcion', currentUser.uid);
          const docSnap = await getDoc(userDoc);
          if (docSnap.exists()) {
            const { nombre } = docSnap.data();
            setNombreUsuario(nombre);
          }
        } catch (error) {
          console.error('Error al obtener el nombre de usuario:', error);
        }
      }
    };

    fetchUserName();
  }, [currentUser, firestore]);

  return <h2>{nombreUsuario || 'Usuario'}</h2>;
}

export default IdenUsuario;


