import React from 'react';
//import { Link, NavLink } from "react-router-dom";
import Link from "next/link";
import {useRouter} from "next/router";
import Image from "next/image";

import { Button } from '@material-ui/core'

const Navbar = ({ userData }) => {

	const router = useRouter();
	
    const logout = () => {
        localStorage.clear();
        router.push('/')
    }
    
    const loginRegistrationMenu = (
        <div>
            <Link href="/login" className="btn btn-dark mr-2">
				<Button variant="contained">
				<a> Iniciar sesión</a>
				</Button>
            </Link>
            <Link href="/register" className="btn btn-dark mr-2">
				<Button variant="contained">
				<a> Registrar </a>
				</Button>
            </Link>
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
        <div >
            <Link href="/pendingTrips" className="btn btn-dark mr-2"><a> Viajes pendientes </a></Link>
            <Link href="/tripsMade" className="btn btn-dark mr-2"><a> Viajes realizados </a></Link>
        </div>
    )
    const adminMenu = (
        <div>
            <Link href="/drivers" className="btn btn-dark mr-2"><a> Choferes </a></Link>
            <Link href="/buses" className="btn btn-dark mr-2"><a> Combis </a></Link>
            <Link href="/places" className="btn btn-dark mr-2"><a> Lugares </a></Link>
            <Link href="/products" className="btn btn-dark mr-2"><a> Productos </a></Link>
            <Link href="/reports" className="btn btn-dark mr-2"><a> Reportes </a></Link>
            <Link href="/uers" className="btn btn-dark mr-2"><a> Usuarios </a></Link>
        </div>
    )
    
    return (
        <div className="navbar navbar-dark bg-dark px-5 mb-4">
            <Link href="/" className="navbar-brand"><a className="logo-navbar">
            <Image
				src="/logo_combi19.png"
				alt="Logo"
				width={500}
				height={500}
			/></a>
			</Link>
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
