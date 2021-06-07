import {Route, Switch} from "react-router-dom";

import Home from '../views/Home.jsx';
import Landing from '../views/Landing.jsx';
import Login from './Login.jsx';
import Navbar from './Navbar.jsx';
import Places from './Places';
import React from 'react'
import Register from './Register.jsx';
import Transports from './Transports.jsx';
import Routes from './Routes.jsx';
import Drivers from './Drivers.jsx';
import Trips from './Trips.jsx';
import Products from './Products.jsx';
import Comments from './Comments.jsx';
import UserConfiguration from './UserConfiguration.jsx';
import {useHistory} from "react-router-dom";
import CartConfirmation from "./CartConfirmation";


const Addresses = () => {
    const history = useHistory();
    const [userData, setUserData] = React.useState(JSON.parse(localStorage.getItem("userData")));

    React.useEffect(() => {
        return history.listen(() => {
            setUserData(JSON.parse(localStorage.getItem("userData")));
        })
    }, [history]);

    return (
        <div>
            <Navbar userData={userData} />
            <Switch>
                <Route path="/" exact>
                    {/*<h1 className="text-light"> Página de inicio </h1> */}
                    <Landing />
                </Route>
                <Route path="/login" exact>
                    <Login path="login"/>
                </Route>
                <Route path="/employee/login" exact>
                    <Login path="employee/login"/>
                </Route>
                <Route path="/register" exact>
                    <Register/>
                </Route>
                <Route path="/home" exact>
                    <Home/>
                </Route>
                <Route path="/places" exact>
                    <Places/>
                </Route>
                <Route path="/transports" exact>
                    <Transports/>
                </Route>
                <Route path="/drivers" exact>
                    <Drivers/>
                </Route>
                <Route path="/routes" exact>
                    <Routes/>
                </Route>
                <Route path="/trips" exact>
                    <Trips/>
                </Route>
                <Route path="/products" exact>
                    <Products/>
                </Route>
                <Route path="/userConfiguration" exact>
                    <UserConfiguration/>
                </Route>
                <Route path="/comments" exact>
                    <Comments/>
                </Route>
                <Route path="/cartConfirmation" exact>
                    <CartConfirmation/>
                </Route>
                <Route>
                    <h1 className="text-light text-center">¡Ups! La página a la que intentás acceder se perdió en la
                        Atlántida &#127965;&#128561;</h1>
                    <h2 className="text-light text-center">Podés volver a flote haciendo clic <a
                        href="/">acá</a> &#127946;</h2>
                </Route>
            </Switch>
        </div>
    )
};

export default Addresses
