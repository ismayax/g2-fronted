import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/PlanesSuscripcion.css'; // Importa el CSS para estilos

function PlanesSuscripcion() {
  const navigate = useNavigate();

  const planes = [
    { tipo: "basico", precio: 10, num_docentes: "3", icono: "🗓️" },
    { tipo: "normal", precio: 15, num_docentes: "5", icono: "📆" },
    { tipo: "premium", precio: 20, num_docentes: "20", icono: "📅" }
  ];

  const seleccionarPlan = (plan) => {
    console.log(`Plan seleccionado: ${plan.tipo}`);
    navigate('/pago'); 
  };

  const irAtras = () => {
    navigate(-1); // Navega hacia atrás
  };

  return (
    <div className="greenBackground">
      <div className="suscripcion-container">
        <button className="back-button" onClick={irAtras}>←</button>
        <div className="banner">
          <h1>Elige tu plan de suscripción</h1>
        </div>
        <div className="planes-container">
          {planes.map((plan) => (
            <div key={plan.tipo} className="plan">
              <div className="icono">{plan.icono}</div>
              <h2>{plan.tipo}</h2>
              <p>Precio total: {plan.precio}€</p>
              <p>Número de docentes: {plan.num_docentes}</p>
              <button onClick={() => seleccionarPlan(plan)}>Elegir Plan</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlanesSuscripcion;
