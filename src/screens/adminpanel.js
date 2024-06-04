// src/screens/adminpanel.js

import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/css/AdminPanel.module.css'; // Asegúrate de crear este archivo CSS para los estilos

const AdminPanel = () => {
  return (
    <div className="admin-panel">
      <h1>Configuración Centro Educativo</h1>
      <div className="panel-container">
        <div className="panel-card">
          <Link to="/admin-docentes">
            <div className="panel-content">
              <h2>Ver Información Centro</h2>
            </div>
          </Link>
        </div>
        <div className="panel-card">
          <Link to="/ampliar-plan">
            <div className="panel-content">
              <h2>Ampliar Plan</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
