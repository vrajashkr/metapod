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
import getValuefromJSON from "../utils/getValuefromJSON";


const specificNetworkDataMapper = {
    "Network ID": ["NetworkID"],
    "Network Gateway": ["Gateway"],
    "IP Address": ["IPAddress"],
    "MacAddress": ["MacAddress"]
}

const getNetworkDatafromJSON = (source, style) =>{
    let networkStructuresMapper = [
        [
            "Exposed Ports",
            <List>
                {
                    source["Config"]["ExposedPorts"] === undefined
                    ?
                    <ListItem>
                        N/A
                    </ListItem>
                    :
                    Object.keys(source["Config"]["ExposedPorts"]).map(port => 
                        <ListItem>
                            {port}
                        </ListItem>	
                    )	
                }
            </List>
        ],
        [
            "Network Mode",
            <Typography>
                {
                    source["HostConfig"]["NetworkMode"] === undefined
                    ?
                    "N/A"
                    :
                    source["HostConfig"]["NetworkMode"]
                }
            </Typography>
        ],
        [
            "Are all ports published?",
            <Typography>
                {
                    source["HostConfig"]["PublishAllPorts"] === undefined
                    ?
                    "N/A"
                    :
                    source["HostConfig"]["PublishAllPorts"].toString()
                }
            </Typography>
        ],
        [
            "Networks",
            <List>
                {
                    Object.keys(source["NetworkSettings"]["Networks"]).map(net =>
                        <ListItem>
                            <TableContainer component={Paper} style={{"textAlign":"center"}} className={style.margins}>
                                <Table aria-label="details table" >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Network Name
                                            </TableCell>
                                            <TableCell>
                                                {net}
                                            </TableCell>
                                        </TableRow>	
                                        {
                                            Object.keys(specificNetworkDataMapper).map(key =>
                                                <TableRow>
                                                    <TableCell>
                                                        {key}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            getValuefromJSON(source["NetworkSettings"]["Networks"][net], specificNetworkDataMapper[key])
                                                            ?
                                                            getValuefromJSON(source["NetworkSettings"]["Networks"][net], specificNetworkDataMapper[key])
                                                            :
                                                            "N/A"
                                                        }
                                                    </TableCell>
                                                </TableRow>	
                                            )
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ListItem>
                    )
                }
            </List>
        ]
    ]
    return networkStructuresMapper;
}

export default function NetworkDetailsSection(props){
    return(
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableBody>
                    {
                        getNetworkDatafromJSON(props.modaldata, props.styles).map((entry) =>
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