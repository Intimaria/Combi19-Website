import React from 'react'
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
    return (
        <div>
            <div className="btn-group">
                <Link to="/" className="btn btn-secondary">Inicio</Link>
                <Link to="/login" className="btn btn-secondary">Iniciar Sesion</Link>
                <NavLink to="/register" className="btn btn-secondary">Registrarse</NavLink>
            </div>
            <hr className="text-light" />
        </div>
    )
}

export default Navbar
