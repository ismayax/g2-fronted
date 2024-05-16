import React from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/Paginalniveles.css";
import "../assets/css/flechas.css";

const Infantil = () => {
  return (
    <nav>
      <div className="barra">
      <Link className="flecha" to="/Paginaprincipal"></Link>
        <h1 className="elemento">SELECCIONE EL CURSO</h1>
      </div>
      <div className="cuadro-container" style={containerStyle}>
        <Link to="/Listaexperimentos/infantil/i3" className="cuadros" style={cuadroStyle}>3</Link>
        <Link to="/Listaexperimentos/infantil/i4" className="cuadros" style={cuadroStyle}>4</Link>
        <Link to="/Listaexperimentos/infantil/i5" className="cuadros" style={cuadroStyle}>5</Link>
      </div>
    </nav>
  );
};

export default Infantil;


const cuadroStyle = {
  marginBottom: "50px",
  width: "30%",
  padding: "50px",
  borderRadius: "50px",
  backgroundColor: "rgb(120,168,128)",
  textAlign: "center",
  display: "inline-block",
  textDecoration: "none",
  color: "white",
  fontSize: "50px",
  fontWeight: "bold",
  lineHeight: "100px",
};

const containerStyle = {
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  height: "100px",
};
