import { Dialog, Slide, AppBar, Toolbar, Typography, IconButton, CircularProgress, Grid, Button, OutlinedInput } from '@material-ui/core';
import React from 'react';
import CloseIcon from '@material-ui/icons/Close';
import GetAppIcon from '@material-ui/icons/GetApp';
import ReactMarkdown from 'react-markdown';
import download from 'downloadjs';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function Benchmark(props){
    const [running, setRunning] = React.useState(false);
    const [output, setOutput] = React.useState("");

    const handleStartRun = () =>{
        setRunning(true);
        setOutput("");
        fetch("/api/v1/benchmark", {
            method: "get"
        }).then(response => {
            response.json().then(result => {
                setOutput("```" + result.message + "```");
                setRunning(false);
            })
        })
    }

    const handleDownload = () => {
        download(output, "benchmark.txt", "text/plain");
    }

    return(
            <Dialog fullScreen open={props.open} onClose={props.handleClose} TransitionComponent={Transition}>
                <div style={{display:"flex"}}>
                    <AppBar className={props.styles.appBar}>
                        <Toolbar>
                            <Typography>
                                Docker Security Benchmark
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
                                endIcon={running ? <CircularProgress/> : <></>}>Begin Benchmark</Button>
                            <Button
                                disabled={output === ""}
                                variant="contained"
                                onClick={handleDownload}
                                endIcon={<GetAppIcon/>}
                            >Download</Button>
                        </Grid>
                        <Grid item>
                            <div style={{backgroundColor:"#e5e5e5", maxHeight:"500px", overflowY:"scroll", textAlign:"left"}}>
                                <ReactMarkdown>
                                    {output}
                                </ReactMarkdown>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Dialog>
    );
}