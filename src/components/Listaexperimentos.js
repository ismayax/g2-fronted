import React, { useState, useEffect, useRef } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import "../assets/css/Listaexperimentos.css";

const Listaexperimentos = () => {
    const { grupo } = useParams();
    const location = useLocation();
    const fondoImage = location.state?.fondo || "../assets/img/laboratorioprimaria.jpg"; // Default background if none is passed
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

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            new window.rive.Rive({
                src: `${process.env.PUBLIC_URL}/galileo_1_sin_fondo.riv`,
                canvas,
                autoplay: false,
                layout: new window.rive.Layout({ fit: 'cover', alignment: 'center' }),
            });
        } else {
            console.error('Canvas element not found');
        }
    }, []);

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

            <canvas 
                ref={canvasRef} 
                id="canvas" 
                className="galileo-canvas" 
                width="1920" 
                height="1080"
                style={{ width: '90%', height: 'auto' }}
            ></canvas>        
        </div>
    );
};

export default Listaexperimentos;

const rectangleStyle = {
    marginBottom: "40px",
    backgroundColor: "rgb(120,168,128)",
    textAlign: "center",
    display: "inline-block",
};

const linkStyle = {
    textDecoration: "none",
    color: "white",
    fontSize: "24px",
};
