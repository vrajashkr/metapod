import { TextField, Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import React from 'react'
import ResourceDataSection from './ResourceDataSection';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';

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
                            value={currentCPUValue}
                            id="cpualloc"
                    />
                ],
                [
                    "Memory Allocation (unit M)",
                    <TextField
                            label="Memory Allocation"
                            variant="standard"
                            value={currentMemoryValue}
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
        });
        
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
                                <TableRow>
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
        </>
    )
}