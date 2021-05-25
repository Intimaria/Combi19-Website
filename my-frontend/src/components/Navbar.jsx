import React from 'react'
import {Link, NavLink} from "react-router-dom";

import logo from "../images/logo_combi19.png"
import "../css/generalStyle.css";
import {useHistory} from 'react-router-dom';

const Navbar = ({userData}) => {
    const history = useHistory();

    const logout = () => {
        localStorage.clear();
        history.push('/login')
    }

    const loginRegistrationMenu = (
        <div>
            <NavLink to="/login" className="btn btn-dark mr-2"> Iniciar sesión </NavLink>
            <NavLink to="/register" className="btn btn-dark mr-2"> Registrar </NavLink>
        </div>
    )
    const logoutOption = (
        <button className="btn btn-dark mr-2" onClick={() => logout()}> Cerrar sesión </button>
    )

    const passengerMenu = (
        <div>
        </div>
    )
    const driverMenu = (
        <div>
            <NavLink to="/pendingTrips" className="btn btn-dark mr-2"> Viajes pendientes </NavLink>
            <NavLink to="/tripsMade" className="btn btn-dark mr-2"> Viajes realizados </NavLink>
        </div>
    )
    const adminMenu = (
        <div>
            <NavLink to="/routes" className="btn btn-dark mr-2"> Rutas </NavLink>
            <NavLink to="/transports" className="btn btn-dark mr-2"> Combis </NavLink>
            <NavLink to="/drivers" className="btn btn-dark mr-2"> Choferes </NavLink>
            <NavLink to="/places" className="btn btn-dark mr-2"> Lugares </NavLink>
            <NavLink to="/products" className="btn btn-dark mr-2"> Productos </NavLink>
            {
                /*
                <NavLink to="/reports" className="btn btn-dark mr-2"> Reportes </NavLink>
                <NavLink to="/users" className="btn btn-dark mr-2"> Usuarios </NavLink>
                 */
            }
        </div>
    )
    return (
        <div className="navbar navbar-dark bg-dark px-5 mb-4">
            <Link to="/" className="navbar-brand"> <img src={logo} alt="Logo" className="logo-navbar"/> </Link>
            <div className="d-flex">
                {!userData ? loginRegistrationMenu : null}
                {userData && userData.userRoleId.includes(3) ? passengerMenu : null}
                {userData && userData.userRoleId.includes(2) ? driverMenu : null}
                {userData && userData.userRoleId.includes(1) ? adminMenu : null}
                {userData ? logoutOption : null}
            </div>
        </div>
    )
}
export default Navbar
