import React, { useState, useEffect, useRef } from 'react';
import {Link, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import styles from "../assets/css/Experimento.module.css"; 
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import galileoImage from '../assets/img/galileo3.png';
import { FaVolumeMute, FaVolumeUp } from 'react-icons/fa'; 

function Experimento() {
  const [experimento, setExperimento] = useState(null);
  const [showGalileo, setShowGalileo] = useState(true);
  const [pasoActual, setPasoActual] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { id } = useParams();
  const sliderRef = useRef(null); // Referencia al slider

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

  const leerTexto = (texto) => {
    if (!isMuted) {
      window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso
      const speech = new SpeechSynthesisUtterance(texto);
      speech.lang = 'es-ES';
      window.speechSynthesis.speak(speech);
    }
  };

  useEffect(() => {
    if (experimento) {
      let textoALeer = '';
      if (pasoActual === 0) {
        textoALeer = `${experimento.titulo}. ${experimento.descripcion_actividad}`;
      } else if (pasoActual === 1) {
        textoALeer = `Materiales necesarios: ${experimento.materiales.join(', ')}`;
      } else if (pasoActual === 2) {
        textoALeer = `Preguntas Hipotéticas Iniciales: ${experimento.preguntas_iniciales_hipotesis.join(', ')}`;
      } else if (pasoActual >= 3 && pasoActual < 3 + experimento.Pasos.length) {
        const indexPaso = pasoActual - 3;
        textoALeer = `Paso ${indexPaso + 1}: ${experimento.Pasos[indexPaso]}`;
      } else if (pasoActual === 3 + experimento.Pasos.length) {
        textoALeer = `Preguntas Finales para Conclusión: ${experimento.preguntas_finales_conclusion.join(', ')}. ${experimento.explicacion}`;
      }
      leerTexto(textoALeer);
    }
  }, [pasoActual, experimento, isMuted]);

  if (!experimento) {
    return <div>Cargando...</div>;
  }

  const handleSlideChange = (oldIndex, newIndex) => {
    window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso
    setShowGalileo(false);
    setPasoActual(newIndex);
  };

  const handleAfterSlideChange = () => {
    setShowGalileo(true);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    window.speechSynthesis.cancel();
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
    slides.push(
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
    );
    return slides;
  };

  const nextSlide = () => {
    sliderRef.current.slickNext();
  };

  const prevSlide = () => {
    sliderRef.current.slickPrev();
  };

  return (
    <div className={styles.experimentoContainer}>
      <div className={styles.sliderContainer}>
        <Slider
          ref={sliderRef}
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false} // Desactivar las flechas
          beforeChange={handleSlideChange}
          afterChange={handleAfterSlideChange}
        >
          {renderSlides()}
        </Slider>
        <div className={styles.navigationMuteContainer}>
          <button onClick={toggleMute} className={styles.muteButton}>
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          <div className={styles.controls}>
            <button onClick={prevSlide} className={styles.controlButton} disabled={pasoActual === 0}>Anterior</button>
            <button onClick={nextSlide} className={styles.controlButton} disabled={pasoActual === experimento.Pasos.length + 3}>Siguiente</button>
          </div>
        </div>
      </div>
      {showGalileo && <img src={galileoImage} alt="Galileo" className={styles.galileoImage} />}
    </div>
  );
  
  
}
  
export default Experimento;
