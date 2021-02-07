import React from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Container from './container';
import Dashboard from './dashboard';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
	appBar: {
	  position: 'relative',
	},
	title: {
	  marginLeft: theme.spacing(2),
	  flex: 1,
	},
	margins :{
		marginTop: "1em",
		marginLeft: "1em",
	}
  }));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListContainer(props){

	const styles = useStyles();

	const [open, setOpen] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	
	const location = () => {
		console.log(window.location.href);
		if(window.location.href === "http://localhost:3000/listContainers"){
		  	document.getElementById("dashboard").style.display = "none";
		}
	}
	
	const handleClose = () =>{
		setOpen(false);
		setModalData({});
	}

	const handleOpen = (container) => {
		setModalData(container);
		setOpen(true);
	}

	return (
		<>
		<div id="containers">
			<Router>
				<nav>
					<Link to="/dashboard"
						onClick = {() => {document.getElementById("containers").style.display = "none";
											document.getElementById("dashboard").style.display = "initial";
									}}
					><Button size="large"> Back </Button></Link>
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
						props.container_list.map((cont, i) => {
							return <Container 
										key = {i}
										id = {cont.id}
										name = {cont.name}
										status = {cont.status}
										image = {cont.image}
										clickAction= {() => {handleOpen(cont)}}
									/>
						})
					}
				</div>
				<Route path="/dashboard" render={() => {<Dashboard />}} />
			</Router>
		</div>

		<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
			<AppBar className={styles.appBar}>
			<Toolbar>
				<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
				<CloseIcon />
				</IconButton>
				<Typography variant="h6" className={styles.title}>
					Container: {modalData.name}
				</Typography>
				<Button autoFocus color="inherit" onClick={handleClose}>
					save
				</Button>
			</Toolbar>
			</AppBar>
			<Typography variant="h5" className={styles.margins}>
				Container Details
			</Typography>
			<TableContainer component={Paper} style={{"width":"30%", "textAlign":"center"}} className={styles.margins}>
				<Table aria-label="details table" >
					<TableBody>
						<TableRow>
							<TableCell>
								<Typography>
									Container ID
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.id}
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Typography>
									Container Name
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.name}
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Typography>
									Container Status
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.status}
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Typography>
									Container Image
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.image}
								</Typography>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</TableContainer>
		</Dialog>
		</>
	);
}