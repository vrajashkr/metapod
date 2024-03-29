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
import ContainerCard from './containers/views/ContainerCard';
import Dashboard from './dashboard';
import {CircularProgress, Grid} from '@material-ui/core';
import ContainerDetailsSection from "./containers/views/ContainerDetailsSection";
import NetworkDetailsSection from './containers/views/NetworkDetailsSection';
import SecurityDataSection from './containers/views/SecurityDataSection';
import ResourceDataSection from './containers/views/ResourceDataSection';
import MountedStorageDataSection from './containers/views/MountedStorageDataSection';
import ChangeContainerResourceAlloc from './containers/views/ChangeContainerResourceAlloc';
import ContainerSecurityRules from './containers/views/ContainerSecurityRules';
import LogsSection from './containers/views/LogsSection';
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
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace';
import RefreshIcon from '@material-ui/icons/Refresh';
import SyncIcon from '@material-ui/icons/Sync';
import ListAltIcon from '@material-ui/icons/ListAlt';
import ContainerState from './containers/actions/ContainerState';
import Benchmark from './containers/views/Benchmark';
import AdditionalRulesSection from './containers/views/AdditionalRulesSection';

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
	const [benchOpen, setBenchOpen] = React.useState(false);
	const [dataReady, setDataReady] = React.useState(false);
	const [modalData, setModalData] = React.useState({});
	const [syncing, setSyncing] = React.useState(false);
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

	const handleBenchClose = () => {
		setBenchOpen(false);
	}

	const makeContainerDataRequest = (container) => {
		fetch("/api/v1/containers/"+container.Name).then(
			response =>{
				response.json().then((data)=>{
					data["CName"] = container.Name;
					setModalData(data);
					setDataReady(true);
					setSyncing(false);
				})
			}
		)
	}

	const handleOpen = (container) => {
		setOpen(true);
		makeContainerDataRequest(container);
	}

	const handleSync = (container) => {
		setDataReady(false);
		setSyncing(true);
		makeContainerDataRequest(container);
	}

	const getView = (source, index) => {
		let views =[
			<Typography>Click an option to begin</Typography>,
			<ContainerDetailsSection modaldata={source} styles={styles}/>,
			<NetworkDetailsSection modaldata={source} styles={styles}/>,
			<SecurityDataSection modaldata={source} styles={styles}/>,
			<ResourceDataSection modaldata={source} styles={styles}/>,
			<MountedStorageDataSection modaldata={source} styles={styles}/>,
			<LogsSection modaldata={source} styles={styles}/>,
			<ChangeContainerResourceAlloc modaldata={source} styles={styles}/>,
			<ContainerSecurityRules styles={styles} modaldata={source}/>,
			<AdditionalRulesSection styles={styles} modaldata={source}/>
		]
		return views[index];
	}

	const viewHeadings = [
		"Click an option to view details",
		"Container Details",
		"Network Details",
		"Security Details",
		"Resource Details",
		"Mounted Storage Details",
		"Container Logs",
		"Change Resource Allocation",
		"Security Rules"
	]
	return (
		<>
		<div id="containers">
			<Router>
				<nav class="navbar navbar-expand-lg bg-dark">
					<Link to="/dashboard" style= {{textDecoration: "none"}}
						onClick = {() => {document.getElementById("containers").style.display = "none";
											document.getElementById("dashboard").style.display = "initial";
									}}
					><KeyboardBackspaceIcon fontSize="large"/></Link>
				</nav>
				<nav style={{height: "4em"}}>
					<p style={{margin: "0 1.5em"}}>Click to refresh: <Button><RefreshIcon fontSize="large" onClick={props.update}/></Button><Button variant="contained" onClick={() => {setBenchOpen(true)}}>Docker Bench</Button></p>
				</nav>
				<br />
				<div style={{marginLeft: "4.5em"}}>
					<div style={{display: "grid", margin: "2em 0 3em 0",
	    			gridTemplateColumns: 'repeat(3, 30em)', gridAutoRows: 'auto', gridGap: '1em'}}>
						{
							props.container_list.map((cont, i) => {
								return <ContainerCard
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
					<Grid container direction="row" justify="center" style={{width:"100%"}} alignItems="center">
						<Grid item xs={1}>
							<IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
								<CloseIcon />
							</IconButton>
						</Grid>
						<Grid item xs={6}>
							<Typography variant="h6" className={styles.title}>
								Container: {modalData["Name"]}
							</Typography>
						</Grid>
						<Grid item xs={5}>
							<Grid item>
								<ContainerState modaldata={modalData}/>
							</Grid>
						</Grid>
					</Grid>
					
					<IconButton disabled={syncing} edge="end" color="inherit" onClick={() => {handleSync(modalData)}} aria-label="sync">
						<SyncIcon/>
					</IconButton>
			
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
						{[['Container Details',<InfoIcon/>], ['Network Details',<DnsIcon/> ], ['Security Details', <SecurityIcon/>], ['Resource Details', <MemoryIcon/>], ['Mounted Storage Details',<StorageIcon/>], ['Container Logs',<ListAltIcon/>]].map((entry,index) => (
						<ListItem button key={entry[0]} onClick={()=>{setCurrentViewIndex(index+1)}}>
							<ListItemIcon>{entry[1]}</ListItemIcon>
							<ListItemText primary={entry[0]} />
						</ListItem>
						))}
					</List>
					<Divider />
					<List>
						{['Change Resource Allocation', 'Apply Security Rules', 'Additional Rules'].map((text, index) => (
						<ListItem button key={text} onClick={()=>{setCurrentViewIndex(index+5+2)}}>
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
		<Benchmark open={benchOpen} handleClose={handleBenchClose} styles={styles}/>
		</>
	);
}