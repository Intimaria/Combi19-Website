import React from 'react'
import { Switch, Route } from "react-router-dom";

import Login from './Login.jsx';
import Register from './Register.jsx';
import Home from './Home.jsx';
import Logout from './Logout.jsx';

const Addresses = () => {
    return (
        <div>
            <Switch>
                <Route path="/" exact>
                    <h1 className="text-light"> Pagina de Inicio </h1>
                </Route>
                <Route path="/login" exact>
                    <Login path=""/>
                </Route>
                <Route path="/login/employees" exact>
                    <Login path="employees"/>
                </Route>
                <Route path="/register" exact>
                    <Register />
                </Route>
                <Route path="/home" exact>
                    <Home  />
                </Route>
                <Route path="/logout" exact>
                    <Logout  />
                </Route>
                <Route>
                    <h2 className="text-light" >Page Don't Found - Error 404</h2>
                </Route>
            </Switch>
        </div>
    )
}

export default Addresses
