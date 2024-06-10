import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Cursosniveles.css";
import BurguerButton from "./menudesple";
import fondoImage from "../assets/img/laboratorio.jpg";
import galileoRive from '../assets/riv/galileo_1_sin_fondo.riv';
import Chat from "./Chat";

const Paginaprincipal = ({ userId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const menuRef = useRef(null);
  const canvasRef = useRef(null);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    const rive = new window.rive.Rive({
      src: galileoRive,
      canvas,
      autoplay: false,
      layout: new window.rive.Layout({
        fit: 'cover',
        alignment: 'center'
      }),
    });

    return () => {
      rive.stop();
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
      
      <canvas 
        ref={canvasRef} 
        id="canvas" 
        className="galileo-canvas" 
        width="1920" 
        height="1080"
        style={{ width: '90%', height: 'auto' }}
      ></canvas>

      <button onClick={() => setIsChatOpen(!isChatOpen)} className="chat-toggle-button">
        {isChatOpen ? 'Cerrar Chat' : 'Abrir Chat'}
      </button>
      {isChatOpen && <Chat userId={userId} closeChat={() => setIsChatOpen(false)} />}
    </div>
  );
};

export default Paginaprincipal;
