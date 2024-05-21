import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import styles from "../assets/css/Experimento.module.css"; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import galileoImage from '../assets/img/galileo3.png';

function Experimento() {
  const [experimento, setExperimento] = useState(null);
  const [showGalileo, setShowGalileo] = useState(true);
  const [pasoActual, setPasoActual] = useState(0); // Definir pasoActual aquí
  const { id } = useParams();
  
  useEffect(() => {
    const fetchExperimento = async () => { 
      const docRef = doc(db, "actividades", "infantil", "actividades", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setExperimento({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such document!");
      }
    };

    
    fetchExperimento();
  }, [id]);

  useEffect(() => {
    if (experimento && experimento.Pasos && experimento.Pasos[pasoActual]) {
      leerTexto(`Paso ${pasoActual + 1}: ${experimento.Pasos[pasoActual]}`);
    }
  }, [pasoActual, experimento]);

  const leerTexto = (texto) => {
    const speech = new SpeechSynthesisUtterance(texto);
    window.speechSynthesis.speak(speech);
  };

  if (!experimento) {
    return <div>Cargando...</div>;
  }

  const handleSlideChange = (current) => {
    setShowGalileo(false); // Oculta la imagen de Galileo al cambiar de diapositiva
    setPasoActual(current); // Actualizar pasoActual al cambiar de diapositiva
  };

  const handleAfterSlideChange = () => {
    setShowGalileo(true); // Muestra la imagen de Galileo después de cambiar la diapositiva
  };

  const renderSlides = () => {
    const slides = [
      <div key="descripcion">
        <div className={styles.header}>
          <h1 className={styles.experimentoTitle}>{experimento.titulo}</h1>
          <span className={styles.grupo}>{experimento.grupo}</span>
        </div>
        <p className={styles.experimentoDescription}>{experimento.descripcion_actividad}</p>
      </div>,
      <div key="materiales">
        <h2 className={styles.materialsHeader}>Materiales necesarios:</h2>
        <ul className={styles.materialList}>
          {experimento.materiales.map(material => (
            <li key={material} className={styles.materialItem}>
              <span style={{ color: 'black' }}>{material}</span>
            </li>
          ))}
        </ul>
      </div>,
      <div key="preguntas_iniciales">
        <div className={styles.hipotesis}>
          <h3>Preguntas Hipotéticas Iniciales:</h3>
          <ul>
            {experimento.preguntas_iniciales_hipotesis.map(pregunta => (
              <li key={pregunta}>{pregunta}</li>
            ))}
          </ul>
        </div>
      </div>
    ];
    experimento.Pasos.forEach((paso, index) => {
      slides.push(
        <div key={`paso_${index}`}>
          <div className={styles.pasoContainer}>
            <div className={styles.paso}>
              <h2>Paso {index + 1}</h2>
              <div className={styles.bocadillo}>{paso}</div>
            </div>
          </div>
        </div>
      );
    });
    return slides;
  };

  return (
    <div className={styles.experimentoContainer}>
      <div className={styles.sliderContainer}>
        <Slider
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          beforeChange={handleSlideChange}
          afterChange={handleAfterSlideChange}
        >
          {renderSlides()}
          <div key="conclusion">
            <div className={styles.conclusion}>
              <h3>Preguntas Finales para Conclusión:</h3>
              <ul>
                {experimento.preguntas_finales_conclusion.map(pregunta => (
                  <li key={pregunta}>{pregunta}</li>
                ))}
              </ul>
            </div>
            <p className={styles.explicacion}>{experimento.explicacion}</p>
          </div>
        </Slider>
      </div>
      {showGalileo && <img src={galileoImage} alt="Galileo" className={styles.galileoImage} />}
    </div>
  );
}

export default Experimento;
