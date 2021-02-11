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
import ListItemText from '@material-ui/core/ListItemText';



const mountDataMapper = {
    "Type" : "Type",
    "Source" : "Source",
    "Destination" : "Destination",
    "Read-Write ?": "RW"
}


export default function MountedStorageDataSection(props){
    return(
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableHead>
                    {
                        Object.keys(mountDataMapper).map(header => 
                            <TableCell>
                                <Typography>
                                    {header}
                                </Typography>
                            </TableCell>	
                        )
                    }
                </TableHead>
                <TableBody>
                    {
                        props.modaldata["Mounts"].map(entry => 
                            <TableRow>
                                {
                                    Object.keys(mountDataMapper).map(header =>
                                        <TableCell>
                                            <Typography>
                                                {
                                                    entry[mountDataMapper[header]] === undefined || entry[mountDataMapper[header]] === null
                                                    ?
                                                    "N/A"
                                                    :
                                                    entry[mountDataMapper[header]].toString()
                                                }
                                            </Typography>
                                        </TableCell>
                                    )		
                                }
                            </TableRow>
                        )	
                    }
                </TableBody>
            </Table>
        </TableContainer>
    )
}