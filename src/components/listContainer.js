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
import Container from './container';
import Dashboard from './dashboard';
import {CircularProgress, Grid} from '@material-ui/core';
import ContainerDetailsSection from "./ContainerDetailsSection";
import NetworkDetailsSection from './NetworkDetailsSection';
import SecurityDataSection from './SecurityDataSection';
import ResourceDataSection from './ResourceDataSection';
import MountedStorageDataSection from './MountedStorageDataSection';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Drawer from '@material-ui/core/Drawer';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Divider from '@material-ui/core/Divider';
import DnsIcon from '@material-ui/icons/Dns';
import InfoIcon from '@material-ui/icons/Info';
import SecurityIcon from '@material-ui/icons/Security';
import MemoryIcon from '@material-ui/icons/Memory';
import StorageIcon from '@material-ui/icons/Storage';
import EditIcon from '@material-ui/icons/Edit';

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

export default function ListContainer(props){

	const styles = useStyles();

	const [open, setOpen] = React.useState(false);
	const [dataReady, setDataReady] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	const [currentViewIndex, setCurrentViewIndex] = React.useState(0);
	
	const location = () => {
		console.log(window.location.href);
		if(window.location.href === "http://localhost:3000/listContainers"){
		  	document.getElementById("dashboard").style.display = "none";
		}
	}
	
	const handleClose = () =>{
		setOpen(false);
		setDataReady(false);
		setModalData({});
		setCurrentViewIndex(0);
	}

	const handleOpen = (container) => {
		setModalData(container);
		setOpen(true);
		fetch("/api/v1/containers/"+container.ContainerId).then(
			response =>{
				response.json().then((data)=>{
					setModalData(data);
					setDataReady(true);
				})
			}
		)
	}

	const getView = (source, index) => {
		let views =[
			<Typography>Click an option to begin</Typography>,
			<ContainerDetailsSection modaldata={source} styles={styles}/>,
			<NetworkDetailsSection modaldata={source} styles={styles}/>,
			<SecurityDataSection modaldata={source} styles={styles}/>,
			<ResourceDataSection modaldata={source} styles={styles}/>,
			<MountedStorageDataSection modaldata={source} styles={styles}/>
		]
		return views[index];
	}

	const viewHeadings = [
		"Click an option to view details",
		"Container Details",
		"Network Details",
		"Security Details",
		"Resource Details",
		"Mounted Storage Details"
	]
	return (
		<>
		<div id="containers">
			<Router>
				<nav>
					<Link to="/dashboard" style= {{textDecoration: "none"}}
						onClick = {() => {document.getElementById("containers").style.display = "none";
											document.getElementById("dashboard").style.display = "initial";
									}}
					><Button size="large"> Back </Button></Link>
				</nav>
				<br />
				<div style={{marginLeft: "4.5em"}}>
					<div style={{display: "grid", margin: "2em 0 3em 0",
	    			gridTemplateColumns: 'repeat(3, 30em)', gridAutoRows: 'auto', gridGap: '1em'}}>
						{
							props.container_list.map((cont, i) => {
								return <Container 
											key = {i}
											id = {cont.ContainerId}
											name = {cont.Name}
											status = {cont.Status}
											image = {cont.Image}
											clickAction= {() => {handleOpen(cont)}}
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
				<CircularProgress />
				:
				<div className={styles.root}>
				<AppBar className={styles.appBar}>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
					<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={styles.title}>
						Container: {modalData["Name"]}
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
						{[['Container Details',<InfoIcon/>], ['Network Details',<DnsIcon/> ], ['Security Details', <SecurityIcon/>], ['Resource Details', <MemoryIcon/>], ['Mounted Storage Details',<StorageIcon/>]].map((entry,index) => (
						<ListItem button key={entry[0]} onClick={()=>{setCurrentViewIndex(index+1)}}>
							<ListItemIcon>{entry[1]}</ListItemIcon>
							<ListItemText primary={entry[0]} />
						</ListItem>
						))}
					</List>
					<Divider />
					<List>
						{['Change Resource Allocation', 'Apply Security Rules'].map((text, index) => (
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