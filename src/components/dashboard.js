import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import ListContainer from './listContainer';
import ListImage from './listImage';

var container_style = {
    width: "175px",
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

	render(){
		{this.location()}
		return (
			<Router>
				<div id="dashboard">
	                <div className="row">
	                    <div className="col s12 center-align">
	                        <div className="flow-text grey-text text-darken-4">
	                            <h4> View the containers and images present on the host.</h4>
	                        </div>
	                        <br />
	                        <div className="col s6">
	                            <Link to="/listContainers" style={container_style} 
	                                className="btn btn-large waves-effect waves-light black accent-3"
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
							    		   		})
							    		    });
	                                }}
	                            >
	                            Containers
	                            </Link>
	                        </div>
	                        <div className="col s6">
	                            <Link to="/listImages" style={container_style}
	                                className="btn btn-large waves-effect waves-light black accent-3"
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
                                                })
                                            });
	                            	}}
	                            >
	                            Images
	                            </Link>
	                        </div>
	                    </div>
	                </div>
	            </div>	
                <Route path="/listContainers" render={() => <ListContainer container_list={this.state.allContainers} />}/>
                <Route path="/listImages" render={() => <ListImage image_list={this.state.allImages} />}/>
            </Router>
		);
	}
}

export default Dashboard;