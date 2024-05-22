import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { db } from './firebaseConfig';
import { collection, getDocs, query, where } from "firebase/firestore";
import fondoImage from "../assets/img/laboratorio.jpg"; // Importa la imagen de fondo
import "../assets/css/Listaexperimentos.css"; // Importa el nuevo CSS

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
            <nav>
                <div className="barra">
                    <Link className="flecha" to="/Paginaprincipal"></Link>
                    <h1 className="elemento">EXPERIMENTOS</h1>
                </div>
            </nav>

            <div className="recuadro-container">
                {actividades.length > 0 ? (
                    actividades.map((actividad, index) => (
                        <div key={actividad.id} className="recuadro">
                            <Link to={`/experimento/${actividad.id}`} className="link">
                                {actividad.nombre}
                            </Link>
                        </div>
                    ))
                ) : (
                    <p>No hay actividades disponibles.</p>
                )}
            </div>
        </div>
    );
};

export default Listaexperimentos;
