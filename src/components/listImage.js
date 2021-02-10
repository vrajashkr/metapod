import React from 'react';
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Image from './image';
import Dashboard from './dashboard';

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

	let styles = useStyles();
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
				<div style={{display: "grid", margin: "20px 0 50px 0",
    			gridTemplateColumns: 'repeat(5, 30rem)', gridAutoRows: 'auto', gridGap: '1em'}}>
					{
						props.image_list.map((img, i) => {
							return <Image 
										key = {i}
										id = {img.ImageId}
										tags = {img.Tag}
										repository = {img.Repository}
										created = {img.Created}
										clickAction= {() => {handleOpen(img)}}
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
					Image: {modalData.id}
				</Typography>
				<Button autoFocus color="inherit" onClick={handleClose}>
					save
				</Button>
			</Toolbar>
			</AppBar>
			<Typography variant="h5" className={styles.margins}>
				Image Details
			</Typography>
			<TableContainer component={Paper} style={{"width":"30%", "textAlign":"center"}} className={styles.margins}>
				<Table aria-label="details table" >
					<TableBody>
						<TableRow>
							<TableCell>
								<Typography>
									Image ID
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
									Image Tags
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.tags}
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Typography>
									Image Repository
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.repository}
								</Typography>
							</TableCell>
						</TableRow>

						<TableRow>
							<TableCell>
								<Typography>
									Image Created Date
								</Typography>
							</TableCell>
							<TableCell>
								<Typography>
									{modalData.created}
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