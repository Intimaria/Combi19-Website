import React from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import "./css/generalStyle.css";
import Addresses from './components/Addresses.jsx';
const App = () => {
    return (
        <Router>
            <div className="app">
                <Addresses />
            </div>
        </Router >
    )
}

export default App
