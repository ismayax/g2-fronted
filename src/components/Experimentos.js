import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import styles from "../assets/css/Experimento.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import { FaVolumeMute, FaVolumeUp, FaArrowLeft } from 'react-icons/fa';

function Experimento() {
  const [experimento, setExperimento] = useState(null);
  const [showGalileo, setShowGalileo] = useState(true);
  const [pasoActual, setPasoActual] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const { id } = useParams();
  const sliderRef = useRef(null);
  const navigate = useNavigate();
  const canvasRef = useRef(null);

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
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(texto);
      speech.lang = 'es-ES';
      speech.pitch = 0.6;
      speech.rate = 1;
      speech.volume = 1;
      const voices = window.speechSynthesis.getVoices();
      speech.voice = voices.find(voice => voice.name === 'Google español');
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
        textoALeer = `Preguntas Finales para Conclusión: ${experimento.preguntas_finales_conclusion.join(', ')}`;
      } else if (pasoActual === 4 + experimento.Pasos.length) {
        textoALeer = `Explicación: ${experimento.explicacion}`;
      }
      leerTexto(textoALeer);
    }
  }, [pasoActual, experimento, isMuted]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      new window.rive.Rive({
        src: `${process.env.PUBLIC_URL}/galileo_1_sin_fondo.riv`,
        canvas: canvasRef.current,
        autoplay: true,
        layout: new window.rive.Layout({ fit: 'cover', alignment: 'center' }),
      });
    }
  }, [canvasRef]);

  const handleSlideChange = (oldIndex, newIndex) => {
    window.speechSynthesis.cancel();
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
    if (!experimento) {
      return null;
    }
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
      </div>
    );
    slides.push(
      <div key="explicacion">
        <div className={styles.explicacion}>{experimento.explicacion}</div>
      </div>
    );
    return slides;
  };

  const nextSlide = () => {
    if (pasoActual === experimento.Pasos.length + 4) {
      // Si estamos en el último slide, puedes añadir aquí la lógica para manejarlo
    } else {
      sliderRef.current.slickNext();
    }
  };

  const prevSlide = () => {
    if (pasoActual === 0) {
      navigate(-1);
    } else {
      sliderRef.current.slickPrev();
    }
  };

  return (
    <div className={styles.experimentoContainer}>
      <button onClick={() => navigate(-1)} className={styles.backLink}>
        <FaArrowLeft />
      </button>
      <div className={styles.sliderContainer}>
        <Slider
          ref={sliderRef}
          dots={true}
          infinite={true}
          speed={500}
          slidesToShow={1}
          slidesToScroll={1}
          arrows={false}
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
            <span className={styles.buttonSeparator}></span>
            <button onClick={nextSlide} className={styles.controlButton}>Siguiente</button>
          </div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        id="canvas" 
        className="galileo-canvas" 
        width="1920" 
        height="1080"
        style={{ width: '90%', height: 'auto' }}
      ></canvas>
    </div>
  );
}

export default Experimento;
