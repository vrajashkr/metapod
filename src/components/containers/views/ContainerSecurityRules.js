import { TableRow, TableHead, Button, Typography, Checkbox, CircularProgress, Grid, Snackbar } from '@material-ui/core';
import React from 'react';
import SecurityRules from './SecurityRules';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import MuiAlert from '@material-ui/lab/Alert';

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function ContainerSecurityRules(props){

    const findAppliedRules = (droppedCapabilities) => {
        let appliedRules = Array(SecurityRules.length).fill(false);

        if (!(droppedCapabilities === undefined || droppedCapabilities === null)){

            for (let i = 0; i < SecurityRules.length; i++){
                if (droppedCapabilities.includes(SecurityRules[i]["key"])){
                    // that capability has been dropped meaning the rule has been applied
                    appliedRules[i] = true;
                }
            }
        }

        return appliedRules;
    }

    const [applied, setApplied] = React.useState(findAppliedRules(props.modaldata["HostConfig"]["CapDrop"]));

    const tableHeadings = [
        "Index",
        "Rule",
        "Description",
        "Drop?",
    ];

    const handleChange = (index) => {
        let newApplication = applied.map(e => {return e});
        if (applied[index] === false){
            newApplication[index] = true;
        }else{
            newApplication[index] = false;
        }
        setApplied(newApplication);
    };

    const [processing, setProcessing] = React.useState(false);

    const handleApplyChange = () => {
        // Create JSON and make request
        let dataJSON = {
            "Rules": []
        };

        for (let i = 0; i < SecurityRules.length; i++){
            dataJSON["Rules"].push({"RuleName": SecurityRules[i].title, "Checked": applied[i]});
        }

        console.log(dataJSON);
        setProcessing(true);
        
        fetch("/api/v1/containers/"+props.modaldata["CName"]+"/rules", {
            method: "post",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataJSON)

        }).then((response) => { 

            console.log(response);
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
    };

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


    return (
        <>
        <TableContainer component={Paper} style={{"width":"100%","textAlign":"center"}} className={props.styles.margins}>
            <Table aria-label="details table" >
                <TableHead>
                    <TableRow>
                        {
                            tableHeadings.map(heading =>
                                <TableCell key={heading}>
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
                            <TableRow key={index}>
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
        <Grid container alignItems="center" justify="center" direction="column" spacing={3}>
            <Grid item xs={12}>
                <Button style={{marginTop:"2em"}} disabled={processing} color="secondary" variant='contained' onClick={handleApplyChange}>Apply Rule Changes</Button>
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
    );
}