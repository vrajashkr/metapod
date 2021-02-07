import React from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Button from '@material-ui/core/Button';

import Image from './image';
import Dashboard from './dashboard';

export default function ListImage(props){

	const [open, setOpen] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	
	const location = () => {
		console.log(window.location.href);
		if(window.location.href === "http://localhost:3000/listImages"){
		  	document.getElementById("dashboard").style.display = "none";
		}
	}
	
	const handleClose = () =>{
		setOpen(false);
		setModalData({});
	}

	const handleOpen = (image) => {
		setModalData(image);
		setOpen(true);
	}

	return (
		<>
		<div id="images">
			<Router>
				<nav>
					<Link to="/dashboard"
						onClick = {() => {document.getElementById("images").style.display = "none";
											document.getElementById("dashboard").style.display = "initial";
									}}
					><Button size="large"> Back </Button></Link>
				</nav>
				<br />
				<table className="table table-dark">
					<thead>
						<tr>
							<th scope="col">Image Id</th>
							<th scope="col">Image Tags</th>
							<th scope="col">Image Repository</th>
							<th scope="col">Image Created</th>
							<th scope="col">More Info</th>
						</tr>
					</thead>
				</table>
				<div>
					{
						props.image_list.map((img, i) => {
							return <Image 
										key = {i}
										id = {img.id}
										tags = {img.tags}
										repository = {img.repository}
										created = {img.created}
										clickAction= {() => {handleOpen(img)}}
									/>
						})
					}
				</div>
				<Route path="/dashboard" render={() => {<Dashboard />}} />
			</Router>
		</div>
		</>
	);
}