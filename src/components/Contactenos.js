import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import "../assets/css/contactenos.css";

function Contactenos() {
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    from_phone: '',
    message: ''
  });
  const [mensajeExito, setMensajeExito] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_388zi39', 'template_a91d9nf', e.target, 'tLr9WocZl0HqlGnLg')
      .then((result) => {
        console.log(result.text);
        setMensajeExito('Enviado correctamente, te contactaremos pronto!');
        setFormData({
          from_name: '',
          from_email: '',
          from_phone: '',
          message: ''
        });
      }, (error) => {
        console.log(error.text);
      });
  };

  return (
    <div className="contact-container">
      <h1>Contáctenos</h1>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="from_name">Nombre:</label>
          <input
            type="text"
            id="from_name"
            name="from_name"
            value={formData.from_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="from_email">Correo Electrónico:</label>
          <input
            type="email"
            id="from_email"
            name="from_email"
            value={formData.from_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="from_phone">Número de Teléfono:</label>
          <input
            type="tel"
            id="from_phone"
            name="from_phone"
            value={formData.from_phone}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">Comentario:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <button type="submit" className="submit-button">Enviar</button>
        {mensajeExito && <p className="success-message">{mensajeExito}</p>}
      </form>
    </div>
  );
}

export default Contactenos;
