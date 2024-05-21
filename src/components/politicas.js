import React from "react";
import { Link } from "react-router-dom"; // Agrega esta línea para importar Link
import "../assets/css/flechas.css";
import Paginaprincipal from "./Paginaprincipal";

function Politica() {
    return (
        <div>
            <nav>
                <div className="barra">
                    <Link className="flecha" to="/Paginaprincipal">Volver</Link>
                    <h1 className="elemento">Políticas de Privacidad</h1>
                </div>
                <br></br>
            </nav>
            <div className="contenido">
                <h2>1. Introducción</h2>
                <p>
                    Bienvenido a [Nombre de la Empresa] ("nosotros", "nuestro", "nos"). Nos comprometemos a proteger y respetar su privacidad. Esta Política de Privacidad explica cómo recopilamos, usamos, divulgamos y protegemos su información cuando visita nuestro sitio web [nombre del sitio web] (el "Sitio"), así como sus derechos sobre su información.
                </p>
                <h2>2. Información que Recopilamos</h2>
                <p>Podemos recopilar y procesar la siguiente información sobre usted:</p>
                <ul>
                    <li><strong>Información Personal:</strong> Nombre, dirección de correo electrónico, dirección postal, número de teléfono y cualquier otra información que nos proporcione al registrarse en nuestro Sitio.</li>
                    <li><strong>Datos de Uso:</strong> Información sobre cómo accede y usa el Sitio, incluyendo su dirección IP, tipo de navegador, páginas que visita, el tiempo y la fecha de su visita, y otros datos de diagnóstico.</li>
                    <li><strong>Información de Pago:</strong> Datos de la tarjeta de crédito o débito u otros detalles sobre el método de pago, que se procesan a través de terceros proveedores de servicios de pago.</li>
                </ul>
                <h2>3. Uso de Su Información</h2>
                <p>Utilizamos la información que recopilamos para los siguientes propósitos:</p>
                <ul>
                    <li><strong>Para Proveer y Mejorar Nuestro Servicio:</strong> Procesar transacciones y enviar información relacionada, incluyendo confirmaciones y facturas.</li>
                    <li><strong>Para Comunicarnos con Usted:</strong> Responder a sus comentarios, preguntas y proporcionar servicio al cliente.</li>
                    <li><strong>Para Fines de Marketing:</strong> Enviar comunicaciones promocionales, aunque puede optar por no recibir estas comunicaciones en cualquier momento.</li>
                    <li><strong>Para Seguridad y Protección:</strong> Monitorear y analizar el uso del Sitio y detectar, prevenir y abordar problemas técnicos.</li>
                </ul>
                <h2>4. Compartir Su Información</h2>
                <p>No compartimos su información personal con terceros excepto en las siguientes circunstancias:</p>
                <ul>
                    <li><strong>Con Proveedores de Servicios:</strong> Compartimos información con terceros que realizan servicios en nuestro nombre, como procesamiento de pagos, análisis de datos, envío de correos electrónicos y servicios de marketing.</li>
                    <li><strong>Para Cumplir con las Leyes:</strong> Podemos divulgar su información si estamos legalmente obligados a hacerlo para cumplir con las leyes o en respuesta a solicitudes válidas de autoridades públicas.</li>
                </ul>
                <h2>5. Seguridad de Su Información</h2>
                <p>Utilizamos medidas de seguridad administrativas, técnicas y físicas para proteger su información personal. Sin embargo, recuerde que ningún método de transmisión a través de Internet o método de almacenamiento electrónico es 100% seguro.</p>
                <h2>6. Sus Derechos</h2>
                <p>Tiene derecho a acceder, corregir, actualizar o solicitar la eliminación de su información personal. Puede hacerlo a través de las configuraciones de su cuenta o contactándonos directamente.</p>
                <h2>7. Cookies</h2>
                <p>Utilizamos cookies y tecnologías similares para mejorar su experiencia en nuestro Sitio, analizar el tráfico y para fines publicitarios. Puede controlar el uso de cookies a través de la configuración de su navegador.</p>
                <h2>8. Cambios a Esta Política de Privacidad</h2>
                <p>Podemos actualizar nuestra Política de Privacidad de vez en cuando. Le notificaremos sobre cualquier cambio publicando la nueva Política de Privacidad en esta página.</p>
                <h2>9. Contacto</h2>
                <p>Si tiene alguna pregunta sobre esta Política de Privacidad, por favor contáctenos a través de:</p>
                <address>
                    [Nombre de la Empresa] <br />
                    [Dirección de la Empresa] <br />
                    [Correo Electrónico de Contacto] <br />
                    [Teléfono de Contacto] <br />
                </address>
            </div>
        </div>
    );
}

export default Politica;
