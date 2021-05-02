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
                    <h1 className="text-light"> Página de inicio </h1>
                </Route>
                <Route path="/login" exact>
                    <Login path="login" />
                </Route>
                <Route path="/employee/login" exact>
                    <Login path="employee/login" />
                </Route>
                <Route path="/register" exact>
                    <Register />
                </Route>
                <Route path="/home" exact>
                    <Home />
                </Route>
                <Route>
                    <h1 className="text-light text-center" >¡Ups! La página a la que intentás acceder se perdió en la Atlántida &#127965;&#128561;</h1>
                    <h2 className="text-light text-center" >Podés volver a flote haciendo clic <a href="/">acá</a> &#127946;</h2>
                </Route>
            </Switch>
        </div>
    )
}

export default Addresses
