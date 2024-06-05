import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorioinfantil.jpg";
import { Rive, Layout } from '@rive-app/react-canvas';

const Infantil = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const rive = new Rive({
        src: '/assets/riv/galileo_1_sin_fondo.riv', // Asegúrate de que la ruta sea correcta
        canvas: canvasRef.current,
        autoplay: true,
        layout: new Layout({ fit: 'cover', alignment: 'center' }),
      });

      return () => {
        rive.cleanup();
      };
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
      <canvas ref={canvasRef} id="canvas" className="galileo-canvas"></canvas>
    </div>
  );
};

export default Infantil;
