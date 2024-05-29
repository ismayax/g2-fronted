import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/flechas.css";
import "../assets/css/Cursosniveles.css";
import fondoImage from "../assets/img/laboratoriosecundaria.jpg"; // Ajusta la ruta según sea necesario
import galileoImage from "../assets/img/galileo3.png"; // Importa la imagen de Galileo

const Secundaria = () => {
  return (
    <div className="pagina-principal-container" style={{ backgroundImage: `url(${fondoImage})` }}>
      <nav>
        <div className="barra">
          <Link className="flecha" to="/Paginaprincipal"></Link>
          <h1 className="elemento">SELECCIONA EL CURSO</h1>
        </div>
      </nav>
      <div className="cuadro-container dos-columnas">
        <Link to="/Listaexperimentos/secundaria/s1" className="cuadros">1º</Link>
        <Link to="/Listaexperimentos/secundaria/s2" className="cuadros">2º</Link>
        <Link to="/Listaexperimentos/secundaria/s3" className="cuadros">3º</Link>
        <Link to="/Listaexperimentos/secundaria/s4" className="cuadros">4º</Link>
      </div>
      <img src={galileoImage} alt="Galileo" className="galileo-image" /> {/* Agrega la imagen de Galileo */}
    </div>
  );
};

export default Secundaria;
