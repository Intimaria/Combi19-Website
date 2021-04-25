import React from 'react'
import { Link, NavLink } from "react-router-dom";

import logo from "../images/logo_combi19.png"
import "../css/generalStyle.css";


const roleId = JSON.parse(localStorage.getItem('userData'))?.userRoleId;

const Navbar = () => {
    /*let menuItems = [];
    if () {
        menuItems.push({ name: 'Iniciar Sesion', url: '/login' });
        menuItems.push({ name: 'Registrarse', url: '/register' });
    }
    else {
        
        if (roleId === 1) {
            menuItems.push({ name: 'Choferes', url: '/home/drivers' });
            menuItems.push({ name: 'Combis', url: '/buses' });
            menuItems.push({ name: 'Lugares', url: '/places' });
            menuItems.push({ name: 'Rutas', url: '/routes' });
        }
        else if (roleId === 2) {
            menuItems.push({ name: 'Viajes Realizados', url: '/tripsMade' });
            menuItems.push({ name: 'Viajes Pendientes', url: '/pendingTrips' });
        }
        else if (roleId === 3) {

        }
        menuItems.push({ name: 'Cerrar sesión', url: '/loguot' });
    }
    */
    console.log(JSON.parse(localStorage.getItem('userData')));
    console.log('a', roleId);
    return (
        <div className="navbar navbar-dark bg-dark px-5 mb-4">
            <Link to="/" className="navbar-brand"> <img src={logo} alt="Logo" className="logo-navbar" /> </Link>
            <div>
                <div className="d-flex">
                    {!roleId ? console.log("Actualizo") : null}
                    {!roleId ? <NavLink to="/register" className="btn btn-dark mr-2">Registrar</NavLink> : null}
                    {roleId ? console.log("Tambien Actualizo") : null}
                </div>
            </div>
        </div>
    )
}
export default Navbar
