import React from 'react';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {CircularProgress, Grid} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import IconButton from '@material-ui/core/IconButton';
import ReactMarkdown from 'react-markdown';

export default function LogSection(props){
    const [syncing, setSyncing] = React.useState(false);
    const [logsReady, setLogsReady] = React.useState(false);
    const [logData, setLogData] = React.useState("");

    React.useEffect(() => {
       handleSync(props.modaldata.CName);
    }, []);

    const handleSync = (containerName) => {
        setSyncing(true);
        fetch("/api/v1/containers/"+containerName+"/logs")
		   .then(response => {
		   		response.json().then(data => {
                    setSyncing(false);
                    setLogsReady(true);
                    setLogData("```" + data.data + "```");
		   		})
		    });
    }

    return(
        <>
        {
            !logsReady
            ?
            <CircularProgress/>
            :
            <></>
        }
        <Grid container direction="column" justify="flex-start" spacing={2}>
            <Grid item xs={12}>
                <Grid container justify="flex-start" spacing={5}>
                    <Grid item>
                        <IconButton disabled={syncing} color="inherit" onClick={() => {handleSync(props.modaldata.CName)}} aria-label="sync">
                            <SyncIcon/>
                        </IconButton>
                    </Grid>
                    {
                        syncing
                        ?
                        <Grid item>
                            <CircularProgress/>
                        </Grid>
                        :
                        <></>
                    }
                    
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <div style={{backgroundColor:"#e5e5e5", maxHeight:"400px", overflowY:"scroll", textAlign:"left"}}>
                    <ReactMarkdown>
                        {logData}
                    </ReactMarkdown>
                </div>
            </Grid>
        </Grid>
        </>
    )
}