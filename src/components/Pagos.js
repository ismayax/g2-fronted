import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/css/PlanesSuscripcion.css'; // Importa el CSS para estilos

function PlanesSuscripcion() {
  const navigate = useNavigate();

  const planes = [
    { tipo: "Básico", precio: 10, num_docentes: "3", icono: "🗓️" },
    { tipo: "Normal", precio: 15, num_docentes: "5", icono: "📆" },
    { tipo: "Premium", precio: 20, num_docentes: "20", icono: "📅" }
  ];

  const seleccionarPlan = (plan) => {
    console.log(`Plan seleccionado: ${plan.tipo}`);
    navigate('/pago'); 
  };

  return (
    <div className="suscripcion-container">
      <div className="banner">
        <h1>Elige tu plan de suscripción</h1>
      </div>
      <div className="planes-container">
        {planes.map((plan) => (
          <div key={plan.tipo} className="plan">
            <div className="icono">{plan.icono}</div>
            <h2>{plan.tipo}</h2>
            <p>Número de docentes: {plan.num_docentes}</p>
            <p>Precio: {plan.precio}€/mes</p>
            <button onClick={() => seleccionarPlan(plan)}>Elegir Plan</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlanesSuscripcion;
