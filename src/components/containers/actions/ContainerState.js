import React from 'react';
import Typography from '@material-ui/core/Typography';
import {CircularProgress, Grid ,Snackbar} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ContainerState(props){
    const [working, setWorking] = React.useState(false);
    const [startEnabled, setStartEnabled] = React.useState(!props.modaldata["State"]["Running"]);
    const [stopEnabled, setStopEnabled] = React.useState(props.modaldata["State"]["Running"]);

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
    const handleClick = (containerName, action) => {
        setWorking(true);
        fetch("/api/v1/containers/"+containerName+"/execute/"+action)
		   .then(response => {
		   		if (response.status === 200){
                    handleSnackOpen("Action " + action +" successfull","success");
                    if (action === "start"){
                        setStartEnabled(false);
                        setStopEnabled(true);
                    }else{
                        setStartEnabled(true);
                        setStopEnabled(false)
                    }

                }else{
                    handleSnackOpen("Action " + action +" failed","error");
                }
                setWorking(false);
		    });
    }

    return(
        <>
        <Grid container direction="row" spacing={3}>
            <Grid item>
                <IconButton disabled={!startEnabled || working} color="inherit" onClick={() => {handleClick(props.modaldata.CName, "start")}} aria-label="sync">
                    <PlayArrowIcon/>
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton disabled={!stopEnabled || working} color="inherit" onClick={() => {handleClick(props.modaldata.CName, "stop")}} aria-label="sync">
                    <StopIcon/>
                </IconButton>
            </Grid>
            {
                working
                ?
                <Grid item>
                    <CircularProgress style={{color:"white"}}/>
                </Grid>
                :
                <></>
            }
        </Grid>
        <Snackbar open={snackOpen} anchorOrigin={{"vertical": "top", "horizontal":"right" }}>
            <Alert severity={snackSeverity}>
                {snackMessage}
            </Alert>
        </Snackbar>
        </>
    )
}