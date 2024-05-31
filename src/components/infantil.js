// Infantil.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorioinfantil.jpg";
import galileoImage from "../assets/img/galileo3.png";

const Infantil = () => {
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
      <img src={galileoImage} alt="Galileo" className="galileo-image" />
    </div>
  );
};

export default Infantil;
