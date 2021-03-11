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

const getStructureFromJSON = (source) => {
    let data = [
        [
            "Image ID",
            <Typography>
                {
                    source["Id"] === undefined || source["Id"] === null
                    ?
                    "N/A"
                    :
                    source["Id"]
                }
            </Typography>
        ],
        [
            "Author",
            <Typography>
                {
                    source["Author"] === undefined || source["Author"] === null
                    ?
                    "N/A"
                    :
                        source["Author"] === ""
                        ?
                        "Author Unknown"
                        :
                        source["Author"]
                }
            </Typography>
        ],
        [
            "Image Command",
            <Typography>
                {
                    source["Config"]["Cmd"] === undefined || source["Config"]["Cmd"] === null
                    ?
                    "N/A"
                    :
                        source["Config"]["Cmd"] === ""
                        ?
                        "None"
                        :
                        source["Config"]["Cmd"]
                }
            </Typography>
        ],
        [
            "Image Entrypoint",
            <List>
                {
                    source["Config"]["Entrypoint"] === undefined || source["Config"]["Entrypoint"] === null
                    ?
                    <ListItem>
                        N/A
                    </ListItem>
                    :
                    source["Config"]["Entrypoint"].map(entry =>
                        <ListItem>
                            <Typography>
                                {entry}
                            </Typography>
                        </ListItem>
                    )
                }   
            </List>
        ],
        [
            "Image Environment",
            <List>
                {
                    source["Config"]["Env"] === undefined || source["Config"]["Env"] === null
                    ?
                    <ListItem>
                        N/A
                    </ListItem>
                    :
                    source["Config"]["Env"].map(entry =>
                        <ListItem>
                            <Typography>
                                {entry}
                            </Typography>
                        </ListItem>
                    )
                }   
            </List>
        ],
        [
            "Repository Tags",
            <List>
                {
                    source["RepoTags"] === undefined || source["RepoTags"] === null
                    ?
                    <ListItem>
                        N/A
                    </ListItem>
                    :
                    source["RepoTags"].map(entry => 
                        <ListItem>
                            {entry}
                        </ListItem>
                    )
                }
            </List>
        ],
        [
            "Created",
            <Typography>
                {
                    source["Created"] === undefined || source["Created"] === null
                    ?
                    "N/A"
                    :
                    source["Created"]
                }
            </Typography>
        ],
        [
            "Size",
            <Typography>
                {
                    source["Size"] === undefined || source["Size"] === null
                    ?
                    "Unknown"
                    :
                    parseInt(source["Size"])/(1024*1024) + " M"
                }
            </Typography>
        ],
        [
            "VirtualSize",
            <Typography>
                {
                    source["VirtualSize"] === undefined || source["VirtualSize"] === null
                    ?
                    "Unknown"
                    :
                    parseInt(source["VirtualSize"])/(1024*1024) + " M"
                }
            </Typography>
        ]
    ]
    return data;
}

export default function ImageDetailsSection(props){
    return (
        <TableContainer component={Paper} style={{"textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableBody>
                    {
                        getStructureFromJSON(props.modaldata).map((entry) =>
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