import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/Paginalniveles.css";
import BurguerButton from "./menudesple";
import IdenUsuario from "./idenusuario";


const Paginaprincipal = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div>
      <nav>
      <div className="barra">
          <h1 className="elemento">SELECCIONA EL NIVEL ACADEMICO</h1>
          <BurguerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
      <div ref={menuRef} className={`menu-lateral ${isOpen ? "open" : ""}`}>
        <Link to="/Politicas" className="contactos">Contactenos</Link>
        <Link to="/Politica" className="politicas">Politicas de privacidad</Link>
        <Link to="/login" className="enlace-cerrar">Cerrar sesión</Link>
      </div>
      <div className="cuadro-container" style={containerStyle}>
        <Link to="/Infantil" className="cuadros infantil" style={cuadroStyle}>
          <div className="medio">INFANTIL</div>
        </Link>
        <Link to="/Primaria" className="cuadros primaria" style={cuadroStyle}>
          <div className="medio">PRIMARIA</div>
        </Link>
        <Link to="/Secundaria" className="cuadros secundaria" style={cuadroStyle}>
          <div className="medio">SECUNDARIA</div>
        </Link>
        <Link to="/Listaexperimentos/primaria/5" style={{ textDecoration: "none", color: "white", fontSize: "24px", fontWeight: "bold" }}>5</Link>
      </div>
    </div>
  );
};

export default Paginaprincipal;

const cuadroStyle = {
  padding: "10px",
  borderRadius: "50px",
  backgroundColor: "rgb(120,168,128)",
  textAlign: "center",
  display: "inline-block",
  textDecoration: "none",
  color: "white",
  fontSize: "24px",
  fontWeight: "bold",
};

const containerStyle = {
  display: "flex",
  justifyContent: "space-around",
};
