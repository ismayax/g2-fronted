import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";

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
        <div>
            <div className="barra">
                <div className="btn-menu">
                    <label htmlFor="btn-menu" className="icon-menu"></label>
                </div>
            </nav>

            <div className={styles.recuadroContainer}>
                {actividades.length > 0 ? (
                    actividades.map((actividad, index) => (
                        <div key={actividad.id} className="recuadro" style={rectangleStyle}>
                            {/* Movemos el enlace directamente dentro del área verde */}
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
