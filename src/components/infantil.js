import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/Paginalniveles.css";
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorio.jpg";
import galileoImage from "../assets/img/galileo3.png"; // Importar la imagen del personaje

const Infantil = () => {
  return (
    <div className="pagina-principal-container" style={{ backgroundImage: `url(${fondoImage})` }}>
      <nav>
        <div className="barra">
          <Link className="flecha" to="/Paginaprincipal"></Link>
          <h1 className="elemento">SELECCIONA EL CURSO</h1>
        </div>
      </nav>
      <div className="cuadro-container">
        <Link to="/Listaexperimentos/infantil/i3" className="cuadros">3</Link>
        <Link to="/Listaexperimentos/infantil/i4" className="cuadros">4</Link>
        <Link to="/Listaexperimentos/infantil/i5" className="cuadros">5</Link>
      </div>
      <img src={galileoImage} alt="Galileo" className="galileo-image" />
    </div>
  );
  
};

export default Infantil;
