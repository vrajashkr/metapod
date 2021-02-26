import React from 'react';
import Typography from '@material-ui/core/Typography';
import {CircularProgress, Grid} from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';

export default function ContainerState(props){
    const [working, setWorking] = React.useState(false);
    const [startEnabled, setStartEnabled] = React.useState(!props.modaldata["State"]["Running"]);
    const [stopEnabled, setStopEnabled] = React.useState(props.modaldata["State"]["Running"]);

    const handleClick = (containerName, action) => {
        setWorking(true);
        fetch("/api/v1/containers/"+containerName+"/execute/"+action)
		   .then(response => {
		   		response.json().then(data => {
                    setWorking(false);
		   		})
		    });
    }

    return(
        <Grid container direction="row" spacing={3}>
            <Grid item>
                <IconButton disabled={!startEnabled} color="inherit" onClick={() => {handleClick(props.modaldata.CName, "start")}} aria-label="sync">
                    <PlayArrowIcon/>
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton disabled={!stopEnabled} color="inherit" onClick={() => {handleClick(props.modaldata.CName, "stop")}} aria-label="sync">
                    <StopIcon/>
                </IconButton>
            </Grid>
            {
                working
                ?
                <Grid item>
                    <CircularProgress/>
                </Grid>
                :
                <></>
            }
        </Grid>
    )
}