import React, {Component} from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import './App.css';

import Dashboard from './components/dashboard';

class App extends Component { 
    render() {
        return (  
            <div>
                <Dashboard />
            </div>
        );
    }
}

export default App;
