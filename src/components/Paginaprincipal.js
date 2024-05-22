import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import "../assets/css/Paginalniveles.css";
import BurguerButton from "./menudesple";
import IdenUsuario from "./idenusuario";
import fondoImage from "../assets/img/laboratorio.jpg"; // Importa la imagen de fondo
import galileoImage from "../assets/img/galileo3.png"; // Importa la imagen del personaje

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
    <div className="pagina-principal-container" style={{ backgroundImage: `url(${fondoImage})` }}>
      <nav>
        <div className="barra"> 
          <h1 className="elemento">SELECCIONA EL NIVEL ACADEMICO</h1>
          <BurguerButton isOpen={isOpen} setIsOpen={setIsOpen} />
        </div>
      </nav>
      <div ref={menuRef} className={`menu-lateral ${isOpen ? "open" : ""}`}>
        <Link to="/Contactenos" className="contactos">Contactenos</Link>
        <Link to="/Politica" className="politicas">Politicas de privacidad</Link>
        <Link to="/login" className="enlace-cerrar">Cerrar sesión</Link>
      </div>
      <div className="cuadro-container">
        <Link to="/Infantil" className="cuadros infantil">
          <div className="medio">INFANTIL</div>
        </Link>
        <Link to="/Primaria" className="cuadros primaria">
          <div className="medio">PRIMARIA</div>
        </Link>
        <Link to="/Secundaria" className="cuadros secundaria">
          <div className="medio">SECUNDARIA</div>
        </Link>
      </div>
      <img src={galileoImage} alt="Galileo" className="galileo-image" />
    </div>
  );
};

export default Paginaprincipal;
