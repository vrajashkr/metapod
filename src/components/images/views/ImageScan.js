import { Dialog, Slide, AppBar, Toolbar, Typography, IconButton, CircularProgress, Grid, Button, OutlinedInput, Snackbar } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReactMarkdown from 'react-markdown';
import download from 'downloadjs';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageScan(props){
    const [running, setRunning] = React.useState(false);
    const [output, setOutput] = React.useState("");

    const handleStartRun = () =>{
        setRunning(true);
        setOutput("");
        fetch("/api/v1/imagescan", {
            method: "get"
        }).then(response => {
            if (response.status === 200){
                response.json().then(result => {
                    setOutput("```" + result.message + "```");
                    setRunning(false);
                });
            }else{
                handleSnackOpen("An error has occurred!", "error");
                setRunning(false);
            } 
        }).catch(error => {
            console.log(error);
            setRunning(false);
            handleSnackOpen("A next-level error has occurred", "error");
        });
    }

    const handleDownload = () => {
        download(output, "image-vuln.txt", "text/plain");
    }

    const [snackOpen, setSnackOpen] = React.useState(false);
    const [snackMessage, setSnackMessage] = React.useState("");
    const [snackSeverity, setSnackSeverity] = React.useState("");
    
    const handleSnackOpen= (message, severity) => {
        setSnackMessage(message);
        setSnackSeverity(severity);
        setSnackOpen(true);
        setTimeout(() => {
            setSnackOpen(false);
        }, 5000);
    }

    return(
            <>
            <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
                <div style={{display:"flex"}}>
                    <AppBar className={props.styles.appBar}>
                        <Toolbar>
                            <Typography>
                                Snyk Image - Vulnerability Scan
                            </Typography>
                            <IconButton  edge="end" color="inherit" onClick={() => {props.handleClose()}} aria-label="close">
                                <CloseIcon/>
                            </IconButton>
                        </Toolbar>
                    </AppBar>
                
                    <Grid container direction="column" style={{marginTop:"5em", width:"100%"}} spacing={3} alignItems="center" justify="center">
                        <Grid item>
                            <Button 
                                disabled={running} 
                                variant="contained"
                                onClick={handleStartRun} 
                                endIcon={running ? <CircularProgress/> : <></>}>Begin Scan</Button>
                            <Button
                                disabled={output === ""}
                                variant="contained"
                                onClick={handleDownload}
                                endIcon={<GetAppIcon/>}
                            >Download</Button>
                        </Grid>
                        <Grid item>
                            <div style={{backgroundColor:"#e5e5e5", maxHeight:"75vh", maxWidth:"90vw", overflowY:"scroll", textAlign:"left"}}>
                                <ReactMarkdown>
                                    {output}
                                </ReactMarkdown>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
            <Snackbar open={snackOpen} anchorOrigin={{"vertical": "top", "horizontal":"right" }}>
                <Alert severity={snackSeverity}>
                    {snackMessage}
                </Alert>
            </Snackbar>
            </>
    );
}