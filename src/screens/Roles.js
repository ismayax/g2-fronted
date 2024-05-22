import React, {useState} from "react";
import {getAuth, createUserWithEmailAndPassword} from "../components/firebaseConfig";


const auth = getAuth(firebaseApp);

function Roles () {

    const [isRegistrando, setIsRegistrando] = useState(false);

    async function RegistrarUsuario(auth, email, password){
        createUserWithEmailAndPassword(auth, email, password)

    }

       function submitHandler(e) {
        e.precentDefault();

        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        const rol = e.target.elements.rol.value;

        console.log(
            "submit", email, password, rol);
       }
       if(isRegistrando){

        RegistrarUsuario(email, password, rol)
       }else{

       }
    return (
        <div > 
            <h1>{isRegistrando ? "Registrate" : "Inicia sesión" }</h1>
            <form onSubmit={submitHandler}>
                <label>
                    correo electrónico:
                    <input type="email" id="email"></input>
                </label>
            <label>
                Contraseña:
                <input type="password" id="password"></input>
            </label>
            <label>
                Rol:
                <select id="rol">
                    <option value="admin">Administrador</option>
                    <option value="docente">Docente</option>
                    <option value="usuario">Usuario</option>
                </select>
                </label>

               <input type="submit" value={isRegistrando ? "Registrar" : "Iniciar sesión"} ></input> 
            </form>
          
                <button onClick={()=> setIsRegistrando(!isRegistrando)}>
                    {isRegistrando ? "Ya tengo cuenta" : "Quiero registrarme"}
                </button>
          
        </div>
    )
}