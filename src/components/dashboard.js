import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { Card, Form, Button } from 'react-bootstrap';

import ListContainer from './listContainer';
import ListImage from './listImage';

var container_style = {
    width: "250px",
    height: "55px",
    borderRadius: "3px",
    letterSpacing: "1.5px"
}

class Dashboard extends Component {
	constructor(props) {
        super(props);
        this.state = {
            allContainers: [],
            allImages: []
        }

        this.location = this.location.bind(this);
        this.containerUpdate = this.containerUpdate.bind(this);
        this.imageUpdate = this.imageUpdate.bind(this);
    } 

    location(){
    	if(window.location.href === "http://localhost:3000/dashboard"){
    		if(document.getElementById("containers")){
    			document.getElementById("containers").style.display = "none";
    		}
    		if(document.getElementById("images")){
    			document.getElementById("images").style.display = "none";
    		}
		}
    }

    containerUpdate(e){
    	e.preventDefault();

    	fetch("/api/v1/containers")
		   .then(response => {
		   		response.json().then(data => {
                    console.log(data);
		   			this.setState({allContainers : data.containers});
		   			if (this.state.allContainers.length == 0){
		   				alert("No containers present on the host!");
		   			}
		   		})
		    });

    }

    imageUpdate(e){
    	e.preventDefault();

    	fetch("/api/v1/images")
           .then(response => {
                response.json().then(data => {
                    console.log(data);
                    this.setState({allImages : data.images});
                    if (this.state.allImages.length == 0){
		   				alert("No images present on the host!");
		   			}
                })
            });
    }

	render(){
		{this.location()}
		return (
			<Router>
				<div id="dashboard">
					<nav>
						<Button 
						style={{width: "10em", height: "3em", margin: "0.20em 0 0 0", marginRight: "0.5em", 
							opacity:0.8, float: "right", outline: "none",
							borderStyle: "none"}} size="lg" onClick={this.props.active}> Logout </Button>
					</nav>
	                <div className="row">
	                    <div className="col s12 center-align">
	                        <div className="flow-text grey-text text-darken-4">
	                        	<br /><br /><br /><br />
	                        	<h1><i className="material-icons">code</i> Metapod </h1>
	                            <h3> A tool to safeguard containers and images present on the host!</h3>
	                        </div>
	                        <br />
	                        <div className="col s6">
	                            <Link to="/listContainers" 
	                                onClick={() => {
	                                	document.getElementById("dashboard").style.display = "none";
										if(document.getElementById("containers")){	  
											document.getElementById("containers").style.display = "initial";
										}

	                                	fetch("/api/v1/containers")
							    		   .then(response => {
							    		   		response.json().then(data => {
                                                    console.log(data);
							    		   			this.setState({allContainers : data.containers});
							    		   			if (this.state.allContainers.length == 0){
							    		   				alert("No containers present on the host!");
							    		   			}
							    		   		})
							    		    });
	                                }}
	                            >
	                            <Button style={{width: "20em", height: "3em", backgroundColor: "black", borderStyle: "none"}} size="lg">
	                            View Containers
	                            </Button></Link>
	                        </div>
	                        <div className="col s6">
	                            <Link to="/listImages"	   
	                                onClick={() => {
                                        document.getElementById("dashboard").style.display = "none";
                            			if(document.getElementById("images")){	  
                            				document.getElementById("images").style.display = "initial";
                            			}

                                        fetch("/api/v1/images")
                                           .then(response => {
                                                response.json().then(data => {
                                                    console.log(data);
                                                    this.setState({allImages : data.images});
                                                    if (this.state.allContainers.length == 0){
							    		   				alert("No images present on the host!");
							    		   			}
                                                })
                                            });
	                            	}}
	                            >
	                            <Button style={{width: "20em", height: "3em", backgroundColor: "black", borderStyle: "none"}} size="lg"> 
	                            View Images
	                            </Button></Link>
	                        </div>
	                    </div>
	                </div>
	            </div>	
                <Route path="/listContainers" render={() => <ListContainer container_list={this.state.allContainers} 
                update={this.containerUpdate} />}/>
                <Route path="/listImages" render={() => <ListImage image_list={this.state.allImages} 
                update={this.imageUpdate} />}/>
            </Router>
		);
	}
}

export default Dashboard;