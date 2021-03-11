import { TextField, Typography, Button, Grid, CircularProgress, Snackbar } from '@material-ui/core';
import React from 'react'
import ResourceDataSection from './ResourceDataSection';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ChangeContainerResourceAlloc(props){

    const resourcesMapper = (source) => {
        let currentCPUValue = source["HostConfig"]["CpuQuota"] === undefined || source["HostConfig"]["CpuQuota"] === null
        ?
        "N/A"
        :
            source["HostConfig"]["CpuQuota"] === 0
            ?
            "Unlimited - system default (0)"
            :
            parseInt(source["HostConfig"]["CpuQuota"])/100000;
        
        let currentMemoryValue = source["HostConfig"]["Memory"] === undefined || source["HostConfig"]["Memory"] === null
        ?
        "N/A"
        :
            source["HostConfig"]["Memory"] === 0
            ?
            "Unlimited - system default (0)"
            :
            (source["HostConfig"]["Memory"]/(1024*1024)).toString();

        let data = [
                        [
                    "CPU Allocation",
                    <TextField
                            label="CPU Allocation"
                            variant="standard"
                            defaultValue={currentCPUValue}
                            id="cpualloc"
                    />
                ],
                [
                    "Memory Allocation (unit M)",
                    <TextField
                            label="Memory Allocation"
                            variant="standard"
                            defaultValue={currentMemoryValue}
                            id="memalloc"
                    />
                ]
            ];
        return data;
    }

    const [processing, setProcessing] = React.useState(false);

    const handleApply = () => {
        let dataJSON = {
            "CpuQuota": 0,
            "Memory" : 0
        };
        
        let cpu = parseFloat(document.getElementById("cpualloc").value) * 100000;
        let mem = parseInt(document.getElementById("memalloc").value) * 1024 * 1024;

        dataJSON["CpuQuota"] = isNaN(cpu) ? 0 : cpu;
        dataJSON["Memory"] = isNaN(mem) ? 0 : mem;
        
        setProcessing(true);
        console.log(dataJSON);

        fetch("/api/v1/containers/"+props.modaldata["CName"]+"/resources", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJSON)
        })
        .then((response) => { 
            console.log(response)
            setProcessing(false);
            if (response.status === 200){
                handleSnackOpen("Success!", "success");
            }else{
                handleSnackOpen("An error has occurred!", "error");
            }
        }).catch(error => {
            console.log(error);
            setProcessing(false);
            handleSnackOpen("A next-level error has occurred", "error");
        });
        
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
            <ResourceDataSection modaldata={props.modaldata} styles={props.styles}/>
            <Typography style={{fontSize:"1.3rem", marginTop:"2em"}} >
                New Values
            </Typography>
            <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
                <Table aria-label="details table" >
                    <TableBody>
                        {
                            resourcesMapper(props.modaldata).map((entry) =>
                                <TableRow key={entry[0]}>
                                    <TableCell>
                                        <Typography>
                                            {entry[0]}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {
                                            entry[1]
                                        }
                                    </TableCell>
                                </TableRow>
                            )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container alignItems="center" justify="center" direction="column" spacing={3}>
                <Grid item xs={12}>
                    <Button style={{marginTop:"2em"}} disabled={processing} color="secondary" variant='contained' onClick={handleApply}>Apply Changes</Button>
                </Grid>
                {
                    processing 
                    ?
                    <Grid item xs={12}> 
                        <CircularProgress/> 
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