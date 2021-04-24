import React from 'react';
import { BrowserRouter as Router} from "react-router-dom";

import "./css/generalStyle.css";

import Navbar from './components/Navbar.jsx';
import Addresses from './components/Addresses.jsx';


const App = () => {
    return (
        <Router>
            <div className="app">
                <Navbar />
                <Addresses />
            </div>
        </Router >
    )
}

export default App