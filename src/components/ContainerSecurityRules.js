import { TableRow, TableHead, Button, Typography, Checkbox } from '@material-ui/core';
import React from 'react';
import SecurityRules from './SecurityRules';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';


export default function ContainerSecurityRules(props){

    const [applied, setApplied] = React.useState(Array(SecurityRules.length).fill(false));

    const tableHeadings = [
        "Index",
        "Rule",
        "Description",
        "Enabled?",
    ]

    const handleChange = (index) => {
        let newApplication = applied.map(e => {return e});
        if (applied[index] === false){
            newApplication[index] = true;
        }else{
            newApplication[index] = false;
        }
        setApplied(newApplication);
    };

    return (
        <>
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableHead>
                    <TableRow>
                        {
                            tableHeadings.map(heading =>
                                <TableCell>
                                    <Typography>
                                        {heading}
                                    </Typography>
                                </TableCell>
                            )
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                    {
                        SecurityRules.map((entry,index) =>
                            <TableRow>
                                <TableCell>
                                    <Typography>
                                        {index}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {entry["title"]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography>
                                        {entry["desc"]}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Checkbox
                                        checked={applied[index]}
                                        onClick={() => {handleChange(index)}}
                                    />
                                </TableCell>
                            </TableRow>
                        )
                    }
                </TableBody>
            </Table>
        </TableContainer>
        <Button style={{marginTop:"2em"}} color="secondary" variant='contained'>Apply Rule Changes</Button>
        </>
    );
}