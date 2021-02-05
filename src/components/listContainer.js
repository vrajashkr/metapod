import React, {Component} from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";

import Container from './container';
import Dashboard from './dashboard';

class ListContainer extends Component {
	constructor(){
		super();
		this.location = this.location.bind(this);
	}

	location(){
		console.log(window.location.href);
		if(window.location.href == "http://localhost:3000/listContainer"){
		  	document.getElementById("dashboard").style.display = "none";
		}
	}

	render(){
		{this.location()}
		return (
			<div id="containers">
				<Router>
					<nav>
						<Link to="/dashboard"
							onClick = {() => {document.getElementById("containers").style.display = "none";
												document.getElementById("dashboard").style.display = "initial";
											  console.log(this.props.count);
									  }}
						> Back </Link>
					</nav>
					<br />
					<table className="table table-dark">
						<thead>
							<tr>
								<th scope="col">Container Id</th>
								<th scope="col">Container Name</th>
								<th scope="col">Status</th>
								<th scope="col">Image Name</th>
								<th scope="col">More Info</th>
							</tr>
						</thead>
					</table>
					<div>
						{
							this.props.container_list.map((cont, i) => {
								return <Container 
											key = {i}
											id = {cont.id}
											name = {cont.name}
											status = {cont.status}
											image = {cont.image}
									   />
							})
						}
					</div>
					<Route path="/dashboard" render={() => {<Dashboard />}} />
				</Router>
			</div>
		);
	}
	
}

export default ListContainer;