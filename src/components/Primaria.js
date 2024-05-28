import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css"; // Asegúrate de que este archivo tenga los estilos consistentes
import "../assets/css/flechas.css";
import fondoImage from "../assets/img/laboratorio.jpg";
import galileoImage from "../assets/img/galileo3.png"; // Importar la imagen del personaje

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
        <Link to="/Listaexperimentos/primaria/p1" className="cuadros">1º</Link>
        <Link to="/Listaexperimentos/primaria/p2" className="cuadros">2º</Link>
        <Link to="/Listaexperimentos/primaria/p3" className="cuadros">3º</Link>
        <Link to="/Listaexperimentos/primaria/p4" className="cuadros">4º</Link>
        <Link to="/Listaexperimentos/primaria/p5" className="cuadros">5º</Link>
        <Link to="/Listaexperimentos/primaria/p6" className="cuadros">6º</Link>
      </div>
      <img src={galileoImage} alt="Galileo" className="galileo-image" />
    </div>
  );
};

export default Primaria;
