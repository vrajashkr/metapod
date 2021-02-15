import { TextField, Typography, Button } from '@material-ui/core';
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
        let currentCPUValue = source["HostConfig"]["NanoCpus"] === undefined || source["HostConfig"]["NanoCpus"] === null
        ?
        "N/A"
        :
            source["HostConfig"]["NanoCpus"] === 0
            ?
            "Unlimited - system default (0)"
            :
            parseInt(source["HostConfig"]["NanoCpus"])/1000000000;
        
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
                    />
                ],
                [
                    "Memory Allocation (unit M)",
                    <TextField
                            label="Memory Allocation"
                            variant="standard"
                            value={currentMemoryValue}
                    />
                ]
            ];
        return data;
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
            <Button style={{marginTop:"2em"}} color="secondary" variant='contained'>Apply Changes</Button>
        </>
    )
}