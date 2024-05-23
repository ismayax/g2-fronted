import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import "../assets/css/Listaexperimentos.css";
import fondoImage from "../assets/img/laboratorio.jpg"; // Import the background image
import galileoImage from "../assets/img/galileo3.png"; // Import the Galileo image

const Listaexperimentos = () => {
    const { grupo } = useParams();
    const [actividades, setActividades] = useState([]);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                if (grupo) {
                    const actividadesRef = collection(db, "actividades", "infantil", "actividades");
                    const q = query(actividadesRef, where("grupo", "==", grupo));
                    const querySnapshot = await getDocs(q);
                    const actividadesData = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        nombre: doc.data().titulo
                    }));
                    setActividades(actividadesData);
                }
            } catch (error) {
                console.log("Error al obtener las actividades:", error);
            }
        };

        fetchActividades();
    }, [grupo]);

    return (
        <div className="pagina-experimentos-container" style={{ backgroundImage: `url(${fondoImage})` }}>
            <div className="barra">
                <div className="btn-menu">
                    <label htmlFor="btn-menu" className="icon-menu"></label>
                </div>
                <Link className="flecha" to="/Paginaprincipal"></Link>
                <h1 className="elemento">EXPERIMENTOS</h1>
                <div className="lista-enlaces"></div>
            </div>

            <div className="spacer"></div> {/* Agrega un elemento de espaciado para compensar el espacio ocupado por la barra */}
            <div className="recuadro-container">
                {actividades.length > 0 ? (
                    actividades.map((actividad) => (
                        <div key={actividad.id} className="recuadro" style={rectangleStyle}>
                            <Link to={`/experimento/${actividad.id}`} style={linkStyle}>
                                {actividad.nombre}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No hay actividades disponibles.</p>
                )}
            </div>

            <img src={galileoImage} alt="Galileo" className="galileo-image" />
        </div>
    );
};

export default Listaexperimentos;

const rectangleStyle = {
    marginBottom: "40px",
    width: "30%",
    padding: "30px",
    borderRadius: "50px",
    backgroundColor: "rgb(120,168,128)",
    textAlign: "center",
    display: "inline-block",
};

const linkStyle = {
    textDecoration: "none",
    color: "white",
    fontSize: "24px",
};
