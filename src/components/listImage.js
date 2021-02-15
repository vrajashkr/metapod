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
import Image from './image';
import Dashboard from './dashboard';
import { CircularProgress, Drawer } from '@material-ui/core';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import InfoIcon from '@material-ui/icons/Info';
import EditIcon from '@material-ui/icons/Edit';
import ImageDetailsSection from './ImageDetailsSection';
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import RefreshIcon from '@material-ui/icons/Refresh';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex',
	  },
	appBar: {
	  position: 'fixed',
	  zIndex: theme.zIndex.drawer + 1,
	},
	title: {
	  marginLeft: theme.spacing(2),
	  flex: 1,
	},
	margins :{
		marginTop: "1em",
		marginLeft: "1em",
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0,
	},
	drawerPaper: {
		width: drawerWidth,
	},
	drawerContainer: {
		overflow: 'auto',
	},
	content: {
		flexGrow: 1,
		padding: theme.spacing(3),
	}
  }));

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ListImage(props){

	const [open, setOpen] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	const [dataReady, setDataReady] = React.useState(false);
	const [currentViewIndex, setCurrentViewIndex] = React.useState(0);
	

	const getView = (source, index) => {
		let data = [
			<Typography>Select an Option to get started</Typography>,
			<ImageDetailsSection modaldata={source} styles={styles}/>
		]
		return data[index];
	}

	const location = () => {
		console.log(window.location.href);
		if(window.location.href === "http://localhost:3000/listImages"){
		  	document.getElementById("dashboard").style.display = "none";
		}
	}
	
	const handleClose = () =>{
		setOpen(false);
		setModalData({});
		setDataReady(false);
		setCurrentViewIndex(0);
	}

	const handleOpen = (image) => {
		setOpen(true);
		fetch("/api/v1/images/"+image.ImageId).then(
			response => {
				response.json().then(
					data => {
						setModalData(data);
						setDataReady(true);
					}
				)
			}
		)
	}

	const viewHeadings = [
		"Click an option to view details",
		"Image Details",
	]

	let styles = useStyles();
	return (
		<>
		<div id="images">
			<Router>
				<nav className="navbar navbar-expand-lg bg-dark">
					<Link to="/dashboard" style= {{textDecoration: "none"}}
						onClick = {() => {document.getElementById("images").style.display = "none";
											document.getElementById("dashboard").style.display = "initial";
									}}
					><KeyboardBackspaceIcon fontSize="large"/></Link>
				</nav>
				<nav style={{height: "4em"}}>
					<p style={{margin: "0 1.5em"}}>Click to refresh: <Button><RefreshIcon fontSize="large" onClick={props.update}/></Button></p>
				</nav>
				<br />
				<div style={{marginLeft: "60px"}}>
					<div style={{display: "grid", margin: "20px 0 50px 0",
	    			gridTemplateColumns: 'repeat(3, 30rem)', gridAutoRows: 'auto', gridGap: '1em'}}>
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
				</div>
				<Route path="/dashboard" render={() => {<Dashboard />}} />
			</Router>
		</div>
		<Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
			{
				!dataReady
				?
				<CircularProgress/>
				:
				<div className={styles.root}>
					<AppBar className={styles.appBar}>
					<Toolbar>
						<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
						<CloseIcon />
						</IconButton>
						<Typography variant="h6" className={styles.title}>
							Image: {modalData["Id"]}
						</Typography>
						<Button autoFocus color="inherit" onClick={handleClose}>
							save
						</Button>
					</Toolbar>
					</AppBar>
					<Drawer
						className={styles.drawer}
						variant="permanent"
						classes={{
							paper: styles.drawerPaper,
						}}
					>
						<Toolbar />
						<div className={styles.drawerContainer}>
							<List>
								{[['Image Details',<InfoIcon/>]].map((entry,index) => (
								<ListItem button key={entry[0]} onClick={()=>{setCurrentViewIndex(index+1)}}>
									<ListItemIcon>{entry[1]}</ListItemIcon>
									<ListItemText primary={entry[0]} />
								</ListItem>
								))}
							</List>
							<Divider />
							<List>
								{['Apply Security Rules'].map((text, index) => (
								<ListItem button key={text}>
									<ListItemIcon><EditIcon/></ListItemIcon>
									<ListItemText primary={text} />
								</ListItem>
								))}
							</List>
						</div>
					</Drawer>
					<main className={styles.content} style={{"textAlign":"center"}}>
						<Toolbar/>
						<Typography style={{fontSize:"1.5rem"}}>
							{viewHeadings[currentViewIndex]}
						</Typography>
						{
							getView(modalData,currentViewIndex)
						}
					</main>
				</div>
			}
			
		</Dialog>

		</>
	);
}