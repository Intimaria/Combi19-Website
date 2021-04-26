import React from 'react'
import { Switch, Route } from "react-router-dom";

import Login from './Login.jsx';
import Register from './Register.jsx';
import Home from './Home.jsx';
import Navbar from './Navbar.jsx';
import { useHistory } from "react-router-dom";

const Addresses = () => {
    const history = useHistory();
    const [userData, setUserData] = React.useState(JSON.parse(localStorage.getItem("userData")));

    React.useEffect(() => {
        return history.listen(() => { 
            setUserData(JSON.parse(localStorage.getItem("userData")));
        }) 
     },[history])
     
    return (
        <div>
            <Navbar userData={userData} />
            <Switch>
                <Route path="/" exact>
                    <h1 className="text-light"> Pagina de Inicio </h1>
                </Route>
                <Route path="/login" exact>
                    <Login path="" />
                </Route>
                <Route path="/login/employees" exact>
                    <Login path="employees" />
                </Route>
                <Route path="/register" exact>
                    <Register />
                </Route>
                <Route path="/home" exact>
                    <Home />
                </Route>
                <Route>
                    <h2 className="text-light" >Page Don't Found - Error 404</h2>
                </Route>
            </Switch>
        </div>
    )
}

export default Addresses
