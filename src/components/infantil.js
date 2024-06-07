import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorioinfantil.jpg";

const Infantil = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const script = document.createElement("script");
      script.src = "https://unpkg.com/@rive-app/canvas";
      script.async = true;
      script.onload = () => {
        new window.rive.Rive({
          src: `${process.env.PUBLIC_URL}/galileo_1_sin_fondo.riv`,
          canvas,
          autoplay: true,
          layout: new window.rive.Layout({
            fit: window.rive.Fit.None,
            alignment: window.rive.Alignment.Center,
          }),
        });
      };
      document.body.appendChild(script);
    } else {
      console.error('Canvas element not found');
    }
  }, []);

  return (
    <div className="pagina-principal-container" style={{ backgroundImage: `url(${fondoImage})` }}>
      <nav>
        <div className="barra">
          <Link className="flecha" to="/Paginaprincipal"></Link>
          <h1 className="elemento">SELECCIONE EL CURSO</h1>
        </div>
      </nav>
      <div className="cuadro-container">
        {["i3", "i4", "i5"].map((grupo) => (
          <Link
            key={grupo}
            to={`/Listaexperimentos/infantil/${grupo}`}
            state={{ fondo: fondoImage }}
            className="cuadros"
          >
            {grupo.slice(1)}
          </Link>
        ))}
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
};

export default Infantil;
