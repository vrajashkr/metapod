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

const securityDataMapper = (source) => {
    let securityStructuresMapper = [
        [
            "AppArmorProfile",
            <Typography>
                {
                    source["AppArmorProfile"]===undefined || source["AppArmorProfile"]=== null
                    ?
                    "N/A"
                    :
                    source["AppArmorProfile"]
                }
            </Typography>
        ],
        [
            "Read-Only Directories",
            <List>
                {
                    source["HostConfig"]["ReadonlyPaths"] === undefined || source["HostConfig"]["ReadonlyPaths"] === null
                    ?
                    <ListItem>
                        N/A
                    </ListItem>
                    :
                    source["HostConfig"]["ReadonlyPaths"].map(path =>
                        <ListItem>
                            <Typography>
                                {path}
                            </Typography>
                        </ListItem>	
                    )
                }
            </List>
        ],
        [
            "IPC Mode",
            <Typography>
                {
                    source["HostConfig"]["IpcMode"] === undefined ||  source["HostConfig"]["IpcMode"] === null
                    ?
                    "N/A"
                    :
                    source["HostConfig"]["IpcMode"]
                }
            </Typography>
        ]
    ]
    return securityStructuresMapper;
}

export default function SecurityDataSection(props){
    return(
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableBody>
                    {
                        securityDataMapper(props.modaldata).map((entry) =>
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