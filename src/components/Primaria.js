// Primaria.jsx (Ejemplo)
import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorioprimaria.jpg";
import galileoImage from "../assets/img/galileo3.png";

const Primaria = () => {
  return (
    <div className="pagina-principal-container" style={{ backgroundImage: `url(${fondoImage})` }}>
      <nav>
        <div className="barra">
          <Link className="flecha" to="/Paginaprincipal"></Link>
          <h1 className="elemento">SELECCIONE EL CURSO</h1>
        </div>
      </nav>
      <div className="cuadro-container dos-columnas">
        {["p1", "p2", "p3", "p4", "p5", "p6"].map((grupo) => (
          <Link
            key={grupo}
            to={`/Listaexperimentos/primaria/${grupo}`}
            state={{ fondo: fondoImage }}
            className="cuadros"
          >
            {grupo.slice(1)}º
          </Link>
        ))}
      </div>
      <img src={galileoImage} alt="Galileo" className="galileo-image" />
    </div>
  );
};

export default Primaria;
