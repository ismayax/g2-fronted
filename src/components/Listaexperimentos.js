import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import fondoImage from "../assets/img/laboratorio.jpg"; 
import galileoImage from "../assets/img/galileo3.png"; 
import styles from "../assets/css/Listaexperimentos.module.css";

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
        <div className={styles.paginaExperimentosContainer} style={{ backgroundImage: `url(${fondoImage})` }}>
            <nav>
                <div className={styles.barra}>
                    <Link className="flecha" to="/Paginaprincipal"></Link>  
                    <h1 className={styles.elemento}>EXPERIMENTOS</h1>
                </div>
            </nav>

            <div className={styles.recuadroContainer}>
                {actividades.length > 0 ? (
                    actividades.map((actividad, index) => (
                        <div key={actividad.id} className={styles.recuadro}>
                            <Link to={`/experimento/${actividad.id}`} className={styles.link}>
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
    width: "100%",
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
