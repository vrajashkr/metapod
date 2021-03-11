import React from 'react';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import getValuefromJSON from "../../../utils/getValuefromJSON";
import Typography from '@material-ui/core/Typography';

const dataMapper = {
    "Container Name": ["Name"],
    "Container ID": ["Id"],
    "Container Status": ["State","Status"],
    "Container Image": ["Config", "Image"],
    "Privileged": ["HostConfig","Privileged"],
    "Created Date": ["Created"],
    "Last Execution - Start": ["State","StartedAt"],
    "Last Execution - Finished": ["State", "FinishedAt"]
}

export default function ContainerDetailsSection(props){
    return(
        <TableContainer component={Paper} style={{"textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableBody>
                    {
                        Object.keys(dataMapper).map(key =>
                            <TableRow>
                                <TableCell>
                                    <Typography>
                                        {key}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {
                                            getValuefromJSON(props.modaldata,dataMapper[key]) === undefined || getValuefromJSON(props.modaldata,dataMapper[key]) === null
                                            ?
                                            "N/A"
                                            :
                                            getValuefromJSON(props.modaldata,dataMapper[key]).toString()
                                        }
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}