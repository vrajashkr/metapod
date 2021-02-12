import React, {Component} from 'react';
import { BrowserRouter as Router, Link, Route, withRouter } from "react-router-dom";
import './App.css';
import {Container} from 'react-bootstrap';

import Register from './components/auth/register';
import Dashboard from './components/dashboard'

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			userActive: false,
			email: '',
			password: ''

		}
	}

	updateActive = (e) => {
		this.setState({userActive: false})
		window.location.href = "http://localhost:3000"
	}

	updateEmail = (e) => {
		this.setState({email: e.target.value})
	}

	updatePassword = (e) => {
		this.setState({password: e.target.value})
	}

	register = (e) => {
        e.preventDefault();

        const reqOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: this.state.email, password : this.state.password})
        };

        fetch("/api/v1/register", reqOptions)
        .then(response => response.json())
        .then(data => {
            if (data.result === "user registered"){
                this.setState({userActive : true});
            	// window.location.href = "dashboard";
            }
            else if (data.result === "user already exists"){
                alert("Email-id entered already exists!");
            }
        });
    }

    login = (e) => {
    	e.preventDefault();

    	const reqOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email: this.state.email, password : this.state.password})
        };

        fetch("/api/v1/login", reqOptions)
        .then(response => response.json())
        .then(data => {
        	if (data.result === "user authenticated"){
        		// window.location.href += "dashboard"
        		this.setState({userActive : true});
            }
        	else if (data.result === "invalid credentials"){
        		alert("Email-id and password entered doesn't match!");
        	}
        	else if (data.result === "user not found"){
        		alert("Register the entered Email-id!");
        	}
        })
    }

	render() {
		if(this.state.userActive === false){
			return (  
	            <Container className="d-flex align-items-center justify-content-center"
	            	style={{minHeight: "100vh"}}
	            >
	            	<div className="w-100" style={{maxWidth: '600px'}}>
	                	<Register register={this.register} updatePassword={this.updatePassword}
	                	updateEmail={this.updateEmail} login={this.login} />
	                </div>
	            </Container>
	        );
		}
		else{
			return (
				<div>
					<Dashboard active={this.updateActive} />
				</div>
			);
		}
    }
}

export default App;
