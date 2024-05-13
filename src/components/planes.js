import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import db from "./firebaseConfig"; // Importa la instancia de Firestore desde donde la hayas exportado
import { collection, getDocs } from "firebase/firestore";

const Listaexperimentos = () => {
    const [actividades, setActividades] = useState([]);

    useEffect(() => {
        const fetchActividades = async () => {
            try {
                const actividadesRef = collection(db, "actividades", "infantil", "actividades");
                const querySnapshot = await getDocs(actividadesRef);
        
                const actividadesData = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    actividadesData.push({
                        id: doc.id,
                        nombre: data.titulo
                    });
                });
        
                setActividades(actividadesData);
            } catch (error) {
                console.log("Error al obtener las actividades:", error);
            }
        };

        fetchActividades();
    }, []);

    return (
        <div>
        <div>
            <h1>plan basico</h1>
            <p>ventajas</p>
        </div>
        <h1>plan basico+</h1>
        <div>
            <h1>plan premium</h1>
            <p>ventajas</p>
        </div>
        </div>
    );
};

export default Listaexperimentos;

const linkStyle = {
    textDecoration: "none",
};

const rectangleStyle = {
    marginBottom: "40px", // Aumentado el espacio entre rectángulos
    width: "30%", // Ancho de los rectángulos (ajustar según sea necesario)
    padding: "30px", // Espaciado interno del rectángulo
    borderRadius: "50px", // Bordes redondeados del rectángulo
    backgroundColor: "rgb(120,168,128)", // Color de fondo del rectángulo
    textAlign: "center", // Alinear el texto al centro
    display: "inline-block", // Hacer que los rectángulos se muestren en línea
};

const textStyle = {
    fontSize: "24px", // Aumentado el tamaño de la letra
    color: "white", // Color del texto
};
