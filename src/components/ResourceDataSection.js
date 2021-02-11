import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';

const resourceDataMapper = (source) => {
    let resourceStructureMapper = [
        [
            "CPU Allocation",
            <Typography>
                {
                    source["HostConfig"]["NanoCpus"] === undefined || source["HostConfig"]["NanoCpus"] === null
                    ?
                    "N/A"
                    :
                    parseInt(source["HostConfig"]["NanoCpus"])/1000000000
                }
            </Typography>
        ],
        [
            "Memory Allocation",
            <Typography>
                {   
                    source["HostConfig"]["Memory"] === undefined || source["HostConfig"]["Memory"] === null
                    ?
                    "N/A"
                    :
                    (source["HostConfig"]["Memory"]/(1024*1024)).toString() + "M"
                }
            </Typography>
        ]
    ]
    return resourceStructureMapper;
}

export default function ResourceDataSection(props){
    return (
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableBody>
                    {
                        resourceDataMapper(props.modaldata).map((entry) =>
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
    )
}